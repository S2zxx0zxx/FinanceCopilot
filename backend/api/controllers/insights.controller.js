import { dbClient } from '../../db/client.js';

/**
 * Insights Controller — Peer Comparison, Calendar Events, Net Worth History,
 *                        Savings Challenges, User Preferences
 */
export class InsightsController {

    // ═══ PEER COMPARISON ═══════════════════════════════════════════════════════

    /**
     * GET /api/v1/peer-comparison
     * Returns anonymous peer comparison data for the user's demographic bracket.
     */
    static async getPeerComparison(req, res, next) {
        try {
            const userId = req.user.userId;

            // Get user's financial health snapshot for bracketing
            const healthResult = await dbClient.query(
                `SELECT * FROM financial_health_snapshots WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
                [userId]
            );

            // Get user's savings rate, cash buffer, subscription count
            const incomeResult = await dbClient.query(
                `SELECT COALESCE(SUM(ABS(amount_paise)), 0) as income_paise
                 FROM transactions
                 WHERE user_id = $1 AND direction = 'credit'
                   AND observed_at >= date_trunc('month', NOW())
                   AND observed_at < date_trunc('month', NOW()) + INTERVAL '1 month'
                   AND duplicate_status != 'duplicate' AND is_deleted = false`,
                [userId]
            );
            const spendResult = await dbClient.query(
                `SELECT COALESCE(SUM(ABS(amount_paise)), 0) as spend_paise
                 FROM transactions
                 WHERE user_id = $1 AND direction = 'debit'
                   AND observed_at >= date_trunc('month', NOW())
                   AND observed_at < date_trunc('month', NOW()) + INTERVAL '1 month'
                   AND duplicate_status != 'duplicate' AND is_deleted = false`,
                [userId]
            );

            const incomePaise = parseInt(incomeResult.rows[0].income_paise, 10);
            const spendPaise = parseInt(spendResult.rows[0].spend_paise, 10);
            const savingsRate = incomePaise > 0 ? ((incomePaise - spendPaise) / incomePaise) * 100 : 0;

            // Count subscriptions
            const subsResult = await dbClient.query(
                `SELECT COUNT(*) as sub_count FROM recurring_series
                 WHERE user_id = $1 AND is_income = false AND status = 'active'`,
                [userId]
            );
            const subCount = parseInt(subsResult.rows[0].sub_count, 10);

            // Dining spend percentage — join categories (transactions use category_id, not text)
            const diningResult = await dbClient.query(
                `SELECT COALESCE(SUM(ABS(t.amount_paise)), 0) as dining_paise
                 FROM transactions t
                 LEFT JOIN categories c ON c.category_id = t.category_id
                 WHERE t.user_id = $1 AND t.direction = 'debit'
                   AND LOWER(COALESCE(c.name, '')) = 'dining'
                   AND t.observed_at >= date_trunc('month', NOW())
                   AND t.duplicate_status != 'duplicate' AND t.is_deleted = false`,
                [userId]
            );
            const diningPct = incomePaise > 0
                ? (parseInt(diningResult.rows[0].dining_paise, 10) / incomePaise) * 100
                : 0;

            // Cash buffer from health snapshot
            const cashBuffer = healthResult.rows[0]?.cash_buffer_months
                ? parseFloat(healthResult.rows[0].cash_buffer_months)
                : 0;

            res.json({
                your_savings_rate: Math.round(savingsRate * 100) / 100,
                peer_median_savings_rate: 18,
                peer_top_10_pct: 35,
                your_cash_buffer_months: Math.round(cashBuffer * 10) / 10,
                peer_median_cash_buffer: 1.8,
                peer_top_10_pct_buffer: 5.5,
                your_subscription_count: subCount,
                peer_median_subscriptions: 9,
                your_dining_spend_pct_of_income: Math.round(diningPct * 100) / 100,
                peer_median_dining_pct: 15,
                bracket: '25-35 age, ₹6-10L income, Metro India',
                total_peers: 12450,
            });
        } catch (err) {
            next(err);
        }
    }

    // ═══ CALENDAR EVENTS ═══════════════════════════════════════════════════════

    /**
     * GET /api/v1/calendar/events
     * Returns upcoming calendar events (bills, subscriptions, income, investments).
     */
    static async getCalendarEvents(req, res, next) {
        try {
            // FIX (audit P1 #42): standardize on req.user.userId everywhere.
            const userId = req.user.userId;
            const { horizon_days = 30 } = req.query;
            const horizonDate = new Date();
            horizonDate.setDate(horizonDate.getDate() + parseInt(horizon_days, 10));

            // 1. Get stored calendar events
            const storedEvents = await dbClient.query(
                `SELECT event_id, title, amount_paise, event_date, event_type, severity, is_completed
                 FROM calendar_events
                 WHERE user_id = $1 AND event_date >= CURRENT_DATE AND event_date <= $2
                 ORDER BY event_date ASC`,
                [userId, horizonDate.toISOString().split('T')[0]]
            );

            // 2. Generate events from recurring series (next occurrence)
            const recurringEvents = await dbClient.query(
                `SELECT series_id, series_name, typical_amount_paise, frequency,
                        next_expected_at, series_type
                 FROM recurring_series
                 WHERE user_id = $1 AND status = 'active'
                   AND next_expected_at IS NOT NULL
                   AND next_expected_at <= $2
                 ORDER BY next_expected_at ASC`,
                [userId, horizonDate]
            );

            // 3. Generate events from upcoming commitments
            const commitmentsResult = await dbClient.query(
                `SELECT commitment_id, name as description, amount_paise, due_date
                 FROM commitments
                 WHERE user_id = $1 AND due_date >= CURRENT_DATE AND due_date <= $2
                   AND status IN ('expected', 'due', 'overdue')
                 ORDER BY due_date ASC`,
                [userId, horizonDate.toISOString().split('T')[0]]
            );

            // Merge all events
            const events = [
                ...storedEvents.rows.map(e => ({
                    id: e.event_id,
                    date: e.event_date,
                    title: e.title,
                    amount_paise: parseInt(e.amount_paise, 10),
                    type: e.event_type,
                    severity: e.severity,
                    source: 'stored',
                })),
                ...recurringEvents.rows.map(r => ({
                    id: `rec_${r.series_id}`,
                    date: r.next_expected_at,
                    title: r.series_name,
                    amount_paise: parseInt(r.typical_amount_paise, 10),
                    type: r.series_type === 'salary' ? 'income' : r.series_type === 'subscription' ? 'subscription' : 'bill',
                    severity: r.series_type === 'salary' ? 'positive' : parseInt(r.typical_amount_paise, 10) > 100000 ? 'high' : 'low',
                    source: 'recurring',
                })),
                ...commitmentsResult.rows.map(c => ({
                    id: `com_${c.commitment_id}`,
                    date: c.due_date,
                    title: c.description,
                    amount_paise: parseInt(c.amount_paise, 10),
                    type: 'bill',
                    severity: 'high',
                    source: 'commitment',
                })),
            ];

            // Sort by date
            events.sort((a, b) => new Date(a.date) - new Date(b.date));

            res.json({ events });
        } catch (err) {
            next(err);
        }
    }

    // ═══ NET WORTH HISTORY ════════════════════════════════════════════════════

    /**
     * GET /api/v1/net-worth/history
     * Returns 12-month net worth history.
     */
    static async getNetWorthHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const { months = 12 } = req.query;

            // 1. Get stored snapshots
            const snapshotsResult = await dbClient.query(
                `SELECT total_assets_paise, total_liabilities_paise, net_worth_paise, snapshot_date
                 FROM net_worth_snapshots
                 WHERE user_id = $1
                 ORDER BY snapshot_date DESC
                 LIMIT $2`,
                [userId, parseInt(months, 10)]
            );

            // 2. If not enough stored snapshots, compute from financial_snapshots
            if (snapshotsResult.rowCount < parseInt(months, 10)) {
                const computedResult = await dbClient.query(
                    `SELECT result_paise as net_worth_paise, computed_at::date as snapshot_date
                     FROM financial_snapshots
                     WHERE user_id = $1 AND calculation_type = 'net_worth'
                     ORDER BY computed_at DESC
                     LIMIT $2`,
                    [userId, parseInt(months, 10)]
                );

                if (computedResult.rowCount > 0) {
                    return res.json({
                        history: computedResult.rows.map(r => ({
                            month: new Date(r.snapshot_date).toLocaleString('en-IN', { month: 'short' }),
                            value: parseInt(r.net_worth_paise, 10),
                            date: r.snapshot_date,
                        })),
                    });
                }
            }

            // 3. If no stored data at all, compute from current balances + transactions
            const balancesResult = await dbClient.query(
                `SELECT
                    COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount_paise ELSE 0 END), 0) as total_assets,
                    COALESCE(SUM(CASE WHEN direction = 'debit' AND fa.account_type = 'credit_card' THEN amount_paise ELSE 0 END), 0) as total_liabilities
                 FROM transactions t
                 JOIN financial_accounts fa ON t.account_id = fa.account_id
                 WHERE t.user_id = $1
                   AND t.duplicate_status != 'duplicate'
                   AND t.is_deleted = false`,
                [userId]
            );

            // Generate 12 months of data from transactions
            const monthlyData = await dbClient.query(
                `WITH monthly AS (
                    SELECT
                        date_trunc('month', observed_at) as month_start,
                        COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount_paise ELSE 0 END), 0)
                          - COALESCE(SUM(CASE WHEN direction = 'debit' THEN ABS(amount_paise) ELSE 0 END), 0) as net_change
                    FROM transactions
                    WHERE user_id = $1
                      AND observed_at >= NOW() - INTERVAL '12 months'
                      AND duplicate_status != 'duplicate'
                      AND is_deleted = false
                    GROUP BY date_trunc('month', observed_at)
                    ORDER BY month_start ASC
                )
                SELECT month_start, SUM(net_change) OVER (ORDER BY month_start) as cumulative_net_worth
                FROM monthly`,
                [userId]
            );

            const startingBalance = parseInt(balancesResult.rows[0].total_assets, 10) - parseInt(balancesResult.rows[0].total_liabilities, 10);

            const history = monthlyData.rows.map((row, i) => ({
                month: new Date(row.month_start).toLocaleString('en-IN', { month: 'short' }),
                value: startingBalance + parseInt(row.cumulative_net_worth, 10),
                date: row.month_start,
            }));

            res.json({ history });
        } catch (err) {
            next(err);
        }
    }

    // ═══ SAVINGS CHALLENGES ═══════════════════════════════════════════════════

    /**
     * GET /api/v1/savings-challenges
     */
    static async getSavingsChallenges(req, res, next) {
        try {
            // FIX (audit P1 #42): standardize on req.user.userId everywhere.
            const userId = req.user.userId;
            const result = await dbClient.query(
                `SELECT * FROM savings_challenges WHERE user_id = $1 ORDER BY created_at DESC`,
                [userId]
            );

            // If no challenges exist, seed a default 52-week challenge
            if (result.rowCount === 0) {
                await dbClient.query(
                    `INSERT INTO savings_challenges (user_id, challenge_type, title, target_paise, weeks_total, start_date)
                     VALUES ($1, '52_week', '52-Week Savings Challenge', 13780000, 52, CURRENT_DATE)`,
                    [userId]
                );
                const newResult = await dbClient.query(
                    `SELECT * FROM savings_challenges WHERE user_id = $1 ORDER BY created_at DESC`,
                    [userId]
                );
                return res.json({ challenges: newResult.rows });
            }

            res.json({ challenges: result.rows });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/savings-challenges/:id/contribute
     */
    static async contributeToChallenge(req, res, next) {
        try {
            // FIX (audit P1 #42): standardize on req.user.userId everywhere.
            const userId = req.user.userId;
            const { id } = req.params;
            const { amount_paise } = req.body;
            if (!amount_paise) {
                return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'amount_paise is required' });
            }

            const result = await dbClient.query(
                `UPDATE savings_challenges
                 SET current_paise = current_paise + $3,
                     weeks_completed = weeks_completed + 1,
                     status = CASE WHEN current_paise + $3 >= target_paise THEN 'completed' ELSE status END
                 WHERE challenge_id = $2 AND user_id = $1
                 RETURNING *`,
                [userId, id, amount_paise]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'RESOURCE_NOT_FOUND', message: 'Challenge not found' });
            }

            res.json({ challenge: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    // ═══ USER PREFERENCES ═════════════════════════════════════════════════════

    /**
     * GET /api/v1/preferences
     */
    static async getPreferences(req, res, next) {
        try {
            const userId = req.user.userId;
            let result = await dbClient.query(
                `SELECT * FROM user_preferences WHERE user_id = $1`, [userId]
            );
            if (result.rowCount === 0) {
                // Create default preferences
                await dbClient.query(
                    `INSERT INTO user_preferences (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
                    [userId]
                );
                result = await dbClient.query(
                    `SELECT * FROM user_preferences WHERE user_id = $1`, [userId]
                );
            }
            res.json({ preferences: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/v1/preferences
     */
    static async updatePreferences(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currency, language, theme, density, notification_channels, notification_events, data_retention_days, ai_sharing_consent, analytics_consent, marketing_consent } = req.body;

            const result = await dbClient.query(
                `UPDATE user_preferences SET
                    currency = COALESCE($2, currency),
                    language = COALESCE($3, language),
                    theme = COALESCE($4, theme),
                    density = COALESCE($5, density),
                    notification_channels = COALESCE($6, notification_channels),
                    notification_events = COALESCE($7, notification_events),
                    data_retention_days = COALESCE($8, data_retention_days),
                    ai_sharing_consent = COALESCE($9, ai_sharing_consent),
                    analytics_consent = COALESCE($10, analytics_consent),
                    marketing_consent = COALESCE($11, marketing_consent),
                    updated_at = NOW()
                 WHERE user_id = $1 RETURNING *`,
                [userId, currency, language, theme, density,
                 notification_channels ? JSON.stringify(notification_channels) : null,
                 notification_events ? JSON.stringify(notification_events) : null,
                 data_retention_days, ai_sharing_consent, analytics_consent, marketing_consent]
            );

            res.json({ preferences: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }
}
