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
    ClerkExpressRequireAuth({}),
    async (req, res, next) => {
        if (req.auth && req.auth.userId) {
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
                        'INSERT INTO users (clerk_uid, firebase_uid) VALUES ($1, $1) RETURNING user_id',
                        [req.auth.userId]
                    );
                    req.user = { id: insertResult.rows[0].user_id, userId: insertResult.rows[0].user_id, clerkId: req.auth.userId };
                }
            } catch (err) {
                console.error("Auth middleware DB error:", err);
                return res.status(500).json({ error: 'Auth failed' });
            }
        }
        next();
    }
];

export const requireOwnership = (req, res, next) => {
    const requestedResourceId = req.params.userId || req.params.id;
    
    if (!req.user || !req.user.id) {
        return next(new UnauthorizedError('Authentication required before checking ownership.'));
    }

    if (req.user.id !== requestedResourceId) {
        logger.audit('AUTHORIZATION_DENIED', req.user.id, requestedResourceId, { path: req.path });
        return next(new ForbiddenError('You do not have permission to access this resource.'));
    }

    next();
};
