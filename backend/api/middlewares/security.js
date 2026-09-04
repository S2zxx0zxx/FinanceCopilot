import rateLimit from 'express-rate-limit';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import { dbClient } from '../../db/client.js';

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

export const requireAuth = [
    (req, res, next) => {
        // Dev bypass — ONLY allowed in non-production environments.
        // In production this header is completely ignored.
        const isDevBypass = process.env.NODE_ENV !== 'production'
            && req.headers['x-dev-bypass'] === 'true'
            && req.headers['x-dev-user-id'];
        if (isDevBypass) {
            req.user = { id: 1, userId: 1, clerkId: req.headers['x-dev-user-id'] };
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
            return next();
        }
        
        if (req.auth?.userId) {
            try {
                const result = await dbClient.query(
                    'SELECT user_id FROM users WHERE clerk_uid = $1 OR firebase_uid = $1',
                    [req.auth.userId]
                );
                if (result.rows.length > 0) {
                    req.user = { id: result.rows[0].user_id, userId: result.rows[0].user_id, clerkId: req.auth.userId };
                } else {
                    // Create user if they don't exist
                    const insertResult = await dbClient.query(
                        'INSERT INTO users (clerk_uid, firebase_uid) VALUES ($1, $2) RETURNING user_id',
                        [req.auth.userId, req.auth.userId]
                    );
                    req.user = { id: insertResult.rows[0].user_id, userId: insertResult.rows[0].user_id, clerkId: req.auth.userId };
                }
            } catch (err) {
                console.error("Auth middleware DB error:", err);
                return res.status(500).json({ error: 'Auth failed', detail: err.message });
            }
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
