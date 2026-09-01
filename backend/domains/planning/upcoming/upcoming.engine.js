/**
 * Upcoming Engine — Phase 7 §15-17
 *
 * Generates upcoming payment items from REAL evidence only.
 *
 * Source hierarchy (§15 — strictly followed):
 * 1. user-confirmed obligations (commitments with source_type='user_confirmed')
 * 2. confirmed recurring items (recurring_series with status IN ('confirmed','active'))
 * 3. known scheduled events
 * 4. inferred candidates (source_type='inferred_candidate') — labeled as INFERRED, not CONFIRMED
 *
 * NEVER fabricates an event without source evidence.
 *
 * Horizons (§16): 7d, 30d, 90d
 * States (§17): EXPECTED, DUE, OVERDUE, PAID, CANCELLED, UNKNOWN
 */
import { dbClient } from '../../../db/client.js';
import { CommitmentRepo } from '../../../db/repositories/planning.repo.js';
import { AppError } from '../../../utils/errors.js';

const UPCOMING_VERSION = 'v1.0.0';

const HORIZON_DAYS = {
    '7d':  7,
    '30d': 30,
    '90d': 90
};

function getDateRange(horizon) {
    const horizonDays = HORIZON_DAYS[horizon];
    if (!horizonDays) throw new AppError(`Invalid horizon: ${horizon}. Use 7d, 30d, or 90d.`, 400, true, 'INVALID_HORIZON');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - 7); // include 7-day lookback for overdue
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + horizonDays);
    return {
        today: today.toISOString().split('T')[0],
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0]
    };
}

function computeUpcomingStatus(dueDate, today, rawStatus) {
    if (rawStatus === 'paid')      return 'PAID';
    if (rawStatus === 'cancelled') return 'CANCELLED';
    if (!dueDate)                  return 'UNKNOWN';
    if (dueDate < today)           return 'OVERDUE';
    if (dueDate === today)         return 'DUE';
    return 'EXPECTED';
}

export class UpcomingEngine {
    /**
     * Generate upcoming items for a user within a horizon.
     * @param {string} userId
     * @param {'7d'|'30d'|'90d'} horizon
     */
    static async generate(userId, horizon = '30d') {
        const { today, fromDate, toDate } = getDateRange(horizon);

        // 1. Pull from commitments table (persisted upcoming items)
        const commitments = await CommitmentRepo.listUpcoming(userId, { fromDate, toDate, limit: 500 });

        // 2. Pull confirmed recurring series to generate upcoming instances not yet in commitments
        const confirmedRecurring = await dbClient.query(
            `SELECT * FROM recurring_series
             WHERE user_id = $1
               AND status IN ('confirmed', 'active')
               AND next_expected_at IS NOT NULL
               AND next_expected_at BETWEEN $2 AND $3
               AND is_income = FALSE`,
            [userId, fromDate, toDate]
        );

        // Collect commitment series_ids to avoid duplicating items
        const coveredSeriesIds = new Set(commitments.map(c => c.series_id).filter(Boolean));

        const items = [];

        // Process commitments
        for (const c of commitments) {
            const dueDateStr = c.due_date?.toISOString?.()?.split('T')[0] || null;
            const status = computeUpcomingStatus(dueDateStr, today, c.status);

            let evidenceState = 'INFERRED';
            if (c.source_type === 'user_confirmed') {
                evidenceState = 'USER_CONFIRMED';
            } else if (c.source_type === 'confirmed_recurring') {
                evidenceState = 'OBSERVED';
            }

            items.push({
                item_id:         c.commitment_id,
                type:            'commitment',
                name:            c.name,
                amount_paise:    Number(c.amount_paise),
                currency:        c.currency,
                expected_date:   dueDateStr,
                status,
                source_type:     c.source_type,         // 'user_confirmed' | 'confirmed_recurring' | 'inferred_candidate'
                evidence_state:  evidenceState,
                confidence:      Number(c.confidence || 1.0),
                series_id:       c.series_id || null,
                account_id:      c.account_id || null,
                paid_at:         c.paid_at || null,
                commitment_type: c.commitment_type
            });
        }

        // Generate upcoming instances from confirmed recurring series not already in commitments
        for (const rs of confirmedRecurring.rows) {
            if (coveredSeriesIds.has(rs.series_id)) continue;
            const dueDateStr = rs.next_expected_at?.toISOString?.()?.split('T')[0] || null;
            const status = computeUpcomingStatus(dueDateStr, today, 'expected');

            items.push({
                item_id:         rs.series_id,
                type:            'recurring_projection',
                name:            rs.series_name,
                amount_paise:    rs.typical_amount_paise ? Number(rs.typical_amount_paise) : null,
                currency:        rs.currency,
                expected_date:   dueDateStr,
                status,
                source_type:     'confirmed_recurring',
                evidence_state:  'OBSERVED',
                confidence:      Number(rs.confidence || 0.7),
                series_id:       rs.series_id,
                account_id:      null,
                paid_at:         null,
                commitment_type: rs.series_type
            });
        }

        // Sort by expected_date ASC, overdue first
        items.sort((a, b) => {
            if (!a.expected_date) return 1;
            if (!b.expected_date) return -1;
            return a.expected_date.localeCompare(b.expected_date);
        });

        return {
            horizon,
            horizon_days:     HORIZON_DAYS[horizon],
            period_start:     fromDate,
            period_end:       toDate,
            as_of:            today,
            items,
            total_count:      items.length,
            total_expected_paise: items
                .filter(i => ['EXPECTED', 'DUE', 'OVERDUE'].includes(i.status) && i.amount_paise)
                .reduce((sum, i) => sum + i.amount_paise, 0),
            currency:         'INR',
            upcoming_version: UPCOMING_VERSION
        };
    }
}
