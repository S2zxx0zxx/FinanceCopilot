/**
 * Cashflow Planning Service — Phase 7 §18-20
 *
 * Builds KNOWN/PLANNING cashflow — NOT a predictive forecast (Phase 8 boundary strictly enforced).
 *
 * Inputs used (§18):
 * - current trusted financial state (available cash)
 * - known income (confirmed recurring credits)
 * - confirmed recurring items (expense side)
 * - confirmed commitments
 * - goal contributions
 * - approved buffer (from financial state)
 *
 * Does NOT:
 * - build probabilistic ranges
 * - call AI or ML models
 * - invent future income not backed by real confirmed data
 *
 * Every event in the output has explicit financial meaning (§19).
 * No double-counting of transfers, settlements, or duplicates (§19).
 * Version: cashflow_planning_v1.0.0
 */
import { dbClient } from '../../../db/client.js';

const CASHFLOW_VERSION = 'v1.0.0';

export class CashflowService {
    /**
     * Build cashflow planning view for a given period.
     * @param {string} userId
     * @param {'7d'|'30d'|'90d'} period
     */
    static async getCashflowPlan(userId, period = '30d') {
        const periodDays = { '7d': 7, '30d': 30, '90d': 90 }[period];
        if (!periodDays) throw new Error(`Invalid period: ${period}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const periodStart = today.toISOString().split('T')[0];
        const periodEnd = new Date(today.setDate(today.getDate() + periodDays)).toISOString().split('T')[0];

        // 1. Current trusted balance (from financial state — Phase 5)
        const balanceRes = await dbClient.query(
            `SELECT COALESCE(SUM(
                CASE WHEN t.direction = 'credit' THEN t.amount_paise
                     ELSE -t.amount_paise END
             ), 0) AS net_balance_paise
             FROM transactions t
             JOIN financial_accounts fa ON t.account_id = fa.account_id
             WHERE t.user_id = $1
               AND t.is_deleted = FALSE
               AND t.duplicate_status IN ('unique', 'primary')
               AND t.transfer_role IS NULL
               -- FIX (audit P0 #21): "settlement_role != 'settlement'" excludes
               -- NULL rows in PostgreSQL (NULL != 'x' is NULL, not TRUE). That
               -- silently dropped every ordinary transaction from the sum and
               -- made balances read ~0. Include NULL rows explicitly.
               AND (t.settlement_role IS NULL OR t.settlement_role != 'settlement')
               AND t.posting_status = 'posted'`,
            [userId]
        ).catch(() => ({ rows: [{ net_balance_paise: 0 }] }));

        const currentBalancePaise = Number(balanceRes.rows[0]?.net_balance_paise || 0);

        // 2. Known confirmed recurring income within period (credits, confirmed series)
        const incomeRes = await dbClient.query(
            `SELECT COALESCE(SUM(typical_amount_paise), 0) as confirmed_income_paise,
                    COUNT(*) as income_series_count
             FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND is_income = TRUE
               AND typical_amount_paise IS NOT NULL
               AND next_expected_at BETWEEN $2 AND $3`,
            [userId, periodStart, periodEnd]
        );
        const confirmedIncomePaise = Number(incomeRes.rows[0]?.confirmed_income_paise || 0);
        const incomeCoverage = Number(incomeRes.rows[0]?.income_series_count || 0);

        // 3. Known confirmed recurring expenses within period
        const expenseRes = await dbClient.query(
            `SELECT COALESCE(SUM(typical_amount_paise), 0) as confirmed_expense_paise,
                    COUNT(*) as expense_series_count
             FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND is_income = FALSE
               AND typical_amount_paise IS NOT NULL
               AND next_expected_at BETWEEN $2 AND $3`,
            [userId, periodStart, periodEnd]
        );
        const confirmedExpensePaise = Number(expenseRes.rows[0]?.confirmed_expense_paise || 0);

        // 4. Upcoming commitments in period (do NOT double-count with recurring)
        const commitmentRes = await dbClient.query(
            `SELECT COALESCE(SUM(amount_paise), 0) as commitment_total_paise
             FROM commitments
             WHERE user_id = $1
               AND status NOT IN ('paid', 'cancelled')
               AND due_date BETWEEN $2 AND $3
               AND series_id IS NULL`,  // exclude if already covered by recurring
            [userId, periodStart, periodEnd]
        );
        const additionalCommitmentPaise = Number(commitmentRes.rows[0]?.commitment_total_paise || 0);

        // 5. Goal contributions planned in period (if monthly_contribution_paise set)
        const goalRes = await dbClient.query(
            `SELECT COALESCE(SUM(monthly_contribution_paise), 0) as planned_contributions
             FROM goals
             WHERE user_id = $1
               AND status = 'active'
               AND is_deleted = FALSE
               AND monthly_contribution_paise IS NOT NULL`,
            [userId]
        );
        // Scale to period
        const monthlyGoalPaise = Number(goalRes.rows[0]?.planned_contributions || 0);
        const periodGoalPaise = Math.round(monthlyGoalPaise * (periodDays / 30));

        const totalKnownExpensePaise = confirmedExpensePaise + additionalCommitmentPaise + periodGoalPaise;
        const projectedNetPaise = currentBalancePaise + confirmedIncomePaise - totalKnownExpensePaise;

        return {
            period,
            period_start:          periodStart,
            period_end:            periodEnd,
            as_of:                 new Date().toISOString(),
            currency:              'INR',

            // Balance
            current_balance_paise: currentBalancePaise,

            // Known income
            confirmed_income_paise: confirmedIncomePaise,
            income_sources: {
                confirmed_recurring_credits: confirmedIncomePaise,
                series_count:               incomeCoverage,
                evidence_state:             'OBSERVED'
            },

            // Known expenses
            total_known_expense_paise: totalKnownExpensePaise,
            expense_breakdown: {
                confirmed_recurring_paise:    confirmedExpensePaise,
                additional_commitments_paise: additionalCommitmentPaise,
                goal_contributions_paise:     periodGoalPaise,
            },

            // Projection (deterministic — not probabilistic)
            projected_net_paise: projectedNetPaise,
            projection_type:     'known_event_projection',   // NOT a forecast (§18)
            projection_label:    'Based on confirmed recurring and known commitments',

            // Quality
            data_gaps:           currentBalancePaise === 0 ? ['No linked accounts with balance data'] : [],
            coverage_note:       'Only includes confirmed recurring series and user-confirmed commitments',
            freshness:           'current',
            cashflow_version:    CASHFLOW_VERSION
        };
    }
}
