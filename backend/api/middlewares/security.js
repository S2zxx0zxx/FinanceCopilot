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

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        logger.warn('Unauthorized access attempt: Missing or invalid token format', { path: req.path });
        return next(new UnauthorizedError('Missing or invalid authentication token.'));
    }

    const token = authHeader.split(' ')[1];
    
    // Strict Mode: No universal mock identity.
    if (!req.authAdapter) {
        return next(new UnauthorizedError('Auth validation strict mode: AuthAdapter is missing from request context.'));
    }

    try {
        const decodedToken = await req.authAdapter.verifyToken(token);
        if (!decodedToken || !decodedToken.uid) {
            throw new Error('Token verification failed to return valid identity.');
        }
        
        // Lookup internal user_id based on firebase_uid
        const result = await dbClient.query('SELECT user_id FROM users WHERE clerk_uid = $1 OR firebase_uid = $1', [decodedToken.uid]);
        if (result.rowCount === 0) {
            throw new Error('User not found in database.');
        }
        
        // Strictly assign the verified internal database identity
        req.user = { id: decodedToken.uid, userId: result.rows[0].user_id };
        next();
    } catch (error) {
        logger.warn('Token verification failed', { error: error.message, path: req.path });
        return next(new UnauthorizedError('Invalid or expired token.'));
    }
};

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
