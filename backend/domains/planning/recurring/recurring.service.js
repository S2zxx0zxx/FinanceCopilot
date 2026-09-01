/**
 * Recurring Service — Phase 7
 *
 * Lifecycle state machine for recurring series:
 *   DETECTED → REVIEWABLE → CONFIRMED → ACTIVE → PAUSED / ENDED / DISMISSED
 *
 * Rules (§11):
 * - Only valid transitions are allowed (tested in security + lifecycle tests)
 * - User edits create derived decisions — NEVER rewrite historical evidence (§12)
 * - Audit events written on every status change
 * - All monthly/annualized calculations use versioned rule (§13)
 *
 * Version: recurring_detection_v1.0.0
 */
import { detectRecurringCandidates, DETECTION_VERSION } from './recurring.detector.js';
import { RecurringRepo } from '../../../db/repositories/planning.repo.js';
import { AuditRepo } from '../../../db/repositories.js';
import { AppError } from '../../../utils/errors.js';

// ─── Valid state transitions (§11) ─────────────────────────────────────────
const VALID_TRANSITIONS = {
    detected:   ['reviewable', 'dismissed'],
    reviewable: ['confirmed', 'dismissed'],
    confirmed:  ['active', 'paused', 'ended', 'dismissed'],
    active:     ['paused', 'ended', 'dismissed'],
    paused:     ['active', 'ended', 'dismissed'],
    ended:      [],          // terminal
    dismissed:  ['detected'] // can be re-detected on next run
};

function assertValidTransition(currentStatus, targetStatus) {
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
        throw new AppError(
            `Invalid recurring lifecycle transition: ${currentStatus} → ${targetStatus}`,
            422,
            true,
            'INVALID_TRANSITION'
        );
    }
}

// ─── Annualization rule v1.0.0 (§13) ─────────────────────────────────────────
const ANNUALIZATION_MULTIPLIER = {
    weekly:    52,
    biweekly:  26,
    monthly:   12,
    quarterly:  4,
    annual:     1,
    custom:  null  // cannot safely annualize unknown cadence
};

function computeMonthlyEquivalent(typicalAmountPaise, frequency) {
    const monthly_multipliers = {
        weekly: 4.333,
        biweekly: 2.167,
        monthly: 1,
        quarterly: 1 / 3,
        annual: 1 / 12,
        custom: null
    };
    const m = monthly_multipliers[frequency];
    if (m === null || typicalAmountPaise == null) return null;
    return Math.round(typicalAmountPaise * m);
}

function computeAnnualEquivalent(typicalAmountPaise, frequency) {
    const m = ANNUALIZATION_MULTIPLIER[frequency];
    if (m === null || typicalAmountPaise == null) return null;
    return typicalAmountPaise * m;
}

export class RecurringService {
    /**
     * Run detection and persist candidates idempotently.
     * Returns summary: { detected_count, updated_count, skipped_count }
     */
    static async detectAndSavePatterns(userId) {
        const candidates = await detectRecurringCandidates(userId);

        let detected_count = 0;
        let updated_count = 0;

        for (const candidate of candidates) {
            const evidence = candidate._evidence;
            const { _evidence, _explanation, ...seriesData } = candidate;

            const saved = await RecurringRepo.upsertSeries(userId, seriesData);
            if (saved) {
                const isNew = new Date(saved.created_at).getTime() === new Date(saved.updated_at).getTime();
                if (isNew) detected_count++; else updated_count++;

                // Persist evidence (idempotent — duplicate tx+series pairs are ignored)
                for (const ev of evidence) {
                    await RecurringRepo.addEvidence(saved.series_id, userId, ev.transaction_id, ev.observed_at, ev.amount_paise);
                }
            }
        }

        return {
            detection_version: DETECTION_VERSION,
            candidates_evaluated: candidates.length,
            detected_count,
            updated_count
        };
    }

    static async listSeries(userId, filters = {}) {
        const series = await RecurringRepo.listSeries(userId, filters);
        return series.map(s => RecurringService._enrichSeries(s));
    }

    static async getSeriesDetail(userId, seriesId) {
        const series = await RecurringRepo.getSeriesById(userId, seriesId);
        if (!series) throw new AppError('Recurring series not found', 404, true, 'NOT_FOUND');
        const evidence = await RecurringRepo.getEvidence(seriesId);
        return { ...RecurringService._enrichSeries(series), evidence };
    }

    static async confirmSeries(userId, seriesId) {
        const series = await RecurringRepo.getSeriesById(userId, seriesId);
        if (!series) throw new AppError('Recurring series not found', 404, true, 'NOT_FOUND');
        assertValidTransition(series.status, 'confirmed');

        const updated = await RecurringRepo.updateSeriesStatus(userId, seriesId, 'confirmed');
        await AuditRepo.logEvent('RECURRING_CONFIRMED', 'recurring_series', seriesId, userId, { previous_status: series.status });
        return RecurringService._enrichSeries(updated);
    }

    static async dismissSeries(userId, seriesId, reason = null) {
        const series = await RecurringRepo.getSeriesById(userId, seriesId);
        if (!series) throw new AppError('Recurring series not found', 404, true, 'NOT_FOUND');
        assertValidTransition(series.status, 'dismissed');

        const updated = await RecurringRepo.updateSeriesStatus(userId, seriesId, 'dismissed', { reason });
        await AuditRepo.logEvent('RECURRING_DISMISSED', 'recurring_series', seriesId, userId, { reason });
        return RecurringService._enrichSeries(updated);
    }

    static async updateSeries(userId, seriesId, patch) {
        const series = await RecurringRepo.getSeriesById(userId, seriesId);
        if (!series) throw new AppError('Recurring series not found', 404, true, 'NOT_FOUND');
        if (['ended', 'dismissed'].includes(series.status)) {
            throw new AppError('Cannot edit an ended or dismissed recurring series', 422, true, 'INVALID_STATE');
        }

        const updated = await RecurringRepo.updateSeriesFields(userId, seriesId, patch);
        // Note: user edits create derived decisions — original evidence is NEVER modified (§12)
        await AuditRepo.logEvent('RECURRING_UPDATED', 'recurring_series', seriesId, userId, { patch_keys: Object.keys(patch) });
        return RecurringService._enrichSeries(updated);
    }

    static async pauseSeries(userId, seriesId) {
        return RecurringService._transition(userId, seriesId, 'paused', 'RECURRING_PAUSED');
    }

    static async resumeSeries(userId, seriesId) {
        return RecurringService._transition(userId, seriesId, 'active', 'RECURRING_RESUMED');
    }

    static async endSeries(userId, seriesId) {
        return RecurringService._transition(userId, seriesId, 'ended', 'RECURRING_ENDED');
    }

    static async getMonthlySummary(userId) {
        const summary = await RecurringRepo.getMonthlySummary(userId);
        const monthly_total_paise =
            Number(summary.monthly_paise || 0) +
            Number(summary.weekly_to_monthly || 0) +
            Number(summary.quarterly_to_monthly || 0) +
            Number(summary.annual_to_monthly || 0);

        return {
            monthly_total_paise: Math.round(monthly_total_paise),
            annualized_total_paise: Math.round(monthly_total_paise * 12),
            currency: 'INR',
            series_count: Number(summary.series_count || 0),
            calculation_version: DETECTION_VERSION,
            annualization_version: 'v1.0.0'
        };
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    static async _transition(userId, seriesId, targetStatus, eventType) {
        const series = await RecurringRepo.getSeriesById(userId, seriesId);
        if (!series) throw new AppError('Recurring series not found', 404, true, 'NOT_FOUND');
        assertValidTransition(series.status, targetStatus);

        const updated = await RecurringRepo.updateSeriesStatus(userId, seriesId, targetStatus);
        await AuditRepo.logEvent(eventType, 'recurring_series', seriesId, userId, { previous_status: series.status });
        return RecurringService._enrichSeries(updated);
    }

    /**
     * Enrich a raw DB row with computed monthly/annualized fields (§13).
     */
    static _enrichSeries(series) {
        if (!series) return null;
        let evidenceState = 'OBSERVED';
        if (series.is_user_confirmed) {
            evidenceState = 'USER_CONFIRMED';
        } else if (series.status === 'detected') {
            evidenceState = 'INFERRED';
        }
        return {
            ...series,
            monthly_equivalent_paise:   computeMonthlyEquivalent(series.typical_amount_paise, series.frequency),
            annualized_equivalent_paise: computeAnnualEquivalent(series.typical_amount_paise, series.frequency),
            annualization_version:      'v1.0.0',
            // Candidate vs confirmed distinction (§7, §11)
            evidence_state:             evidenceState
        };
    }
}
