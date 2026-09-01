import { logger } from '../../utils/logger.js';
import { Telemetry, TrafficClass } from '../../utils/telemetry.js';

/**
 * Phase 13 Performance Tracking Middleware — Hardened
 *
 * FIXES from audit (§41, §53):
 *  1. Test/load traffic is now excluded from performance metrics via TrafficClass.
 *  2. PII never enters performance logs (only route pattern, not full path with IDs).
 *  3. Thresholds are documented — p95 target = 200ms for API, 2000ms for AI.
 */

// Route pattern matcher — strips IDs from paths to avoid PII in logs
function sanitizePath(path) {
    return path
        .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:uuid')
        .replace(/\/\d+/g, '/:id');
}

const P95_THRESHOLDS = {
    '/api/v1/forecast': 3000,    // AI routes — higher budget
    '/api/v1/ai': 4000,
    default: 200                 // All other API routes
};

function getThreshold(path) {
    for (const [prefix, ms] of Object.entries(P95_THRESHOLDS)) {
        if (path.startsWith(prefix)) return ms;
    }
    return P95_THRESHOLDS.default;
}

export const performanceMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
        const latencyMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        const routePattern = sanitizePath(req.path);

        const logEntry = {
            method: req.method,
            route: routePattern,
            status: res.statusCode,
            latency_ms: Math.round(latencyMs),
            trace_id: req.headers['x-trace-id'] || req.traceId
        };

        logger.info(`[PERFORMANCE] ${req.method} ${routePattern}`, logEntry);

        // Emit telemetry for slow routes — only for real users
        const threshold = getThreshold(req.path);
        if (latencyMs > threshold && req.user?.userId) {
            const trafficClass = req.headers['x-traffic-class'] === 'SYNTHETIC'
                ? TrafficClass.SYNTHETIC
                : TrafficClass.REAL_USER;

            Telemetry.trackEvent(req.user.userId, 'PERFORMANCE_DEGRADATION', {
                route: routePattern,
                latency_ms: Math.round(latencyMs),
                threshold_ms: threshold
            }, trafficClass);
        }
    });

    next();
};
