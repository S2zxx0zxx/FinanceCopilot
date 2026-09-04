/**
 * Recurring Pattern Detector — Phase 7 §8
 *
 * Deterministic, versioned recurring detector over real canonical transactions.
 *
 * DETECTION RULE v1.0.0:
 * - Group transactions by (user_id, merchant_normalized, direction)
 * - Require >= MIN_OBSERVATIONS within WINDOW_DAYS
 * - Check cadence regularity (mean interval ± tolerance)
 * - Classify amount type: fixed/variable/bounded_variable
 * - Build deterministic_key = hash(user_id + merchant_normalized + frequency + direction)
 * - Return DETECTED candidates — NEVER auto-confirm
 *
 * Evidence fields returned per candidate:
 * - merchant_evidence: merchant_normalized
 * - amount_evidence: typical_amount_paise, amount_type, variance
 * - cadence_evidence: frequency, mean_interval_days, cadence_cv
 * - account_evidence: account_id(s)
 * - observation_window: window_days
 * - observations_count: count
 * - rule_version: 'v1.0.0'
 */
import { dbClient } from '../../../db/client.js';
import { createHash } from 'node:crypto';

export const DETECTION_VERSION = 'v1.0.0';

// Detection thresholds (canonical rule — no magic constants scattered in code)
const RULES = {
    MIN_OBSERVATIONS: 2,      // minimum occurrences to be a candidate
    WINDOW_DAYS: 365,         // look back 12 months
    CADENCE_CV_THRESHOLD: 0.4, // max coefficient of variation for cadence to be "regular"
    AMOUNT_CV_FIXED: 0.05,    // amount variance below this = 'fixed'
    AMOUNT_CV_BOUNDED: 0.30,  // amount variance below this = 'bounded_variable'
    CONFIDENCE_BASE: 0.60,
    CONFIDENCE_PER_OBSERVATION: 0.05,
    CONFIDENCE_MAX: 0.95,
};

// Cadence mapping: mean interval (days) → frequency
const CADENCE_MAP = [
    { min: 6,   max: 9,   label: 'weekly'    },
    { min: 13,  max: 17,  label: 'biweekly'  },
    { min: 25,  max: 35,  label: 'monthly'   },
    { min: 85,  max: 100, label: 'quarterly' },
    { min: 350, max: 380, label: 'annual'    },
];

function detectFrequency(meanIntervalDays) {
    for (const c of CADENCE_MAP) {
        if (meanIntervalDays >= c.min && meanIntervalDays <= c.max) return c.label;
    }
    return 'custom';
}

function computeMean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function computeCV(arr) {
    if (arr.length < 2) return 0;
    const mean = computeMean(arr);
    if (mean === 0) return 0;
    const variance = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance) / mean;
}

function buildDeterministicKey(userId, merchantNormalized, frequency, direction) {
    return createHash('sha256')
        .update(`${userId}|${(merchantNormalized || '').toLowerCase()}|${frequency}|${direction}`)
        .digest('hex')
        .slice(0, 32);
}

function classifyAmountType(amountCV) {
    if (amountCV <= RULES.AMOUNT_CV_FIXED)   return 'fixed';
    if (amountCV <= RULES.AMOUNT_CV_BOUNDED) return 'bounded_variable';
    return 'variable';
}

function computeConfidence(count, cadenceCV) {
    let conf = RULES.CONFIDENCE_BASE + (count - RULES.MIN_OBSERVATIONS) * RULES.CONFIDENCE_PER_OBSERVATION;
    // Penalise irregular cadence
    if (cadenceCV > RULES.CADENCE_CV_THRESHOLD) conf *= 0.75;
    return Math.min(Math.max(conf, 0.3), RULES.CONFIDENCE_MAX);
}

function estimateNextDate(lastSeenAt, meanIntervalDays) {
    if (!lastSeenAt || !meanIntervalDays) return null;
    const last = new Date(lastSeenAt);
    last.setDate(last.getDate() + Math.round(meanIntervalDays));
    // FIX (audit P1 #43): toISOString() returns UTC. For Indian users a
    // transaction observed at 23:30 IST becomes "yesterday" in UTC and the
    // next_expected_at drifts by a day. Format in IST (Asia/Kolkata, UTC+5:30).
    return toIstDateString(last);
}

/**
 * FIX (audit P1 #43): format a Date as YYYY-MM-DD in IST. Falls back to UTC
 * ISO slice on environments without Intl. Used for next_expected_at,
 * first_seen_at, last_seen_at so the user-facing calendar matches what they
 * see in their bank statement (which is in IST).
 */
function toIstDateString(date) {
    try {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(date);
    } catch {
        return date.toISOString().split('T')[0];
    }
}

/**
 * Run detection over real transactions for a user.
 * Returns array of candidate objects (NOT yet persisted — caller persists via RecurringRepo.upsertSeries).
 */
export async function detectRecurringCandidates(userId) {
    // Query real canonical transactions within window
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - RULES.WINDOW_DAYS);

    const res = await dbClient.query(
        `SELECT
            transaction_id, merchant_normalized, direction, account_id,
            amount_paise, observed_at, transaction_type
         FROM transactions
         WHERE user_id = $1
           AND is_deleted = FALSE
           AND posting_status = 'posted'
           AND duplicate_status IN ('unique', 'primary')
           AND merchant_normalized IS NOT NULL
           AND observed_at >= $2
         ORDER BY merchant_normalized, direction, observed_at ASC`,
        [userId, windowStart.toISOString()]
    );

    const transactions = res.rows;
    if (transactions.length === 0) return [];

    // Group by (merchant_normalized, direction)
    const groups = new Map();
    for (const tx of transactions) {
        const key = `${tx.merchant_normalized}|${tx.direction}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(tx);
    }

    const candidates = [];

    for (const [groupKey, txs] of groups) {
        if (txs.length < RULES.MIN_OBSERVATIONS) continue;

        const [merchantNormalized, direction] = groupKey.split('|');

        // Compute intervals between consecutive transactions
        const dates = txs.map(t => new Date(t.observed_at));
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
            intervals.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
        }

        const meanInterval = computeMean(intervals);
        const cadenceCV = computeCV(intervals);
        const frequency = detectFrequency(meanInterval);

        // Skip if cadence is too irregular (no explainable pattern)
        if (cadenceCV > RULES.CADENCE_CV_THRESHOLD * 1.5 && frequency === 'custom') continue;

        // Amount analysis
        const amounts = txs.map(t => Number(t.amount_paise));
        const meanAmount = computeMean(amounts);
        const amountCV = computeCV(amounts);
        const amountType = classifyAmountType(amountCV);
        const variance = amounts.reduce((acc, a) => acc + Math.pow(a - meanAmount, 2), 0) / amounts.length;

        const firstTx = txs[0];
        const lastTx  = txs[txs.length - 1];
        const confidence = computeConfidence(txs.length, cadenceCV);

        const deterministicKey = buildDeterministicKey(userId, merchantNormalized, frequency, direction);

        candidates.push({
            user_id:                userId,
            merchant_id:            firstTx.merchant_id || null,
            series_name:            merchantNormalized,
            series_type:            'other',  // refine when merchant taxonomy available
            frequency,
            amount_type:            amountType,
            typical_amount_paise:   Math.round(meanAmount),
            amount_variance_paise:  Math.round(Math.sqrt(variance)),
            currency:               'INR',
            first_seen_at:          firstTx.observed_at?.toISOString?.()?.split('T')[0] || null,
            last_seen_at:           lastTx.observed_at?.toISOString?.()?.split('T')[0] || null,
            observation_count:      txs.length,
            observation_window_days: RULES.WINDOW_DAYS,
            next_expected_at:       estimateNextDate(lastTx.observed_at, meanInterval),
            confidence:             Math.round(confidence * 1000) / 1000,
            detection_version:      DETECTION_VERSION,
            status:                 'detected',
            is_income:              direction === 'credit',
            deterministic_key:      deterministicKey,

            // Evidence metadata (returned for caller to persist)
            _evidence: txs.map(tx => ({
                transaction_id: tx.transaction_id,
                observed_at:    toIstDateString(new Date(tx.observed_at)),
                amount_paise:   Number(tx.amount_paise)
            })),

            // Explainability fields (§8 requirement)
            _explanation: {
                merchant_evidence:   merchantNormalized,
                amount_evidence:     { typical_amount_paise: Math.round(meanAmount), amount_type: amountType },
                cadence_evidence:    { frequency, mean_interval_days: Math.round(meanInterval), cadence_cv: Math.round(cadenceCV * 1000) / 1000 },
                account_evidence:    [...new Set(txs.map(t => t.account_id).filter(Boolean))],
                observation_window:  RULES.WINDOW_DAYS,
                observations_count:  txs.length,
                rule_version:        DETECTION_VERSION
            }
        });
    }

    return candidates;
}
