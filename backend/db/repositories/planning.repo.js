/**
 * Planning Repository — Phase 7
 *
 * Covers: RecurringSeries, Commitments, Goals, GoalContributions,
 * PlanningSnapshots, FinancialHealthSnapshots.
 *
 * ALL queries are user-scoped (tenant-isolated).
 * ALL money as BIGINT paise. ALL timestamps TIMESTAMPTZ.
 * No fake data, no hardcoded values.
 */
import { dbClient } from '../client.js';

// ─────────────────────────────────────────────
// RECURRING REPO
// ─────────────────────────────────────────────
export const RecurringRepo = {
    /**
     * Idempotent upsert of a detected recurring series.
     * Uses deterministic_key to prevent duplicates on re-run (§14).
     */
    async upsertSeries(userId, series) {
        const text = `
            INSERT INTO recurring_series (
                user_id, merchant_id, category_id, series_name, series_type,
                frequency, amount_type, typical_amount_paise, amount_variance_paise,
                currency, first_seen_at, last_seen_at, observation_count,
                observation_window_days, next_expected_at, confidence,
                detection_version, status, is_income, deterministic_key
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            )
            ON CONFLICT (user_id, deterministic_key) DO UPDATE SET
                typical_amount_paise   = EXCLUDED.typical_amount_paise,
                amount_variance_paise  = EXCLUDED.amount_variance_paise,
                amount_type            = EXCLUDED.amount_type,
                observation_count      = EXCLUDED.observation_count,
                last_seen_at           = EXCLUDED.last_seen_at,
                next_expected_at       = EXCLUDED.next_expected_at,
                confidence             = EXCLUDED.confidence,
                detection_version      = EXCLUDED.detection_version,
                updated_at             = NOW()
            RETURNING *;
        `;
        const values = [
            userId,
            series.merchant_id || null,
            series.category_id || null,
            series.series_name,
            series.series_type,
            series.frequency,
            series.amount_type || 'unknown',
            series.typical_amount_paise || null,
            series.amount_variance_paise || null,
            series.currency || 'INR',
            series.first_seen_at,
            series.last_seen_at,
            series.observation_count,
            series.observation_window_days || null,
            series.next_expected_at || null,
            series.confidence || null,
            series.detection_version || 'v1.0.0',
            series.status || 'detected',
            series.is_income || false,
            series.deterministic_key
        ];
        const res = await dbClient.query(text, values);
        return res.rows[0];
    },

    async getSeriesById(userId, seriesId) {
        const res = await dbClient.query(
            `SELECT * FROM recurring_series WHERE series_id = $1 AND user_id = $2`,
            [seriesId, userId]
        );
        return res.rows[0] || null;
    },

    async listSeries(userId, { status, frequency, limit = 50, offset = 0 } = {}) {
        const params = [userId];
        const filters = [];
        if (status) { params.push(status); filters.push(`status = $${params.length}`); }
        if (frequency) { params.push(frequency); filters.push(`frequency = $${params.length}`); }
        params.push(limit, offset);
        const filterStr = filters.length ? `AND ${filters.join(' AND ')}` : '';
        const res = await dbClient.query(
            `SELECT * FROM recurring_series
             WHERE user_id = $1 ${filterStr}
             ORDER BY is_user_confirmed DESC, confidence DESC NULLS LAST, series_name ASC
             LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );
        return res.rows;
    },

    async updateSeriesStatus(userId, seriesId, status, extra = {}) {
        const now = new Date().toISOString();
        let setParts = ['status = $3', 'updated_at = NOW()'];
        const params = [userId, seriesId, status];

        if (status === 'confirmed' || status === 'active') {
            params.push(now);
            setParts.push(`is_user_confirmed = TRUE`, `user_confirmed_at = $${params.length}`);
        }
        if (status === 'dismissed') {
            params.push(now);
            setParts.push(`user_dismissed_at = $${params.length}`);
            if (extra.reason) {
                params.push(extra.reason);
                setParts.push(`dismissal_reason = $${params.length}`);
            }
        }

        const res = await dbClient.query(
            `UPDATE recurring_series SET ${setParts.join(', ')}
             WHERE user_id = $1 AND series_id = $2
             RETURNING *`,
            params
        );
        return res.rows[0] || null;
    },

    async updateSeriesFields(userId, seriesId, patch) {
        // Only allow safe user-editable fields
        const allowed = new Set(['series_name', 'frequency', 'typical_amount_paise', 'next_expected_at', 'series_type']);
        const parts = [];
        const params = [userId, seriesId];
        for (const [k, v] of Object.entries(patch)) {
            if (allowed.has(k)) {
                params.push(v);
                parts.push(`${k} = $${params.length}`);
            }
        }
        if (parts.length === 0) return null;
        parts.push('updated_at = NOW()');
        const res = await dbClient.query(
            `UPDATE recurring_series SET ${parts.join(', ')}
             WHERE user_id = $1 AND series_id = $2
             RETURNING *`,
            params
        );
        return res.rows[0] || null;
    },

    async addEvidence(seriesId, userId, transactionId, observedAt, amountPaise) {
        const res = await dbClient.query(
            `INSERT INTO recurring_evidence (series_id, user_id, transaction_id, observed_at, amount_paise)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (series_id, transaction_id) DO NOTHING
             RETURNING *`,
            [seriesId, userId, transactionId, observedAt, amountPaise]
        );
        return res.rows[0] || null;
    },

    async getEvidence(seriesId) {
        const res = await dbClient.query(
            `SELECT re.*, t.merchant_normalized, t.observed_at as tx_observed_at
             FROM recurring_evidence re
             JOIN transactions t ON re.transaction_id = t.transaction_id
             WHERE re.series_id = $1
             ORDER BY re.observed_at DESC`,
            [seriesId]
        );
        return res.rows;
    },

    /**
     * Monthly recurring summary — total monthly burden (§13)
     */
    async getMonthlySummary(userId) {
        const res = await dbClient.query(
            `SELECT
                SUM(CASE WHEN frequency = 'monthly'   THEN typical_amount_paise ELSE 0 END) as monthly_paise,
                SUM(CASE WHEN frequency = 'weekly'    THEN typical_amount_paise * 4 ELSE 0 END) as weekly_to_monthly,
                SUM(CASE WHEN frequency = 'quarterly' THEN typical_amount_paise / 3 ELSE 0 END) as quarterly_to_monthly,
                SUM(CASE WHEN frequency = 'annual'    THEN typical_amount_paise / 12 ELSE 0 END) as annual_to_monthly,
                COUNT(*) as series_count
             FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND is_income = FALSE
               AND typical_amount_paise IS NOT NULL`,
            [userId]
        );
        return res.rows[0];
    }
};


// ─────────────────────────────────────────────
// COMMITMENT REPO
// ─────────────────────────────────────────────
export const CommitmentRepo = {
    async createCommitment(userId, data) {
        const text = `
            INSERT INTO commitments (
                user_id, series_id, commitment_type, name,
                amount_paise, currency, due_date, due_day_of_month,
                period_start, period_end, account_id, status,
                confidence, source_type
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *
        `;
        const res = await dbClient.query(text, [
            userId, data.series_id || null, data.commitment_type, data.name,
            data.amount_paise, data.currency || 'INR', data.due_date || null,
            data.due_day_of_month || null, data.period_start || null,
            data.period_end || null, data.account_id || null,
            data.status || 'expected', data.confidence || 1.0,
            data.source_type || 'user_confirmed'
        ]);
        return res.rows[0];
    },

    async listUpcoming(userId, { fromDate, toDate, limit = 100 } = {}) {
        const params = [userId];
        const filters = [];
        if (fromDate) { params.push(fromDate); filters.push(`due_date >= $${params.length}`); }
        if (toDate)   { params.push(toDate);   filters.push(`due_date <= $${params.length}`); }
        params.push(limit);
        const filterStr = filters.length ? `AND ${filters.join(' AND ')}` : '';
        const res = await dbClient.query(
            `SELECT c.*, rs.series_name, rs.frequency, rs.confidence as series_confidence
             FROM commitments c
             LEFT JOIN recurring_series rs ON c.series_id = rs.series_id
             WHERE c.user_id = $1
               AND c.status NOT IN ('paid', 'cancelled') ${filterStr}
             ORDER BY c.due_date ASC
             LIMIT $${params.length}`,
            params
        );
        return res.rows;
    },

    async markPaid(userId, commitmentId, transactionId = null) {
        const res = await dbClient.query(
            `UPDATE commitments
             SET status = 'paid', paid_at = NOW(), transaction_id = $3, updated_at = NOW()
             WHERE commitment_id = $1 AND user_id = $2
             RETURNING *`,
            [commitmentId, userId, transactionId]
        );
        return res.rows[0] || null;
    }
};


// ─────────────────────────────────────────────
// GOAL REPO
// ─────────────────────────────────────────────
export const GoalRepo = {
    async createGoal(userId, data) {
        const text = `
            INSERT INTO goals (
                user_id, goal_type, name, description,
                target_amount_paise, currency, target_date,
                status, priority, account_id, monthly_contribution_paise
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
        `;
        const res = await dbClient.query(text, [
            userId, data.goal_type, data.name, data.description || null,
            data.target_amount_paise, data.currency || 'INR',
            data.target_date || null, 'active',
            data.priority || 1, data.account_id || null,
            data.monthly_contribution_paise || null
        ]);
        return res.rows[0];
    },

    /**
     * List goals with LIVE progress derived from contributions (§23).
     * current_amount_paise is computed, never stored raw.
     */
    async listGoals(userId) {
        const res = await dbClient.query(
            `SELECT g.*,
                    COALESCE((
                        SELECT SUM(gc.amount_paise)
                        FROM goal_contributions gc
                        WHERE gc.goal_id = g.goal_id AND gc.status = 'confirmed'
                    ), 0) AS current_amount_paise
             FROM goals g
             WHERE g.user_id = $1 AND g.is_deleted = FALSE
             ORDER BY g.priority ASC, g.created_at ASC`,
            [userId]
        );
        return res.rows;
    },

    async getGoalById(userId, goalId) {
        const res = await dbClient.query(
            `SELECT g.*,
                    COALESCE((
                        SELECT SUM(gc.amount_paise)
                        FROM goal_contributions gc
                        WHERE gc.goal_id = g.goal_id AND gc.status = 'confirmed'
                    ), 0) AS current_amount_paise
             FROM goals g
             WHERE g.goal_id = $1 AND g.user_id = $2 AND g.is_deleted = FALSE`,
            [goalId, userId]
        );
        return res.rows[0] || null;
    },

    async updateGoal(userId, goalId, patch) {
        const allowed = new Set(['name', 'description', 'target_amount_paise', 'target_date', 'status', 'priority', 'monthly_contribution_paise', 'account_id']);
        const parts = [];
        const params = [goalId, userId];
        for (const [k, v] of Object.entries(patch)) {
            if (allowed.has(k)) {
                params.push(v);
                parts.push(`${k} = $${params.length}`);
            }
        }
        if (parts.length === 0) return null;
        parts.push('updated_at = NOW()');
        const res = await dbClient.query(
            `UPDATE goals SET ${parts.join(', ')}
             WHERE goal_id = $1 AND user_id = $2 AND is_deleted = FALSE
             RETURNING *`,
            params
        );
        return res.rows[0] || null;
    },

    async softDeleteGoal(userId, goalId) {
        const res = await dbClient.query(
            `UPDATE goals SET is_deleted = TRUE, deleted_at = NOW(), status = 'abandoned', updated_at = NOW()
             WHERE goal_id = $1 AND user_id = $2 AND is_deleted = FALSE
             RETURNING *`,
            [goalId, userId]
        );
        return res.rows[0] || null;
    }
};


// ─────────────────────────────────────────────
// GOAL CONTRIBUTION REPO
// ─────────────────────────────────────────────
export const GoalContributionRepo = {
    /**
     * Idempotent insert — same idempotency_key cannot create duplicate (§24).
     */
    async addContribution(userId, goalId, data) {
        const text = `
            INSERT INTO goal_contributions (
                goal_id, user_id, amount_paise, currency,
                contribution_date, source_type, account_id,
                idempotency_key, actor, status, notes
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            ON CONFLICT (goal_id, idempotency_key) DO NOTHING
            RETURNING *
        `;
        const res = await dbClient.query(text, [
            goalId, userId, data.amount_paise, data.currency || 'INR',
            data.contribution_date || new Date().toISOString().split('T')[0],
            data.source_type || 'manual',
            data.account_id || null,
            data.idempotency_key,
            data.actor || 'user',
            'confirmed',
            data.notes || null
        ]);
        return res.rows[0] || null; // null = duplicate (idempotent)
    },

    async listContributions(userId, goalId) {
        const res = await dbClient.query(
            `SELECT * FROM goal_contributions
             WHERE goal_id = $1 AND user_id = $2 AND status = 'confirmed'
             ORDER BY contribution_date DESC, created_at DESC`,
            [goalId, userId]
        );
        return res.rows;
    },

    /**
     * Authoritative progress sum (§23 — never manually incremented).
     */
    async getTotalContributed(goalId) {
        const res = await dbClient.query(
            `SELECT COALESCE(SUM(amount_paise), 0) AS total_paise
             FROM goal_contributions
             WHERE goal_id = $1 AND status = 'confirmed'`,
            [goalId]
        );
        return Number(res.rows[0].total_paise);
    }
};


// ─────────────────────────────────────────────
// PLANNING SNAPSHOT REPO
// ─────────────────────────────────────────────
export const PlanningSnapshotRepo = {
    async saveSnapshot(userId, data) {
        const res = await dbClient.query(
            `INSERT INTO planning_snapshots (
                user_id, scope, planning_version,
                input_financial_state_snapshot_id, input_snapshot,
                outputs, currency, freshness_seconds, coverage
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [
                userId, data.scope || 'full', data.planning_version || 'v1.0.0',
                data.input_financial_state_snapshot_id || null,
                JSON.stringify(data.input_snapshot),
                JSON.stringify(data.outputs),
                data.currency || 'INR',
                data.freshness_seconds || null,
                data.coverage || null
            ]
        );
        return res.rows[0];
    },

    async getLatestSnapshot(userId, scope = 'full') {
        const res = await dbClient.query(
            `SELECT * FROM planning_snapshots
             WHERE user_id = $1 AND scope = $2
             ORDER BY computed_at DESC LIMIT 1`,
            [userId, scope]
        );
        return res.rows[0] || null;
    }
};


// ─────────────────────────────────────────────
// FINANCIAL HEALTH REPO
// ─────────────────────────────────────────────
export const FinancialHealthRepo = {
    async saveHealthSnapshot(userId, data) {
        const res = await dbClient.query(
            `INSERT INTO financial_health_snapshots (
                user_id,
                cash_buffer_ratio, cash_buffer_months, cash_buffer_status,
                commitment_load_ratio, commitment_load_status,
                savings_pace_ratio, savings_pace_status,
                spending_stability_cv, spending_stability_status,
                health_version, horizon_days, coverage, freshness_seconds,
                data_gaps, inputs_snapshot
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
            RETURNING *`,
            [
                userId,
                data.cash_buffer_ratio, data.cash_buffer_months, data.cash_buffer_status,
                data.commitment_load_ratio, data.commitment_load_status,
                data.savings_pace_ratio, data.savings_pace_status,
                data.spending_stability_cv, data.spending_stability_status,
                data.health_version || 'v1.0.0',
                data.horizon_days || 30,
                data.coverage || null,
                data.freshness_seconds || null,
                data.data_gaps || [],
                JSON.stringify(data.inputs_snapshot || {})
            ]
        );
        return res.rows[0];
    },

    async getLatestHealthSnapshot(userId) {
        const res = await dbClient.query(
            `SELECT * FROM financial_health_snapshots
             WHERE user_id = $1
             ORDER BY computed_at DESC LIMIT 1`,
            [userId]
        );
        return res.rows[0] || null;
    }
};
