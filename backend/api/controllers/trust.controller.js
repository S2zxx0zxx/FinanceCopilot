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
            // FIX (audit P0 #5): financial_accounts has NO `connection_id` column —
            // the FK to source_connections is `source_connection_id`. The old
            // sub-query silently returned NULL and disconnected nothing.
            await db.query(
                `UPDATE source_connections SET status = 'disconnected', updated_at = NOW()
                 WHERE connection_id = (
                     SELECT source_connection_id FROM financial_accounts
                     WHERE account_id = $2 AND user_id = $1
                 )
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
            const { rows: consentOptions } = await db.query("SELECT DISTINCT ON (consent_type) consent_type as policy_id, (consented AND revoked_at IS NULL AND status = 'active') as granted FROM consent_records WHERE user_id = $1 ORDER BY consent_type, granted_at DESC, consent_id DESC", [req.user.userId]);
            
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

            const { rows: consentHistory } = await db.query(
                `SELECT consent_id, consent_type, version, consented, status, granted_at, revoked_at
                 FROM consent_records WHERE user_id = $1
                 ORDER BY granted_at DESC, consent_id DESC LIMIT 50`, [userId]
            );
            res.json({ inventory, consentOptions, data_inventory: dataFootprint, consent_history: consentHistory });
        } catch (err) { next(err); }
    }

    static async updatePrivacyConsent(req, res, next) {
        try {
            const db = dbClient;
            const { id, granted } = req.body;
            if (typeof granted !== 'boolean' || !Object.hasOwn(PrivacyPolicies,id)) return res.status(422).json({error:'Invalid privacy choice.'});
            const activeVersion = getActivePolicyVersion(id);
            const { rowCount } = await db.query(
                "INSERT INTO consent_records (user_id, consent_type, version, consented, granted_at, status) VALUES ($1, $2, $3, $4, NOW(), CASE WHEN $4 THEN 'active' ELSE 'revoked' END) RETURNING consent_id",
                [req.user.userId, id, activeVersion, granted]
            );
            const updated = rowCount > 0;
            // FIX (audit P1 #33): don't lie with a 200 'FAILED'. Surface real failure.
            if (!updated) {
                return res.status(500).json({ status: 'FAILED', policy: id, granted, version: activeVersion });
            }
            res.json({ status: 'UPDATED', policy: id, granted, version: activeVersion });
        } catch (err) { next(err); }
    }

    static async getSecuritySessions(req, res, next) {
        try {
            // Sessions are managed by the auth provider (Clerk/Firebase), not a local table.
            // Delegate to the auth adapter if available; otherwise return a graceful empty list.
            const adapter = req.authAdapter;
            if (adapter && typeof adapter.listSessions === 'function') {
                const sessions = await adapter.listSessions(req.user.clerkId);
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
            if (!adapter || typeof adapter.listSessions !== 'function' || typeof adapter.revokeSession !== 'function') {
                return res.status(501).json({ status: 'NOT_SUPPORTED', message: 'Session revocation is handled by the auth provider.' });
            }
            const targetSessionId = req.body.id;
            // FIX (audit P0 #25): req.user has no `uid` — the security middleware
            // attaches { id, userId, clerkId }. Use userId for the DB user and
            // clerkId for the auth-provider identity.
            const providerUid = req.user?.clerkId;
            if (!providerUid) return res.status(401).json({ error: 'UNAUTHENTICATED' });
            const ownedSessions = await adapter.listSessions(providerUid);
            if (req.body.allOther && providerUid) {
                // Revoke all sessions for the user except the current one.
                const currentId = req.auth?.sessionId;
                if (!currentId) return res.status(400).json({ error: 'CURRENT_SESSION_REQUIRED' });
                const targets = ownedSessions.filter(session => session.id !== currentId && session.status === 'active');
                for (const session of targets) await adapter.revokeSession(session.id);
                res.json({ status: 'REVOKED', count: targets.length });
            } else if (targetSessionId) {
                if (!ownedSessions.some(session => session.id === targetSessionId)) return res.status(404).json({ error: 'SESSION_NOT_FOUND' });
                if (typeof adapter.revokeSession === 'function') {
                    await adapter.revokeSession(targetSessionId);
                }
                res.json({ status: 'REVOKED', count: 1 });
            } else {
                res.status(400).json({ status: 'MISSING_ID' });
            }
        } catch (err) { next(err); }
    }

    static async requestExport(req, res, next) {
        const requestedFormat=req.body?.format ?? 'csv';
        if(typeof requestedFormat!=='string'||!['csv','json','pdf'].includes(requestedFormat.toLowerCase()))return res.status(422).json({error:'Choose csv, json or pdf.'});
        const format=requestedFormat.toLowerCase();let client;
        try {
            client=await dbClient.connect();await client.query('BEGIN');
            await client.query('SELECT user_id FROM users WHERE user_id=$1 FOR UPDATE',[req.user.userId]);
            const active=await client.query("SELECT job_id FROM export_jobs WHERE user_id=$1 AND status='PROCESSING' LIMIT 1",[req.user.userId]);
            if(active.rows.length){await client.query('ROLLBACK');return res.status(409).json({error:'An export is already processing. Refresh its status before requesting another.'});}
            const recent=await client.query("SELECT COUNT(*)::int AS count FROM export_jobs WHERE user_id=$1 AND created_at>NOW()-INTERVAL '1 hour'",[req.user.userId]);
            if(recent.rows[0].count>=5){await client.query('ROLLBACK');return res.status(429).json({error:'Up to five exports can be requested each hour.'});}
            const result=await client.query("INSERT INTO export_jobs(user_id,status,format) VALUES($1,'PROCESSING',$2) RETURNING job_id",[req.user.userId,format]);
            const jobId=result.rows[0].job_id;
            await client.query("INSERT INTO audit_events(event_type,entity_type,entity_id,actor,metadata) VALUES('EXPORT_REQUESTED','user',$1,$1,$2)",[req.user.userId,{format,job_id:jobId}]);
            await client.query('COMMIT');return res.status(202).json({status:'PROCESSING',jobId,format});
        }catch(error){if(client)await client.query('ROLLBACK');next(error);}finally{client?.release();}
    }

    static async downloadExport(req,res,next){
        try {
            const result=await dbClient.query(`SELECT a.content,a.mime_type,j.format FROM export_jobs j
                JOIN export_artifacts a ON a.job_id=j.job_id WHERE j.job_id=$1 AND j.user_id=$2
                AND j.status='COMPLETED' AND j.expires_at>NOW()`,[req.params.id,req.user.userId]);
            if(!result.rows.length)return res.status(404).json({error:'Export is unavailable or expired. Request a new export.'});
            const artifact=result.rows[0];
            res.setHeader('Cache-Control','private, no-store');
            res.setHeader('X-Content-Type-Options','nosniff');
            res.setHeader('Content-Type',artifact.mime_type);
            res.setHeader('Content-Disposition',`attachment; filename="FinanceCopilot-export.${['csv','json','pdf'].includes(artifact.format)?artifact.format:'bin'}"`);
            return res.send(Buffer.from(artifact.content));
        }catch(error){next(error);}
    }

    static async getExportStatus(req, res, next) {
        // FIX (audit P0 #8): export_jobs table now exists (migration 016).
        try {
            const { rows } = await dbClient.query(
                `SELECT job_id, CASE WHEN status='COMPLETED' AND expires_at<NOW() THEN 'EXPIRED' ELSE status END AS status, format, download_url, created_at, updated_at, expires_at, error_message
                 FROM export_jobs
                 WHERE user_id = $1
                 ORDER BY created_at DESC LIMIT 1`,
                [req.user.userId]
            );
            if (rows.length === 0) {
                return res.json({ status: 'NOT_FOUND' });
            }
            res.json({ job: rows[0] });
        } catch (err) { next(err); }
    }

    static async _internalUpdateExportStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014). Updates the real
        // export_jobs row (migration 016) AND emits an audit event.
        try {
            const { jobId, status, downloadUrl } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            await dbClient.query(
                `UPDATE export_jobs
                 SET status = $2,
                     download_url = COALESCE($3, download_url),
                     updated_at = NOW()
                 WHERE job_id = $1`,
                [jobId, status, downloadUrl || null]
            );
            const { AuditRepo } = await import('../../db/repositories.js');
            await AuditRepo.logEvent('EXPORT_STATUS_UPDATE', 'export', req.user?.userId ?? 'system', jobId, { status, downloadUrl });
            res.json({ success: true, status });
        } catch (err) { next(err); }
    }

    static async requestDeletion(req, res, next) {
        try {
            const db = dbClient;
            const userId = req.user.userId;

            // FIX (audit P0 #9): ADR-006 mandates soft-delete with a 30-day grace
            // period — the old `DELETE FROM users` was a hard delete with no audit
            // trail and no grace window. We now flip is_deleted, set deleted_at,
            // enqueue a deletion_jobs row, and emit an audit event.
            await db.query(
                `UPDATE users SET is_deleted = TRUE, deleted_at = NOW(), updated_at = NOW()
                 WHERE user_id = $1`,
                [userId]
            );

            const { rows } = await db.query(
                `INSERT INTO deletion_jobs (user_id, status)
                 VALUES ($1, 'PROCESSING')
                 RETURNING job_id`,
                [userId]
            );
            const jobId = rows[0]?.job_id;

            const { AuditRepo } = await import('../../db/repositories.js');
            await AuditRepo.logEvent('DELETION_REQUESTED', 'user', userId, userId, { job_id: jobId });

            res.json({ status: 'PROCESSING', jobId });
        } catch (err) { next(err); }
    }

    static async getDeletionStatus(req, res, next) {
        // FIX (audit P0 #6): audit_events has NO `user_id` column (it uses
        // `actor`) and NO `created_at` column (it uses `timestamp`). The old
        // query threw a 500 for every caller. deletion_jobs table exists
        // (migration 016) — prefer that, fall back to audit_events.
        try {
            const { rows: dj } = await dbClient.query(
                `SELECT job_id, status, created_at, updated_at
                 FROM deletion_jobs
                 WHERE user_id = $1
                 ORDER BY created_at DESC LIMIT 1`,
                [req.user.userId]
            );
            if (dj.length > 0) {
                return res.json({ status: dj[0].status, jobId: dj[0].job_id, requestedAt: dj[0].created_at });
            }
            const { rows } = await dbClient.query(
                `SELECT metadata, timestamp FROM audit_events
                 WHERE actor = $1 AND event_type = 'DELETION_REQUESTED'
                 ORDER BY timestamp DESC LIMIT 1`,
                [req.user.userId]
            );
            if (rows.length === 0) return res.json({ status: 'NOT_FOUND' });
            res.json({ status: 'PROCESSING', requestedAt: rows[0].timestamp });
        } catch (err) { next(err); }
    }

    static async _internalUpdateDeletionStatus(req, res, next) {
        // Internal webhook for CF Queue Worker (R-014). Updates the real
        // deletion_jobs row (migration 016) AND audits the status update.
        try {
            const { jobId, status } = req.body;
            if (!['PROCESSING', 'COMPLETED', 'FAILED'].includes(status)) throw new Error('Invalid status');
            await dbClient.query(
                `UPDATE deletion_jobs
                 SET status = $2, updated_at = NOW()
                 WHERE job_id = $1`,
                [jobId, status]
            );
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
