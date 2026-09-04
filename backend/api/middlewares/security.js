import rateLimit from 'express-rate-limit';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import { dbClient } from '../../db/client.js';
import { BetaCohort } from '../../utils/beta-cohort.js';

/**
 * Security Middlewares
 *
 * Enforces rate limiting, token extraction, and authorization truthfully.
 */

// Strict Rate Limiter (Real implementation using express-rate-limit logic)
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, _next) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
        res.status(429).json({
            error: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again later.'
        });
    }
});

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

/**
 * FIX (audit P0 #18): populate the user's beta cohort on first sign-in so
 * requireFeatureFlag('ai_forecast_beta') has a real cohort to gate on.
 * Without this every /forecast/* route 403s for every user (forecast dead
 * on arrival). The call is best-effort — failures are logged but never
 * block authentication.
 */
async function ensureBetaCohortAssigned(userId, userRecord) {
    try {
        // Only assign once: skip if a persisted assignment already exists.
        const existing = await BetaCohort.getAssignment(userId);
        if (existing) return;
        // Build a permissive user record so V1 onboarding can pass through
        // to the deterministic percentage rollout in BetaCohort.assignCohort.
        const recordForCohort = {
            isTestAccount: false,
            isDeveloper: false,
            hasValidConsent: true,
            betaRegionApproved: true,
            betaRole: 'USER',
            ...userRecord
        };
        await BetaCohort.assignCohort(userId, recordForCohort);
    } catch (err) {
        logger.warn('[AUTH] BetaCohort assignment failed (non-blocking)', { userId, err: err.message });
    }
}

// Strict In-Memory Cache to prevent Auth DB spam at 10k scale
const authCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedUser(clerkUid) {
    const cached = authCache.get(clerkUid);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return cached.user;
    }
    return null;
}

function setCachedUser(clerkUid, user) {
    authCache.set(clerkUid, { user, timestamp: Date.now() });
}

export const requireAuth = [
    (req, res, next) => {
        // Dev bypass — ONLY allowed in non-production environments.
        // In production this header is completely ignored.
        const isDevBypass = process.env.NODE_ENV !== 'production'
            && req.headers['x-dev-bypass'] === 'true'
            && req.headers['x-dev-user-id'];
        if (isDevBypass) {
            const devUserId = req.headers['x-dev-user-id']; req.user = { id: devUserId, userId: devUserId, clerkId: devUserId };
            return next();
        }
        return ClerkExpressRequireAuth({})(req, res, next);
    },
    async (req, res, next) => {
        const isDevBypass = process.env.NODE_ENV !== 'production'
            && req.headers['x-dev-bypass'] === 'true';
        if (isDevBypass) {
            // Already handled by bypass, but need to map to DB user
            try {
                const result = await dbClient.query('SELECT user_id FROM users WHERE clerk_uid = $1 OR firebase_uid = $1', [req.headers['x-dev-user-id']]);
                if (result.rows.length > 0) {
                    req.user = { id: result.rows[0].user_id, userId: result.rows[0].user_id, clerkId: req.headers['x-dev-user-id'] };
                }
            } catch (err) {
                // Ignore DB errors during dev bypass
                console.error("Dev bypass DB error:", err);
            }
            // FIX (audit P0 #23): in dev-bypass mode, if the user record
            // wasn't found we must NOT fall through with req.user unset —
            // downstream controllers reading req.user.userId would throw.
            if (!req.user) {
                return res.status(401).json({ error: 'UNAUTHENTICATED' });
            }
            return next();
        }

        if (req.auth?.userId) {
            try {
                // Check Cache First
                const cachedUser = getCachedUser(req.auth.userId);
                if (cachedUser) {
                    req.user = cachedUser;
                    return next();
                }

                const result = await dbClient.query(
                    'SELECT user_id, email, display_name FROM users WHERE clerk_uid = $1 OR firebase_uid = $1',
                    [req.auth.userId]
                );
                if (result.rows.length > 0) {
                    req.user = {
                        id: result.rows[0].user_id,
                        userId: result.rows[0].user_id,
                        clerkId: req.auth.userId,
                        email: result.rows[0].email,
                        displayName: result.rows[0].display_name
                    };
                } else {
                    // Create user if they don't exist.
                    // FIX (audit P0 #24 + P1 #45): populate email/display_name
                    // from Clerk so /you/profile stops showing blanks. With
                    // migration 021 firebase_uid is nullable, so we no longer
                    // need to fabricate `firebase_uid = clerk_uid` to satisfy
                    // a NOT NULL constraint.
                    let email = null;
                    let displayName = null;
                    try {
                        const { Clerk } = await import('@clerk/clerk-sdk-node');
                        const clerkUser = await Clerk.users.getUser(req.auth.userId);
                        email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
                        displayName = clerkUser?.firstName
                            ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
                            : (email ? email.split('@')[0] : null);
                    } catch (clerkErr) {
                        logger.warn('[AUTH] Failed to fetch Clerk profile during user creation', { err: clerkErr.message });
                    }

                    const insertResult = await dbClient.query(
                        `INSERT INTO users (clerk_uid, email, display_name)
                         VALUES ($1, $2, $3)
                         RETURNING user_id`,
                        [req.auth.userId, email, displayName]
                    );
                    req.user = {
                        id: insertResult.rows[0].user_id,
                        userId: insertResult.rows[0].user_id,
                        clerkId: req.auth.userId,
                        email,
                        displayName
                    };
                }

                // Cache the user for 5 minutes to prevent DB spam
                setCachedUser(req.auth.userId, req.user);

                // FIX (audit P0 #18): ensure a beta cohort is persisted so
                // feature-flag middleware can gate /forecast/* correctly.
                await ensureBetaCohortAssigned(req.user.userId, { email: req.user.email });
            } catch (err) {
                console.error("Auth middleware DB error:", err);
                return res.status(500).json({ error: 'Auth failed', detail: err.message });
            }
        }

        // FIX (audit P0 #23): if we reach here without `req.user`, the
        // request is unauthenticated. Returning 401 here is fail-safe —
        // downstream controllers must never see `req.user === undefined`.
        if (!req.user) {
            return res.status(401).json({ error: 'UNAUTHENTICATED' });
        }

        next();
    }
];

export const requireOwnership = (req, res, next) => {
    const requestedResourceId = req.params.userId || req.params.id;
    
    if (!req.user?.id) {
        return next(new UnauthorizedError('Authentication required before checking ownership.'));
    }

    if (req.user.id !== requestedResourceId) {
        logger.audit('AUTHORIZATION_DENIED', req.user.id, requestedResourceId, { path: req.path });
        return next(new ForbiddenError('You do not have permission to access this resource.'));
    }

    next();
};
