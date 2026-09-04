/**
 * Phase 8: Forecast Feature Extraction
 * Extracts historical state up to a precise cut-off date to prevent future data leakage.
 */

export class ForecastFeatures {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    /**
     * Extracts all necessary point-in-time features for forecasting.
     * @param {string} userId - UUID
     * @param {Date} cutoffDate - The exact point-in-time boundary. NO DATA AFTER THIS.
     * @returns {Object} Extracted features
     */
    async extractPointInTimeFeatures(userId, cutoffDate) {
        const isoCutoff = cutoffDate.toISOString();

        // 1. Get current liquid balance as of cutoff
        const balanceRes = await this.dbClient.query(
            `SELECT result_paise FROM financial_snapshots 
             WHERE user_id = $1 AND computed_at <= $2 
             ORDER BY computed_at DESC LIMIT 1`,
            [userId, isoCutoff]
        );
        const liquidBalancePaise = balanceRes.rows[0]?.result_paise || 0;

        // 2. Get deterministic confirmed commitments due AFTER cutoff (Future deterministic events)
        const commitmentsRes = await this.dbClient.query(
            `SELECT amount_paise, due_date 
             FROM commitments 
             WHERE user_id = $1 
               AND due_date > $2 
               AND status IN ('expected', 'due')`,
            [userId, isoCutoff]
        );
        const upcomingCommitments = commitmentsRes.rows;

        // 3. Extract historical daily spending (for residuals & volatility) up to cutoff
        // FIX (audit P1 #27): no `direction = 'debit'` filter meant income
        // (credits) were summed together with spend, producing meaningless
        // `daily_spend` numbers and an inflated rolling-median baseline.
        const spendingRes = await this.dbClient.query(
            `SELECT DATE(observed_at) AS t_date, SUM(amount_paise) AS daily_spend
             FROM transactions
             WHERE user_id = $1
               AND observed_at <= $2
               AND direction = 'debit'
               AND is_deleted = FALSE
               AND transaction_type NOT IN ('transfer_out', 'transfer_in')
               AND transfer_role IS NULL
             GROUP BY DATE(observed_at)
             ORDER BY t_date ASC`,
            [userId, isoCutoff]
        );
        const historicalDailySpending = spendingRes.rows;

        // 4. Calculate empirical volatility (variance over last 30 days of data)
        let spendingVolatility = 0;
        if (historicalDailySpending.length > 5) {
            const recent = historicalDailySpending.slice(-30).map(r => Number(r.daily_spend));
            const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
            const variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
            spendingVolatility = Math.sqrt(variance);
        }

        return {
            cutoffDate: isoCutoff,
            liquidBalancePaise: Number(liquidBalancePaise),
            upcomingCommitments: upcomingCommitments.map(c => ({
                amountPaise: Number(c.amount_paise),
                dueDate: c.due_date
            })),
            historicalDailySpending: historicalDailySpending.map(r => ({
                date: r.t_date,
                spendPaise: Number(r.daily_spend) // Net cashflow
            })),
            spendingVolatilityPaise: spendingVolatility,
            featureVersion: 'v1.0.0'
        };
    }
}
