import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

/**
 * Global Error Handler Middleware
 * 
 * Safely handles errors without leaking stack traces or DB internals.
 */
export const globalErrorHandler = (err, req, res, _next) => {
    const traceId = req.headers['x-trace-id'] || req.traceId || 'unknown-trace';
    
    // Determine if it's our known AppError
    if (err instanceof AppError) {
        logger.error(`[AppError] ${err.code}: ${err.message}`, err, { path: req.path, trace_id: traceId });
        return res.status(err.statusCode).json({
            error: err.code,
            message: err.message,
            trace_id: traceId
        });
    }

    // Provider / External Errors
    if (err.name === 'ProviderError' || err.code === 'PROVIDER_TIMEOUT') {
        logger.error(`[ProviderError] External dependency failure: ${err.message}`, err, { path: req.path, trace_id: traceId });
        return res.status(503).json({
            error: 'SERVICE_UNAVAILABLE',
            message: 'A downstream service is currently unavailable. Core functions remain active.',
            trace_id: traceId
        });
    }

    // Unhandled/Unexpected Errors (e.g., syntax errors, DB crashes)
    logger.error(`[UnhandledError] ${err.message}`, err, { path: req.path, trace_id: traceId });
    
    // Never leak stack traces to the client in production
    return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
        trace_id: traceId
    });
};
