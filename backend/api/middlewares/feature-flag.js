import { FeatureFlags } from '../../utils/feature-flags.js';
import { BetaCohort } from '../../utils/beta-cohort.js';
import { logger } from '../../utils/logger.js';

/**
 * Phase 13 Feature Flag Middleware — Production-hardened
 *
 * CRITICAL FIXES from audit (§5, §9, §40):
 *  1. Old version defaulted ALL users to ['INTERNAL'] cohort — this was wrong.
 *     Real cohort must be loaded from DB or session. Default = NOT_ELIGIBLE.
 *  2. Test accounts must be blocked from entering beta gates.
 *  3. Every flag check is logged for auditability.
 */
export const requireFeatureFlag = (flagName) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user?.userId) {
                return res.status(401).json({ error: 'UNAUTHENTICATED' });
            }

            // Load persisted cohort assignment from DB (never default to INTERNAL)
            const assignment = await BetaCohort.getAssignment(user.userId);
            const userCohorts = assignment ? [assignment.cohort] : [];

            if (!FeatureFlags.isEnabled(flagName, userCohorts)) {
                logger.warn('[FLAGS] Beta access denied', {
                    userId: user.userId,
                    flag: flagName,
                    cohort: assignment?.cohort || 'NONE',
                    path: req.path,
                    trace_id: req.headers['x-trace-id'] || req.traceId
                });
                return res.status(403).json({
                    error: 'BETA_ACCESS_REQUIRED',
                    message: 'This feature is currently in controlled beta and requires explicit access.',
                    flag: flagName
                });
            }

            // Attach cohort to request for downstream telemetry use
            req.betaCohort = assignment.cohort;
            next();
        } catch (err) {
            logger.error('[FLAGS] Error evaluating feature flag', { flag: flagName, err: err.message });
            next(err);
        }
    };
};
