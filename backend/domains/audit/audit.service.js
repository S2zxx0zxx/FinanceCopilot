import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';

/**
 * Audit Foundation Service
 *
 * Creates structured, immutable audit records for all critical actions.
 *
 * FIX (audit P1 #46): the old code inserted into a fictional `audit_logs`
 * table with columns `(action, user_id, resource, metadata)`. That table
 * NEVER EXISTED — the real schema (migration 004_consent_audit_schema.sql)
 * defines `audit_events` with columns:
 *   - id            SERIAL PK
 *   - timestamp     TIMESTAMPTZ DEFAULT NOW()
 *   - event_type    VARCHAR(100)  ← was `action`
 *   - entity_type   VARCHAR(100)  ← was `resource`
 *   - entity_id     VARCHAR(255)
 *   - actor         VARCHAR(100)  ← was `user_id`
 *   - metadata      JSONB
 *
 * Every previous call threw on the INSERT and rethrew "Audit logging
 * failed", masking the real schema mismatch. We now map the AuditService
 * domain vocabulary (action/userId/resource) to the canonical column
 * names (event_type/actor/entity_type) so a row is actually persisted.
 *
 * This service is the higher-level domain wrapper around `AuditRepo`
 * (db/repositories.js) which exposes a thin `logEvent()` that the rest
 * of the codebase already calls directly. AuditService is kept for
 * older call sites that still go through the service abstraction.
 */
export class AuditService {
    constructor(dbClient) {
        if (!dbClient) {
            throw new Error('AuditService requires a real DB client instance.');
        }
        this.dbClient = dbClient;
    }

    /**
     * Logs a critical security or domain event to the canonical audit_events table.
     *
     * @param {string} action      Domain event type (e.g. 'consent_change', 'EXPORT_REQUESTED')
     * @param {string} userId      The actor performing the action (user_id or 'system')
     * @param {string} resource    The entity type being acted upon (e.g. 'consent', 'user')
     * @param {object} metadata    Arbitrary structured payload (JSONB-safe)
     */
    async logEvent(action, userId, resource, metadata = {}) {
        // Local structured logging (console / observability stack)
        logger.audit(action, userId, resource, metadata);

        // Truthful DB insertion into the real audit_events table (migration 004).
        try {
            await this.dbClient.query(
                `INSERT INTO audit_events (event_type, entity_type, entity_id, actor, metadata)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    action,                                  // event_type
                    resource,                                // entity_type
                    metadata?.entity_id || null,             // entity_id (best-effort)
                    String(userId ?? 'system'),              // actor — never null
                    JSON.stringify(metadata || {})
                ]
            );
        } catch (error) {
            // Audit log failure is critical. We do not swallow this error.
            logger.error('Failed to persist audit log to DB.', error);
            throw new AppError('Audit logging failed.', 500, true, 'AUDIT_LOG_FAILED');
        }
    }
}
