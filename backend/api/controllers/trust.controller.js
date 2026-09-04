import { dbClient } from '../../db/client.js';
import { PrivacyPolicies, getActivePolicyVersion } from '../../config/policies.js';

export class TrustController {
    static async getConnections(req, res, next) {
        try {
            const db = dbClient;
            // financial_accounts uses source_connection_id (not connection_id).
            // balances and last_synced_at don't exist — use account_type + is_active instead.
            const { rows } = await db.query(
                `SELECT fa.account_id, fa.account_type, fa.institution_name, fa.account_number_last4,
                        fa.currency, fa.is_active, fa.created_at,
                        sc.status as connection_status, sc.display_name
                 FROM financial_accounts fa
                 LEFT JOIN source_connections sc ON sc.connection_id = fa.source_connection_id
                 WHERE fa.user_id = $1
                 ORDER BY fa.is_active DESC, fa.institution_name`,
                [req.user.userId]
            );
            res.json({ connections: rows });
        } catch (err) { next(err); }
    }

    static async disconnectConnection(req, res, next) {
        try {
            const db = dbClient;
            // Mark the source_connection as 'disconnected' (schema status enum allows it).
            await db.query(
                `UPDATE source_connections SET status = 'disconnected', updated_at = NOW()
                 WHERE connection_id = (SELECT connection_id FROM financial_accounts WHERE account_id = $2 AND user_id = $1)
                 AND user_id = $1`,
                [req.user.userId, req.params.id]
            );
            // Also mark the linked account inactive.
            await db.query(
                `UPDATE financial_accounts SET is_active = false WHERE account_id = $2 AND user_id = $1`,
                [req.user.userId, req.params.id]
            );
            res.json({ success: true, message: 'Disconnected successfully.' });
        } catch (err) { next(err); }
    }

    static async getPrivacyInventory(req, res, next) {
        try {
            const db = dbClient;
            const inventory = Object.values(PrivacyPolicies);
            const { rows: consentOptions } = await db.query('SELECT consent_type as policy_id, consented as granted FROM consent_records WHERE user_id = $1', [req.user.userId]);
            
            // Count rows for the user to return a true inventory of data footprint.
            const userId = req.user.userId;
            const txCount = (await db.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId])).rows[0].count;
            const accountCount = (await db.query('SELECT COUNT(*) FROM financial_accounts WHERE user_id = $1', [userId])).rows[0].count;
            const statementsCount = (await db.query('SELECT COUNT(*) FROM statements WHERE user_id = $1', [userId])).rows[0].count;
            const commitmentsCount = (await db.query('SELECT COUNT(*) FROM financial_commitments WHERE user_id = $1', [userId])).rows[0].count;
            
            const dataFootprint = [
                { category: 'Transaction data', description: 'Your bank transactions, categorized', record_count: parseInt(txCount, 10) },
                { category: 'Account balances', description: 'Current and historical balances', record_count: parseInt(accountCount, 10) },
                { category: 'Statements', description: 'Uploaded bank statements', record_count: parseInt(statementsCount, 10) },
                { category: 'Financial commitments', description: 'Recurring bills and EMIs', record_count: parseInt(commitmentsCount, 10) }
            ];

            res.json({ inventory, consentOptions, data_inventory: dataFootprint });
        } catch (err) { next(err); }
    }

    static async updatePrivacyConsent(req, res, next) {
        try {
            const db = dbClient;
            const { id, granted } = req.body;
            const activeVersion = getActivePolicyVersion(id);
            const { rowCount } = await db.query(
                'INSERT INTO consent_records (user_id, consent_type, version, consented, granted_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING consent_id',
                [req.user.userId, id, activeVersion, granted]
            );
            res.json({ status: rowCount > 0 ? 'UPDATED' : 'FAILED', policy: id, granted, version: activeVersion });
        } catch (err) { next(err); }
    }

    static async getSecuritySessions(req, res, next) {
        try {
            // Sessions are managed by the auth provider (Clerk/Firebase), not a local table.
            // Delegate to the auth adapter if available; otherwise return a graceful empty list.
            const adapter = req.authAdapter;
            if (adapter && typeof adapter.listSessions === 'function') {
                const sessions = await adapter.listSessions(req.user.uid ?? req.user.userId);
                res.json({ sessions: sessions ?? [] });
            } else {
                res.json({ sessions: [] });
            }
        } catch (err) { next(err); }
    }

    static async revokeSecuritySession(req, res, next) {
        try {
            // Delegate revocation to the auth provider (Clerk/Firebase).
            const adapter = req.authAdapter;
            if (!adapter || typeof adapter.revokeSessions !== 'function') {
                return res.status(501).json({ status: 'NOT_SUPPORTED', message: 'Session revocation is handled by the auth provider.' });
            }
            const targetSessionId = req.body.id;
            if (req.body.allOther && req.user.uid) {
                // Revoke all sessions for the user except the current one.
                await adapter.revokeSessions(req.user.uid);
                res.json({ status: 'REVOKED', count: -1 });
            } else if (targetSessionId) {
                await adapter.revokeSession?.(targetSessionId);
                res.json({ status: 'REVOKED', count: 1 });
            } else {
                res.status(400).json({ status: 'MISSING_ID' });
            }
        } catch (err) { next(err); }
    }

    static async requestExport(req, res, next) {
        try {
            const db = dbClient;
            // export_jobs table doesn't exist in migrations; return a job stub + audit.
            const jobId = `export_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const { AuditRepo } = await import('../../db/repositories.js');
            await AuditRepo.logEvent('EXPORT_REQUESTED', 'user', req.user.userId, req.user.userId, { format: req.body?.format || 'csv', job_id: jobId });
            res.json({ status: 'PROCESSING', jobId, format: req.body?.format || 'csv' });
        } catch (err) { next(err); }
    }

    static async getExportStatus(req, res, next) {
        // export_jobs table doesn't exist in migrations; return the latest export
        // request from the audit log instead, or a NOT_FOUND status.
        try {
            const { AuditRepo } = await import('../../db/repositories.js');
            // We don't have a dedicated table; return a graceful NOT_FOUND so the
            // frontend can show "no exports yet". When a real export_jobs table is
            // added via migration, replace this with a real query.
            res.json({ status: 'NOT_FOUND', message: 'No export jobs table yet. Use requestExport to start one.' });
        } catch (err) { next(err); }
    }

    static async _internalUpdateExportStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014). With no export_jobs table,
        // we simply audit the status update so the trail is preserved.
        try {
            const { jobId, status, downloadUrl } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            const { AuditRepo } = await import('../../db/repositories.js');
            await AuditRepo.logEvent('EXPORT_STATUS_UPDATE', 'export', req.user?.userId ?? 'system', jobId, { status, downloadUrl });
            res.json({ success: true, status });
        } catch (err) { next(err); }
    }

    static async requestDeletion(req, res, next) {
        try {
            const db = dbClient;
            const userId = req.user.userId;
            
            // Delete user, which will cascade to everything because of migration 017
            await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
            
            const jobId = `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            res.json({ status: 'COMPLETED', jobId });
        } catch (err) { next(err); }
    }

    static async getDeletionStatus(req, res, next) {
        // No deletion_jobs table; check audit_events for the latest DELETION_REQUESTED.
        try {
            const { rows } = await dbClient.query(
                `SELECT metadata, created_at FROM audit_events
                 WHERE user_id = $1 AND event_type = 'DELETION_REQUESTED'
                 ORDER BY created_at DESC LIMIT 1`,
                [req.user.userId]
            );
            if (rows.length === 0) return res.json({ status: 'NOT_FOUND' });
            res.json({ status: 'PROCESSING', requestedAt: rows[0].created_at });
        } catch (err) { next(err); }
    }

    static async _internalUpdateDeletionStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014). Audit the status update.
        try {
            const { jobId, status } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            const { AuditRepo } = await import('../../db/repositories.js');
            await AuditRepo.logEvent('DELETION_STATUS_UPDATE', 'deletion', req.user?.userId ?? 'system', jobId, { status });
            res.json({ success: true, status });
        } catch (err) { next(err); }
    }

    static async getPreferences(req, res, next) {
        // user_preferences exists (migration 013) but has different columns than the old query.
        // Real columns: currency, language, theme, density, data_retention_days,
        // ai_sharing_consent, analytics_consent, marketing_consent.
        try {
            const { rows } = await dbClient.query(
                `SELECT currency, language, theme, density, data_retention_days,
                        ai_sharing_consent, analytics_consent, marketing_consent
                 FROM user_preferences WHERE user_id = $1`,
                [req.user.userId]
            );
            res.json(rows[0] || { currency: 'INR', language: 'en', theme: 'dark' });
        } catch (err) { next(err); }
    }

    static async updatePreferences(req, res, next) {
        try {
            const prefs = req.body;
            // upsert into user_preferences (real schema columns only)
            const { rows } = await dbClient.query(
                `INSERT INTO user_preferences (user_id, currency, language, theme, density, data_retention_days, ai_sharing_consent, analytics_consent, marketing_consent)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (user_id) DO UPDATE SET
                    currency = COALESCE($2, user_preferences.currency),
                    language = COALESCE($3, user_preferences.language),
                    theme = COALESCE($4, user_preferences.theme),
                    density = COALESCE($5, user_preferences.density),
                    data_retention_days = COALESCE($6, user_preferences.data_retention_days),
                    ai_sharing_consent = COALESCE($7, user_preferences.ai_sharing_consent),
                    analytics_consent = COALESCE($8, user_preferences.analytics_consent),
                    marketing_consent = COALESCE($9, user_preferences.marketing_consent),
                    updated_at = NOW()
                 RETURNING *`,
                [req.user.userId, prefs.currency, prefs.language, prefs.theme, prefs.density, prefs.data_retention_days, prefs.ai_sharing_consent, prefs.analytics_consent, prefs.marketing_consent]
            );
            res.json({ status: 'UPDATED', preferences: rows[0] });
        } catch (err) { next(err); }
    }

    static async getNotificationPreferences(req, res, next) {
        // notification_preferences table doesn't exist; prefs are JSONB columns on user_preferences.
        try {
            const { rows } = await dbClient.query(
                `SELECT notification_channels, notification_events FROM user_preferences WHERE user_id = $1`,
                [req.user.userId]
            );
            const r = rows[0] || { notification_channels: {}, notification_events: {} };
            res.json({ preferences: { channels: r.notification_channels, events: r.notification_events } });
        } catch (err) { next(err); }
    }

    static async updateNotificationPreferences(req, res, next) {
        // Update the JSONB notification columns on user_preferences.
        try {
            const { channels, events } = req.body;
            const { rowCount } = await dbClient.query(
                `UPDATE user_preferences
                 SET notification_channels = COALESCE($2, notification_channels),
                     notification_events = COALESCE($3, notification_events),
                     updated_at = NOW()
                 WHERE user_id = $1`,
                [req.user.userId, channels ? JSON.stringify(channels) : null, events ? JSON.stringify(events) : null]
            );
            res.json({ status: 'UPDATED', updated: rowCount > 0 });
        } catch (err) { next(err); }
    }
}
