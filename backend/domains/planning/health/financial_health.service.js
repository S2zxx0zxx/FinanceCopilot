/**
 * Financial Health Service — Phase 7 §29-30
 *
 * Computes 4 canonical health components (§29):
 * 1. Cash Buffer      — usable_cash / monthly_essential_spending
 * 2. Commitment Load  — total_monthly_commitments / monthly_income
 * 3. Savings Pace     — recent_contributions / target_monthly_pace
 * 4. Spending Stability — coefficient of variation of weekly spending over 8 weeks
 *
 * Each component has:
 * - exact definition
 * - time horizon
 * - inputs logged
 * - missing-data policy (returns 'unknown' — NEVER fake zero)
 * - freshness + coverage
 * - version
 *
 * Returns evidence-backed drivers for each component (§30).
 * NO combined single health score (no approved formula — §29).
 * Version: financial_health_v1.0.0
 */
import { dbClient } from '../../../db/client.js';
import { FinancialHealthRepo } from '../../../db/repositories/planning.repo.js';

const HEALTH_VERSION = 'v1.0.0';

// Thresholds (canonical — one source of truth)
const THRESHOLDS = {
    cash_buffer: {
        healthy:  3,   // >= 3 months of essential spending
        low:      1,   // 1–3 months
        critical: 0    // < 1 month
    },
    commitment_load: {
        healthy:   0.30,  // < 30% of income
        moderate:  0.50,  // 30–50%
        high:      0.70,  // 50–70%
        critical:  1.0    // > 70%
    },
    savings_pace: {
        on_track: 0.80,   // contributing >= 80% of target pace
        below:    0.0     // below 80%
    },
    spending_stability: {
        stable:   0.25,   // CV < 0.25
        variable: 0.50,   // CV 0.25–0.50
        volatile: 1.0     // CV > 0.50
    }
};

function categorizeCashBuffer(months) {
    if (months === null) return 'unknown';
    if (months >= THRESHOLDS.cash_buffer.healthy) return 'healthy';
    if (months >= THRESHOLDS.cash_buffer.low)     return 'low';
    return 'critical';
}

function categorizeCommitmentLoad(ratio) {
    if (ratio === null) return 'unknown';
    if (ratio <= THRESHOLDS.commitment_load.healthy)   return 'healthy';
    if (ratio <= THRESHOLDS.commitment_load.moderate)  return 'moderate';
    if (ratio <= THRESHOLDS.commitment_load.high)      return 'high';
    return 'critical';
}

function categorizeSavingsPace(ratio) {
    if (ratio === null) return 'unknown';
    if (!Number.isFinite(ratio)) return 'unknown';
    if (ratio >= THRESHOLDS.savings_pace.on_track) return 'on_track';
    return 'below';
}

function categorizeSpendingStability(cv) {
    if (cv === null) return 'unknown';
    if (cv <= THRESHOLDS.spending_stability.stable)   return 'stable';
    if (cv <= THRESHOLDS.spending_stability.variable) return 'variable';
    return 'volatile';
}

function safeRatio(num, denom) {
    if (!denom || denom === 0) return null;
    return Math.round((num / denom) * 10000) / 10000;
}

function safeCV(arr) {
    if (!arr || arr.length < 2) return null;
    const nums = arr.map(Number).filter(n => !Number.isNaN(n));
    if (nums.length < 2) return null;
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    if (mean === 0) return null;
    const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (nums.length - 1);
    return Math.round((Math.sqrt(variance) / mean) * 10000) / 10000;
}

export class FinancialHealthService {

    static async _computeCashBuffer(userId) {
        const cashRes = await dbClient.query(
            `SELECT COALESCE(SUM(
                CASE WHEN direction='credit' THEN amount_paise ELSE -amount_paise END
            ), 0) AS usable_cash_paise
             FROM transactions
             WHERE user_id = $1
               AND is_deleted = FALSE
               AND duplicate_status IN ('unique','primary')
               AND transfer_role IS NULL
               AND posting_status = 'posted'`,
            [userId]
        ).catch(() => null);

        const usableCashPaise = cashRes ? Number(cashRes.rows[0]?.usable_cash_paise || 0) : null;

        const essentialRes = await dbClient.query(
            `SELECT COALESCE(AVG(monthly_total), 0) AS avg_monthly_essential
             FROM (
                 SELECT DATE_TRUNC('month', observed_at) AS month,
                        SUM(amount_paise) AS monthly_total
                 FROM transactions
                 WHERE user_id = $1
                   AND direction = 'debit'
                   AND is_deleted = FALSE
                   AND duplicate_status IN ('unique','primary')
                   AND transfer_role IS NULL
                   AND posting_status = 'posted'
                   AND observed_at >= NOW() - INTERVAL '90 days'
                 GROUP BY 1
             ) monthly_totals`,
            [userId]
        ).catch(() => null);

        const monthlyEssentialPaise = essentialRes ? Number(essentialRes.rows[0]?.avg_monthly_essential || 0) : null;

        let cashBufferMonths = null;
        let cashBufferRatio = null;
        let gap = null;

        if (usableCashPaise !== null && monthlyEssentialPaise && monthlyEssentialPaise > 0) {
            cashBufferMonths = Math.round((usableCashPaise / monthlyEssentialPaise) * 100) / 100;
            cashBufferRatio = cashBufferMonths;
        } else {
            gap = 'Insufficient transaction history for cash buffer calculation';
        }

        return { usableCashPaise, monthlyEssentialPaise, cashBufferMonths, cashBufferRatio, gap, hasRes: !!cashRes };
    }

    static async _computeCommitmentLoad(userId) {
        const monthlyCommitmentsRes = await dbClient.query(
            `SELECT COALESCE(SUM(
                CASE
                    WHEN frequency='monthly'   THEN typical_amount_paise
                    WHEN frequency='weekly'    THEN typical_amount_paise * 4
                    WHEN frequency='quarterly' THEN typical_amount_paise / 3.0
                    WHEN frequency='annual'    THEN typical_amount_paise / 12.0
                    ELSE 0 END
             ), 0) AS monthly_commitment_paise
             FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND is_income = FALSE
               AND typical_amount_paise IS NOT NULL`,
            [userId]
        ).catch(() => null);

        const monthlyIncomeRes = await dbClient.query(
            `SELECT COALESCE(SUM(
                CASE
                    WHEN frequency='monthly'   THEN typical_amount_paise
                    WHEN frequency='annual'    THEN typical_amount_paise / 12.0
                    ELSE typical_amount_paise END
             ), 0) AS monthly_income_paise
             FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND is_income = TRUE
               AND typical_amount_paise IS NOT NULL`,
            [userId]
        ).catch(() => null);

        const monthlyCommitmentPaise = monthlyCommitmentsRes ? Number(monthlyCommitmentsRes.rows[0]?.monthly_commitment_paise || 0) : null;
        const monthlyIncomePaise = monthlyIncomeRes ? Number(monthlyIncomeRes.rows[0]?.monthly_income_paise || 0) : null;

        let commitmentLoadRatio = null;
        let gap = null;

        if (monthlyCommitmentPaise !== null && monthlyIncomePaise) {
            commitmentLoadRatio = safeRatio(monthlyCommitmentPaise, monthlyIncomePaise);
        } else {
            gap = 'Confirm recurring income and expense series to compute commitment load';
        }

        return { monthlyCommitmentPaise, monthlyIncomePaise, commitmentLoadRatio, gap };
    }

    static async _computeSavingsPace(userId) {
        const goalPaceRes = await dbClient.query(
            `SELECT
                COALESCE(SUM(monthly_contribution_paise), 0) AS target_monthly_paise,
                COUNT(*) AS active_goal_count
             FROM goals
             WHERE user_id = $1 AND status = 'active' AND is_deleted = FALSE`,
            [userId]
        ).catch(() => null);

        const recentContribRes = await dbClient.query(
            `SELECT COALESCE(SUM(gc.amount_paise), 0) AS recent_contributions
             FROM goal_contributions gc
             JOIN goals g ON gc.goal_id = g.goal_id
             WHERE gc.user_id = $1
               AND gc.status = 'confirmed'
               AND gc.contribution_date >= CURRENT_DATE - INTERVAL '30 days'`,
            [userId]
        ).catch(() => null);

        const targetMonthlyPaise = goalPaceRes ? Number(goalPaceRes.rows[0]?.target_monthly_paise || 0) : null;
        const activeGoalCount = goalPaceRes ? Number(goalPaceRes.rows[0]?.active_goal_count || 0) : 0;
        const recentContribPaise = recentContribRes ? Number(recentContribRes.rows[0]?.recent_contributions || 0) : null;

        let savingsPaceRatio = null;
        let gap = null;

        if (activeGoalCount === 0) {
            gap = 'No active goals to compute savings pace';
        } else if (targetMonthlyPaise !== null && recentContribPaise !== null && targetMonthlyPaise > 0) {
            savingsPaceRatio = safeRatio(recentContribPaise, targetMonthlyPaise);
        }

        return { targetMonthlyPaise, activeGoalCount, recentContribPaise, savingsPaceRatio, gap };
    }

    static async _computeSpendingStability(userId) {
        const weeklySpendRes = await dbClient.query(
            `SELECT DATE_TRUNC('week', observed_at) AS week,
                    SUM(amount_paise) AS weekly_spending
             FROM transactions
             WHERE user_id = $1
               AND direction = 'debit'
               AND is_deleted = FALSE
               AND duplicate_status IN ('unique','primary')
               AND transfer_role IS NULL
               AND posting_status = 'posted'
               AND observed_at >= NOW() - INTERVAL '56 days'
             GROUP BY 1
             ORDER BY 1`,
            [userId]
        ).catch(() => null);

        let spendingStabilityCV = null;
        let gap = null;
        const weeksAnalyzed = weeklySpendRes?.rows?.length || 0;

        if (weeklySpendRes && weeksAnalyzed >= 3) {
            spendingStabilityCV = safeCV(weeklySpendRes.rows.map(r => r.weekly_spending));
        } else {
            gap = 'Fewer than 3 weeks of spending data for stability calculation';
        }

        return { spendingStabilityCV, weeksAnalyzed, gap };
    }

    static _getDriverReasons(cb, cl, sp, ss) {
        let cashBufferReason = 'Insufficient data';
        if (cb.cashBufferMonths !== null) {
            cashBufferReason = cb.cashBufferMonths >= 3 ? 'Current usable cash covers 3+ months of spending' : `Current usable cash covers only ${cb.cashBufferMonths.toFixed(1)} months of spending`;
        }

        let commitmentLoadReason = 'Confirm recurring income and expense series to get this indicator';
        if (cl.commitmentLoadRatio !== null) {
            commitmentLoadReason = `${Math.round(cl.commitmentLoadRatio * 100)}% of confirmed income is committed to recurring expenses`;
        }

        let savingsPaceReason = 'Set monthly contribution targets on goals to track savings pace';
        if (sp.activeGoalCount === 0) {
            savingsPaceReason = 'No active goals set';
        } else if (sp.savingsPaceRatio !== null) {
            savingsPaceReason = `Contributing ${Math.round(sp.savingsPaceRatio * 100)}% of target monthly savings pace`;
        }

        let spendingStabilityReason = 'Insufficient weekly spending history (need 3+ weeks)';
        if (ss.spendingStabilityCV !== null) {
            spendingStabilityReason = ss.spendingStabilityCV <= 0.25 ? 'Spending is consistent week to week' : `Weekly spending varies significantly (coefficient of variation: ${ss.spendingStabilityCV.toFixed(2)})`;
        }

        return { cashBufferReason, commitmentLoadReason, savingsPaceReason, spendingStabilityReason };
    }

    static async computeHealthSnapshot(userId) {
        const dataGaps = [];
        const inputs = {};

        // 1. Cash Buffer
        const cb = await this._computeCashBuffer(userId);
        if (cb.gap) dataGaps.push(cb.gap);
        inputs.cash_buffer = { usable_cash_paise: cb.usableCashPaise, monthly_essential_paise: cb.monthlyEssentialPaise };

        // 2. Commitment Load
        const cl = await this._computeCommitmentLoad(userId);
        if (cl.gap) dataGaps.push(cl.gap);
        inputs.commitment_load = { monthly_commitment_paise: cl.monthlyCommitmentPaise, monthly_income_paise: cl.monthlyIncomePaise };

        // 3. Savings Pace
        const sp = await this._computeSavingsPace(userId);
        if (sp.gap) dataGaps.push(sp.gap);
        inputs.savings_pace = { target_monthly_paise: sp.targetMonthlyPaise, recent_contributions_paise: sp.recentContribPaise };

        // 4. Spending Stability
        const ss = await this._computeSpendingStability(userId);
        if (ss.gap) dataGaps.push(ss.gap);
        inputs.spending_stability = { weeks_analyzed: ss.weeksAnalyzed };

        // Assemble + persist snapshot
        const healthData = {
            cash_buffer_ratio:          cb.cashBufferRatio,
            cash_buffer_months:         cb.cashBufferMonths,
            cash_buffer_status:         categorizeCashBuffer(cb.cashBufferMonths),
            commitment_load_ratio:      cl.commitmentLoadRatio,
            commitment_load_status:     categorizeCommitmentLoad(cl.commitmentLoadRatio),
            savings_pace_ratio:         sp.savingsPaceRatio,
            savings_pace_status:        categorizeSavingsPace(sp.savingsPaceRatio),
            spending_stability_cv:      ss.spendingStabilityCV,
            spending_stability_status:  categorizeSpendingStability(ss.spendingStabilityCV),
            health_version:             HEALTH_VERSION,
            horizon_days:               30,
            coverage:                   dataGaps.length === 0 ? 1.0 : Math.max(0.1, 1 - (dataGaps.length * 0.2)),
            freshness_seconds:          0,
            data_gaps:                  dataGaps,
            inputs_snapshot:            inputs
        };

        await FinancialHealthRepo.saveHealthSnapshot(userId, healthData);

        const reasons = this._getDriverReasons(cb, cl, sp, ss);

        return {
            ...healthData,
            computed_at: new Date().toISOString(),
            drivers: {
                cash_buffer: {
                    status: healthData.cash_buffer_status,
                    value_months: cb.cashBufferMonths,
                    reason: reasons.cashBufferReason,
                    data_freshness: 'current',
                    coverage: cb.hasRes ? 'measured' : 'unknown'
                },
                commitment_load: {
                    status: healthData.commitment_load_status,
                    ratio: cl.commitmentLoadRatio,
                    reason: reasons.commitmentLoadReason,
                    data_freshness: 'current',
                    coverage: (cl.monthlyIncomePaise || 0) > 0 ? 'measured' : 'unknown'
                },
                savings_pace: {
                    status: healthData.savings_pace_status,
                    ratio: sp.savingsPaceRatio,
                    reason: reasons.savingsPaceReason,
                    data_freshness: 'current'
                },
                spending_stability: {
                    status: healthData.spending_stability_status,
                    cv: ss.spendingStabilityCV,
                    reason: reasons.spendingStabilityReason,
                    weeks_analyzed: ss.weeksAnalyzed,
                    data_freshness: 'current'
                }
            }
        };
    }
}
