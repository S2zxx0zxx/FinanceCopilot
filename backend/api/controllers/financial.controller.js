import { SafeToSpendEngine } from '../../domains/financial-state/safe-to-spend/safe_to_spend.engine.js';
import { FinancialStateRepo } from '../../db/repositories/financial_state.repo.js';

export class FinancialController {
    /**
     * GET /api/v1/financial-state/home
     * Returns the aggregated view-model for the Home screen.
     */
    static async getHomeState(req, res, next) {
        try {
            const userId = req.user.userId; // Provided by requireAuth middleware
            
            // 1. Calculate Safe-to-Spend (Returns final value, currency, freshness, snapshot ID)
            const stsResult = await SafeToSpendEngine.calculateAndSnapshot(userId);
            
            // 2. Fetch specific insights required for Home
            // E.g., upcoming commitments for the current month
            const today = new Date();
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            const upcomingCommitments = await FinancialStateRepo.getUpcomingCommitments(userId, endOfMonth);

            // 3. Needs Attention (Placeholder for Phase 6 - would query for stale connections or unreviewed items)
            const needsAttention = []; 

            // 4. Construct the View-Model
            const viewModel = {
                greeting: 'Hello', // Can be localized later
                safe_to_spend: stsResult,
                money_outlook: {
                    upcoming_commitments_this_month_paise: upcomingCommitments.upcoming_commitments_paise,
                    currency: upcomingCommitments.currency
                },
                needs_attention: needsAttention,
                freshness: 'fresh' // Overall home freshness
            };

            res.status(200).json(viewModel);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/money
     * Returns the aggregated view-model for the Money Overview screen.
     */
    static async getMoneyState(req, res, next) {
        try {
            const userId = req.user.userId;
            
            // 1. Get total account balances
            const balances = await FinancialStateRepo.getAccountBalances(userId);

            // 2. We can also fetch the list of connected accounts to preview them
            const coverageMetrics = await FinancialStateRepo.getCoverageMetrics(userId);

            const viewModel = {
                net_position: balances, // Contains available_balance_paise, posted_balance_paise etc.
                coverage: {
                    total_accounts: coverageMetrics.totalAccounts,
                    synced_accounts: coverageMetrics.syncedAccounts
                }
            };

            res.status(200).json(viewModel);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/spending-story
     */
    static async getSpendingStory(req, res, next) {
        try {
            const userId = req.user.userId;
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            const spending = await FinancialStateRepo.getEffectiveSpending(userId, startOfMonth, endOfMonth);
            
            res.status(200).json({
                period: 'This Month',
                spending
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/income
     */
    static async getIncome(req, res, next) {
        try {
            const userId = req.user.userId;
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            const income = await FinancialStateRepo.getEffectiveIncome(userId, startOfMonth, endOfMonth);
            
            res.status(200).json({
                period: 'This Month',
                income
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/categories/:id
     * Returns category detail (e.g. total spent this month)
     */
    static async getCategoryDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const categoryId = req.params.id;
            
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            // Simplified for Phase 6: directly query transactions for this category
            const { dbClient } = await import('../../db/client.js');
            const query = `
                SELECT COALESCE(SUM(amount_paise), 0) AS total_spent
                FROM transactions
                WHERE user_id = $1 
                  AND category_id = $2::uuid
                  AND observed_at >= $3 
                  AND observed_at <= $4
                  AND is_deleted = false
                  AND direction = 'debit'
            `;
            const result = await dbClient.query(query, [userId, categoryId, startOfMonth, endOfMonth]);

            res.status(200).json({
                category_id: categoryId,
                period: 'This Month',
                total_spent_paise: Number.parseInt(result.rows[0].total_spent, 10),
                currency: 'INR'
            });
        } catch (error) {
            next(error);
        }
    }
}
