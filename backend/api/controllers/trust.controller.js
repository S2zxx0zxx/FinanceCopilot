import { dbClient } from '../../db/client.js';
import { PrivacyPolicies, getActivePolicyVersion } from '../../config/policies.js';

export class TrustController {
    static async getConnections(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('SELECT * FROM user_connections WHERE user_id = $1', [req.user.userId]);
            res.json({ connections: rows });
        } catch (err) { next(err); }
    }

    static async disconnectConnection(req, res, next) {
        try {
            const db = dbClient;
            await db.query('UPDATE user_connections SET status = $1 WHERE id = $2 AND user_id = $3', ['DISCONNECTED', req.params.id, req.user.userId]);
            res.json({ success: true, message: 'Disconnected successfully.' });
        } catch (err) { next(err); }
    }

    static async getPrivacyInventory(req, res, next) {
        try {
            const db = dbClient;
            const inventory = Object.values(PrivacyPolicies);
            const { rows: consentOptions } = await db.query('SELECT consent_type as policy_id, consented as granted FROM consent_records WHERE user_id = $1', [req.user.userId]);
            res.json({ inventory, consentOptions });
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
            const db = dbClient;
            const { rows } = await db.query('SELECT * FROM user_sessions WHERE user_id = $1', [req.user.userId]);
            res.json({ sessions: rows });
        } catch (err) { next(err); }
    }

    static async revokeSecuritySession(req, res, next) {
        try {
            const db = dbClient;
            let result;
            if (req.body.allOther) {
                result = await db.query('DELETE FROM user_sessions WHERE user_id = $1 AND id != $2', [req.user.userId, req.headers['x-session-id']]);
            } else {
                result = await db.query('DELETE FROM user_sessions WHERE user_id = $1 AND id = $2', [req.user.userId, req.body.id]);
            }
            res.json({ status: result.rowCount > 0 ? 'REVOKED' : 'NOT_FOUND', count: result.rowCount });
        } catch (err) { next(err); }
    }

    static async requestExport(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('INSERT INTO export_jobs (user_id, status) VALUES ($1, $2) RETURNING id', [req.user.userId, 'PROCESSING']);
            res.json({ status: 'PROCESSING', jobId: rows[0].id });
        } catch (err) { next(err); }
    }

    static async getExportStatus(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('SELECT status, download_url, generated_at FROM export_jobs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.userId]);
            if (rows.length === 0) return res.json({ status: 'NOT_FOUND' });
            res.json({ status: rows[0].status, generatedAt: rows[0].generated_at, downloadUrl: rows[0].download_url });
        } catch (err) { next(err); }
    }

    static async _internalUpdateExportStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014)
        try {
            const db = dbClient;
            const { jobId, status, downloadUrl } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            
            await db.query(
                'UPDATE export_jobs SET status = $1, download_url = $2, generated_at = CASE WHEN $1 = \'COMPLETED\' THEN NOW() ELSE generated_at END WHERE id = $3',
                [status, downloadUrl || null, jobId]
            );
            res.json({ success: true, status });
        } catch (err) { next(err); }
    }

    static async requestDeletion(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('INSERT INTO deletion_jobs (user_id, status) VALUES ($1, $2) RETURNING id', [req.user.userId, 'PROCESSING']);
            res.json({ status: 'PROCESSING', jobId: rows[0].id });
        } catch (err) { next(err); }
    }

    static async getDeletionStatus(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('SELECT status FROM deletion_jobs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.userId]);
            if (rows.length === 0) return res.json({ status: 'NOT_FOUND' });
            res.json({ status: rows[0].status });
        } catch (err) { next(err); }
    }

    static async _internalUpdateDeletionStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014)
        try {
            const db = dbClient;
            const { jobId, status } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            
            await db.query('UPDATE deletion_jobs SET status = $1 WHERE id = $2', [status, jobId]);
            res.json({ success: true, status });
        } catch (err) { next(err); }
    }

    static async getPreferences(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('SELECT currency, month_start, ai_tone FROM user_preferences WHERE user_id = $1', [req.user.userId]);
            res.json(rows[0] || {});
        } catch (err) { next(err); }
    }

    static async updatePreferences(req, res, next) {
        try {
            const db = dbClient;
            const prefs = req.body;
            const { rows } = await db.query(
                'INSERT INTO user_preferences (user_id, currency, month_start, ai_tone) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET currency = COALESCE($2, user_preferences.currency), month_start = COALESCE($3, user_preferences.month_start), ai_tone = COALESCE($4, user_preferences.ai_tone) RETURNING *',
                [req.user.userId, prefs.currency, prefs.month_start ?? prefs.monthStart, prefs.ai_tone ?? prefs.aiTone]
            );
            res.json({ status: 'UPDATED', preferences: rows[0] });
        } catch (err) { next(err); }
    }

    static async getNotificationPreferences(req, res, next) {
        try {
            const db = dbClient;
            const { rows } = await db.query('SELECT * FROM notification_preferences WHERE user_id = $1', [req.user.userId]);
            res.json({ preferences: rows });
        } catch (err) { next(err); }
    }

    static async updateNotificationPreferences(req, res, next) {
        try {
            const db = dbClient;
            const { id, enabled } = req.body;
            const { rowCount } = await db.query(
                'INSERT INTO notification_preferences (user_id, pref_id, enabled) VALUES ($1, $2, $3) ON CONFLICT (user_id, pref_id) DO UPDATE SET enabled = $3',
                [req.user.userId, id, enabled]
            );
            res.json({ status: 'UPDATED', policy: id, enabled, updated: rowCount > 0 });
        } catch (err) { next(err); }
    }
}
