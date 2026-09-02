import { dbClient } from '../../db/client.js';

/**
 * Budgets Controller — Full CRUD
 * All money in BIGINT paise. User-scoped (tenant-isolated).
 */
export class BudgetsController {
    /**
     * GET /api/v1/budgets
     * Returns all budgets for the authenticated user.
     */
    static async listBudgets(req, res, next) {
        try {
            const userId = req.user.userId;
            const query = `
                SELECT budget_id, category, budgeted_paise, spent_paise,
                       remaining_paise, rollover_paise, period, status, is_active,
                       created_at, updated_at
                FROM budgets
                WHERE user_id = $1 AND is_active = true
                ORDER BY category ASC;
            `;
            const result = await dbClient.query(query, [userId]);
            const budgets = result.rows.map(row => ({
                ...row,
                budgeted_paise: parseInt(row.budgeted_paise, 10),
                spent_paise: parseInt(row.spent_paise, 10),
                remaining_paise: parseInt(row.remaining_paise, 10),
                rollover_paise: parseInt(row.rollover_paise, 10),
                pct_used: row.budgeted_paise > 0
                    ? Math.round((parseInt(row.spent_paise, 10) / parseInt(row.budgeted_paise, 10)) * 100)
                    : 0,
                status: parseInt(row.spent_paise, 10) > parseInt(row.budgeted_paise, 10)
                    ? 'over'
                    : parseInt(row.spent_paise, 10) >= parseInt(row.budgeted_paise, 10) * 0.9
                        ? 'warning'
                        : parseInt(row.spent_paise, 10) <= parseInt(row.budgeted_paise, 10) * 0.25
                            ? 'under'
                            : 'on_track',
            }));
            res.json({ budgets });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/budgets
     * Create a new budget.
     */
    static async createBudget(req, res, next) {
        try {
            const userId = req.user.userId;
            const { category, budgeted_paise, period = 'monthly' } = req.body;
            if (!category || budgeted_paise == null) {
                return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'category and budgeted_paise are required' });
            }
            const query = `
                INSERT INTO budgets (user_id, category, budgeted_paise, period)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id, category, period)
                DO UPDATE SET budgeted_paise = $3, updated_at = NOW()
                RETURNING *;
            `;
            const result = await dbClient.query(query, [userId, category, budgeted_paise, period]);
            res.status(201).json({ budget: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/v1/budgets/:id
     * Update a budget (amount, status).
     */
    static async updateBudget(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { budgeted_paise, rollover_paise, is_active } = req.body;
            const query = `
                UPDATE budgets
                SET budgeted_paise = COALESCE($3, budgeted_paise),
                    rollover_paise = COALESCE($4, rollover_paise),
                    is_active = COALESCE($5, is_active),
                    updated_at = NOW()
                WHERE budget_id = $2 AND user_id = $1
                RETURNING *;
            `;
            const result = await dbClient.query(query, [userId, id, budgeted_paise, rollover_paise, is_active]);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'RESOURCE_NOT_FOUND', message: 'Budget not found' });
            }
            res.json({ budget: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /api/v1/budgets/:id
     * Soft-delete (deactivate) a budget.
     */
    static async deleteBudget(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            await dbClient.query(
                `UPDATE budgets SET is_active = false, updated_at = NOW() WHERE budget_id = $2 AND user_id = $1`,
                [userId, id]
            );
            res.status(204).json({ status: 'OK' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/budgets/recalculate
     * Recalculate spent_paise for all budgets based on current month transactions.
     */
    static async recalculateSpent(req, res, next) {
        try {
            const userId = req.user.userId;
            // For each active budget, sum transactions in that category for current month
            const query = `
                UPDATE budgets b
                SET spent_paise = COALESCE((
                    SELECT COALESCE(SUM(ABS(t.amount_paise)), 0)
                    FROM transactions t
                    WHERE t.user_id = $1
                      AND t.direction = 'debit'
                      AND t.duplicate_status != 'duplicate'
                      AND t.is_deleted = false
                      AND t.category = b.category
                      AND t.posting_date >= date_trunc('month', NOW())
                      AND t.posting_date < date_trunc('month', NOW()) + INTERVAL '1 month'
                ), 0),
                updated_at = NOW()
                WHERE b.user_id = $1 AND b.is_active = true
                RETURNING b.*;
            `;
            const result = await dbClient.query(query, [userId]);
            res.json({ updated: result.rowCount, budgets: result.rows });
        } catch (err) {
            next(err);
        }
    }
}
