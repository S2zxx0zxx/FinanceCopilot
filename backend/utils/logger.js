/**
 * Structured Logger (Phase 12 Hardened)
 * 
 * Ensures logs are strictly formatted, sensitive data is not leaked,
 * and request/trace correlation is maintained.
 */
import crypto from 'crypto';

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'authorization'];

function redact(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const redacted = { ...obj };
    for (const key in redacted) {
        if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
            redacted[key] = '[REDACTED]';
        } else if (typeof redacted[key] === 'object') {
            redacted[key] = redact(redacted[key]);
        }
    }
    return redacted;
}

export const logger = {
    info: (message, context = {}) => {
        console.log(JSON.stringify({
            level: 'INFO',
            timestamp: new Date().toISOString(),
            message,
            trace_id: context.trace_id || crypto.randomUUID(),
            ...redact(context)
        }));
    },
    error: (message, error, context = {}) => {
        console.error(JSON.stringify({
            level: 'ERROR',
            timestamp: new Date().toISOString(),
            message,
            error_class: error?.name || 'Error',
            error: error?.message || error,
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
            trace_id: context.trace_id || crypto.randomUUID(),
            ...redact(context)
        }));
    },
    warn: (message, context = {}) => {
        console.warn(JSON.stringify({
            level: 'WARN',
            timestamp: new Date().toISOString(),
            message,
            trace_id: context.trace_id || crypto.randomUUID(),
            ...redact(context)
        }));
    },
    // Audit logs strictly for security/financial events
    audit: (action, userId, resource, context = {}) => {
        console.log(JSON.stringify({
            level: 'AUDIT',
            timestamp: new Date().toISOString(),
            action,
            userId,
            resource,
            trace_id: context.trace_id || crypto.randomUUID(),
            ...redact(context)
        }));
    }
};
