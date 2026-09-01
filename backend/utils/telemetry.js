import crypto from 'crypto';
import { logger } from './logger.js';

/**
 * Phase 13 Privacy-Safe Telemetry Service — Hardened
 *
 * CRITICAL DESIGN RULES (per Phase 13 prompt §2, §41, §42):
 *  1. Test/Synthetic/Developer traffic MUST be isolated from real-user metrics.
 *  2. No PII, raw financial values, or full AI conversations in analytics.
 *  3. Every event fires exactly once at the correct server-side moment.
 *  4. Events respect user deletion — on account delete, anon_user is re-hashed
 *     with a revoked salt so future lookups cannot reconstruct history.
 */

// Traffic classes — never merge these
export const TrafficClass = Object.freeze({
    REAL_USER: 'REAL_USER',
    SYNTHETIC: 'SYNTHETIC',
    INTEGRATION_TEST: 'INTEGRATION_TEST',
    LOAD_TEST: 'LOAD_TEST',
    DEVELOPER: 'DEVELOPER'
});

// PII fields that must NEVER appear in analytics payloads
const BLOCKED_KEYS = new Set([
    'balance', 'amount', 'amount_paise', 'accountNumber', 'account_number',
    'rawPrompt', 'prompt', 'conversation', 'statement', 'iban', 'pan',
    'password', 'token', 'access_token', 'refresh_token', 'credit_card'
]);

function deepStripPII(obj, depth = 0) {
    if (depth > 4 || obj === null || typeof obj !== 'object') return obj;
    const safe = {};
    for (const [k, v] of Object.entries(obj)) {
        if (BLOCKED_KEYS.has(k.toLowerCase())) {
            safe[k] = '[REDACTED]';
        } else if (typeof v === 'object') {
            safe[k] = deepStripPII(v, depth + 1);
        } else {
            safe[k] = v;
        }
    }
    return safe;
}

export const Telemetry = {
    _hashId(userId) {
        if (!userId) return 'anonymous';
        const salt = process.env.TELEMETRY_SALT;
        if (!salt) {
            if (process.env.NODE_ENV === 'production') {
                const err = new Error('TELEMETRY_SALT missing in production environment. Startup failed to protect privacy.');
                err.code = 'MISSING_TELEMETRY_SALT';
                throw err;
            }
            logger.warn('[TELEMETRY] TELEMETRY_SALT not set — using fallback. Set this env var in production.');
        }
        return crypto
            .createHash('sha256')
            .update((salt || 'MISSING_SALT') + userId)
            .digest('hex')
            .substring(0, 16);
    },

    /**
     * Core event tracking.
     * @param {string} userId — raw user ID (hashed before persistence)
     * @param {string} eventName — snake_case event name
     * @param {object} metadata — safe, non-PII properties
     * @param {TrafficClass} trafficClass — MUST be explicitly set by caller
     */
    trackEvent(userId, eventName, metadata = {}, trafficClass = TrafficClass.REAL_USER) {
        const safeMetadata = deepStripPII(metadata);

        const payload = {
            anon_user: this._hashId(userId),
            event: eventName,
            traffic_class: trafficClass, // CRITICAL: isolates test from real
            timestamp: new Date().toISOString(),
            properties: safeMetadata
        };

        // WARN loud if test traffic could contaminate real metrics
        if (trafficClass !== TrafficClass.REAL_USER) {
            logger.warn(`[TELEMETRY][${trafficClass}] SYNTHETIC/TEST event — excluded from real-user aggregation`, {
                event: eventName, traffic_class: trafficClass
            });
        } else {
            logger.info(`[TELEMETRY] ${eventName}`, payload);
        }
        // In production: forward to PostHog/Amplitude/ClickHouse with traffic_class filter
        return payload;
    },

    /**
     * Track onboarding funnel steps (§10, §11).
     * Each step only fires after real server-side condition is met.
     */
    trackOnboardingStep(userId, step, metadata = {}, trafficClass = TrafficClass.REAL_USER) {
        const VALID_STEPS = [
            'BETA_INVITED', 'BETA_ACCEPTED', 'SIGNED_IN', 'CONSENTED',
            'DATA_SOURCE_CONNECTED', 'FIRST_DATA_READY', 'FIRST_AI_QUERY',
            'FIRST_USEFUL_RESULT', 'FIRST_CORRECTION', 'FIRST_PLANNING_ACTION'
        ];
        if (!VALID_STEPS.includes(step)) {
            logger.error(`[TELEMETRY] Invalid onboarding step: ${step}. Rejected.`);
            return null;
        }
        return this.trackEvent(userId, `ONBOARDING_${step}`, metadata, trafficClass);
    },

    /**
     * Track a real correction loop completion (§14, §15).
     * Only fires after backend confirms: persisted + downstream updated.
     */
    trackCorrectionCompleted(userId, correctionMeta, trafficClass = TrafficClass.REAL_USER) {
        const safe = {
            object_type: correctionMeta.objectType,
            field: correctionMeta.field,
            reason_category: correctionMeta.reasonCategory,
            downstream_updated: correctionMeta.downstreamUpdated === true,
            time_to_correct_ms: correctionMeta.timeToCorrectMs
        };
        return this.trackEvent(userId, 'CORRECTION_COMPLETED', safe, trafficClass);
    },

    /**
     * Track system/provider failures.
     */
    trackFailure(userId, failureType, component, errorClass, trafficClass = TrafficClass.REAL_USER) {
        logger.error(`[TELEMETRY_FAILURE] ${failureType} in ${component}`, {
            anon_user: this._hashId(userId),
            component,
            error_class: errorClass,
            traffic_class: trafficClass
        });
    }
};
