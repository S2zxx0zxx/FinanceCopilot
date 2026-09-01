import crypto from 'crypto';
import { dbClient as db } from '../db/client.js';
import { logger } from './logger.js';

/**
 * Phase 13 Beta Cohort Assignment Service
 *
 * DESIGN RULES (per Phase 13 prompt §6, §7, §8, §9):
 *  - beta_participant_id maps to a real authenticated user (no fake second identity)
 *  - Assignment is deterministic and persisted (no cohort switching mid-measurement)
 *  - Eligibility requirements are explicit and auditable
 *  - Cohort membership must not change unpredictably during measurement window
 */

export const BetaCohortPolicy = Object.freeze({
    INTERNAL: 'INTERNAL',
    BETA_COHORT_1: 'BETA_COHORT_1',
    NOT_ELIGIBLE: 'NOT_ELIGIBLE'
});

/**
 * Deterministically hashes a userId to a stable bucket (0–99).
 * Allows percentage-based rollout without DB lookup for eligible users.
 */
function getUserBucket(userId) {
    const hash = crypto.createHash('md5').update(userId).digest('hex');
    return parseInt(hash.substring(0, 4), 16) % 100;
}

export const BetaCohort = {
    /**
     * Determine cohort for a user.
     * 
     * Eligibility prerequisites (§8):
     *  - Must be authenticated (caller verified)
     *  - Must have valid consent on file
     *  - Must not be a test/developer account (isTestAccount flag)
     *  - POLICY_REQUIRED: age/region/regulatory eligibility not yet defined
     *
     * @returns {{ cohort: string, eligible: boolean, reason: string }}
     */
    async assignCohort(userId, userRecord) {
        // Guard: test/developer accounts are NEVER beta participants
        if (userRecord.isTestAccount || userRecord.isDeveloper) {
            return { cohort: BetaCohortPolicy.NOT_ELIGIBLE, eligible: false, reason: 'TEST_ACCOUNT' };
        }

        // Guard: consent must be valid
        if (!userRecord.hasValidConsent) {
            return { cohort: BetaCohortPolicy.NOT_ELIGIBLE, eligible: false, reason: 'MISSING_CONSENT' };
        }

        // Guard: regulatory/region eligibility — POLICY_REQUIRED, blocking for now
        if (!userRecord.betaRegionApproved) {
            return { cohort: BetaCohortPolicy.NOT_ELIGIBLE, eligible: false, reason: 'POLICY_REQUIRED_REGION' };
        }

        // Check if user is an explicit INTERNAL invite
        if (userRecord.betaRole === 'INTERNAL') {
            await this._persistAssignment(userId, BetaCohortPolicy.INTERNAL);
            return { cohort: BetaCohortPolicy.INTERNAL, eligible: true, reason: 'EXPLICIT_INTERNAL_INVITE' };
        }

        // Percentage rollout for BETA_COHORT_1 (first 5% of eligible users)
        const bucket = getUserBucket(userId);
        if (bucket < 5) {
            await this._persistAssignment(userId, BetaCohortPolicy.BETA_COHORT_1);
            return { cohort: BetaCohortPolicy.BETA_COHORT_1, eligible: true, reason: 'PERCENTAGE_ROLLOUT' };
        }

        return { cohort: BetaCohortPolicy.NOT_ELIGIBLE, eligible: false, reason: 'NOT_IN_ROLLOUT_BUCKET' };
    },

    /**
     * Persist cohort assignment so it is stable across sessions.
     */
    async _persistAssignment(userId, cohort) {
        // R-010: Enforce transactional DB persistence (must fail strictly on error)
        await db.query(`
            INSERT INTO beta_cohort_assignments (user_id, cohort, assigned_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id) DO NOTHING
        `, [userId, cohort]);
    },

    /**
     * Load existing assignment from DB (deterministic/idempotent).
     */
    async getAssignment(userId) {
        const { rows } = await db.query(
            'SELECT cohort, assigned_at FROM beta_cohort_assignments WHERE user_id = $1',
            [userId]
        );
        return rows[0] || null;
    }
};
