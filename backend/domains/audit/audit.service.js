import { logger } from '../../utils/logger.js';

/**
 * Audit Foundation Service
 * 
 * Creates structured, immutable audit records for all critical actions.
 */
export class AuditService {
    constructor(dbClient) {
        this.dbClient = dbClient;
        if (!this.dbClient) {
            throw new Error('AuditService requires a real DB client instance.');
        }
    }

    /**
     * Logs a critical security or domain event.
     */
    async logEvent(action, userId, resource, metadata = {}) {
        // Local logging
        logger.audit(action, userId, resource, metadata);

        // Truthful DB Insertion
        // Assumes an `audit_logs` table exists (will be created in a future migration)
        try {
            await this.dbClient.query(
                `INSERT INTO audit_logs (action, user_id, resource, metadata) 
                 VALUES ($1, $2, $3, $4)`,
                [action, userId, resource, JSON.stringify(metadata)]
            );
        } catch (error) {
            // Audit log failure is critical. We do not swallow this error.
            logger.error('Failed to persist audit log to DB.', error);
            throw new Error('Audit logging failed.');
        }
    }
}
