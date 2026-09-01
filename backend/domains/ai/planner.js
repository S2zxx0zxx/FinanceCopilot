import { IntentTaxonomy } from './intent.js';

/**
 * Phase 9: AI Context Planner
 * Enforces data minimization by retrieving ONLY the exact state required for the intent.
 * NEVER dumps full financial history by default.
 */
export class ContextPlanner {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async planContext(userId, intentId) {
        let minimalContext = { userId, timestamp: new Date().toISOString() };

        try {
            switch (intentId) {
                case IntentTaxonomy.FINANCIAL_HEALTH:
                case IntentTaxonomy.AFFORDABILITY_QUESTION:
                    minimalContext.financialState = await this._getLatestFinancialState(userId);
                    break;
                case IntentTaxonomy.FORECAST_EXPLANATION:
                    minimalContext.forecast = await this._getLatestForecast(userId);
                    break;
                case IntentTaxonomy.GOAL_STATUS:
                case IntentTaxonomy.GOAL_PLANNING:
                    minimalContext.goals = await this._getActiveGoals(userId);
                    break;
                case IntentTaxonomy.MONTH_COMPARISON:
                case IntentTaxonomy.SPENDING_EXPLANATION:
                    minimalContext.spending = await this._getRecentSpendingTotals(userId);
                    break;
                // IntentTaxonomy.UNKNOWN gets no financial context, just safe fallback
            }
        } catch (err) {
            console.error('[ContextPlanner] Error fetching context:', err);
            minimalContext.error = 'Context retrieval failed or unavailable';
        }

        return minimalContext;
    }

    async _getLatestFinancialState(userId) {
        const res = await this.dbClient.query(
            `SELECT current_balance_paise, safe_to_spend_paise, uncommitted_funds_paise, as_of 
             FROM financial_snapshots 
             WHERE user_id = $1 ORDER BY as_of DESC LIMIT 1`,
            [userId]
        );
        return res.rows[0] || null;
    }

    async _getLatestForecast(userId) {
        const res = await this.dbClient.query(
            `SELECT point_estimate_paise, lower_bound_paise, upper_bound_paise, horizon_days, status, trust_state
             FROM forecast_snapshots 
             WHERE user_id = $1 ORDER BY as_of DESC LIMIT 1`,
            [userId]
        );
        return res.rows[0] || null;
    }

    async _getActiveGoals(userId) {
        const res = await this.dbClient.query(
            `SELECT goal_id, name, target_amount_paise, current_amount_paise, target_date, status
             FROM goals 
             WHERE user_id = $1 AND status != 'COMPLETED'`,
            [userId]
        );
        return res.rows;
    }

    async _getRecentSpendingTotals(userId) {
        // Just an aggregate, NEVER the full raw transaction list
        const res = await this.dbClient.query(
            `SELECT SUM(amount_paise) as total_spend_paise 
             FROM transactions 
             WHERE user_id = $1 AND amount_paise < 0 AND date >= CURRENT_DATE - INTERVAL '30 days'`,
            [userId]
        );
        return { last30DaysPaise: res.rows[0]?.total_spend_paise || 0 };
    }
}
