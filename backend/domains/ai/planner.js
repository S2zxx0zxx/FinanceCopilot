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
        // FIX (audit P0 #7): financial_snapshots has NO columns named
        // `current_balance_paise`, `safe_to_spend_paise`, `uncommitted_funds_paise`,
        // or `as_of`. The canonical schema (migration 008) has a single
        // `result_paise` BIGINT plus `computed_at` and `calculation_type`. We
        // fetch the latest safe_to_spend snapshot and surface both the raw
        // result and the structured inputs from input_snapshot.
        const res = await this.dbClient.query(
            `SELECT snapshot_id, calculation_type, result_paise,
                    input_snapshot, freshness_score, coverage_score,
                    confidence_level, computed_at
             FROM financial_snapshots
             WHERE user_id = $1
             ORDER BY computed_at DESC LIMIT 1`,
            [userId]
        );
        return res.rows[0] || null;
    }

    async _getLatestForecast(userId) {
        // FIX (audit P0 #7): forecast_snapshots has NO `status` column
        // (migration 010). Drop it from SELECT. `as_of` is real.
        const res = await this.dbClient.query(
            `SELECT point_estimate_paise, lower_bound_paise, upper_bound_paise,
                    horizon_days, trust_state, as_of
             FROM forecast_snapshots
             WHERE user_id = $1
             ORDER BY as_of DESC LIMIT 1`,
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
        // FIX (audit P0 #7): transactions.amount_paise has a CHECK (> 0) that
        // FORBIDS negative values — the old `amount_paise < 0` filter would
        // throw. Spend = `direction='debit'`. Also transactions has `observed_at`
        // (not `date`). Group debits over the last 30 days.
        const res = await this.dbClient.query(
            `SELECT SUM(amount_paise) AS total_spend_paise
             FROM transactions
             WHERE user_id = $1
               AND direction = 'debit'
               AND is_deleted = FALSE
               AND observed_at >= NOW() - INTERVAL '30 days'`,
            [userId]
        );
        const total = res.rows[0]?.total_spend_paise;
        return { last30DaysPaise: total == null ? 0 : Number(total) };
    }
}
