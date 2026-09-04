import { dbClient } from '../../db/client.js';

export class DataQualityController {
    static async getQualityMetrics(req, res, next) {
        try {
            const db = dbClient;

            // FIX (audit P0 #3): use real schema columns.
            // financial_accounts has NO `last_synced_at` and NO `connection_id` —
            // `last_synced_at` lives on source_connections; the FK column on
            // financial_accounts is `source_connection_id` (references
            // source_connections.connection_id).
            const { rows: connections } = await db.query(`
                SELECT
                    sc.status,
                    COUNT(*) as count,
                    MAX(sc.last_synced_at) as latest_sync
                FROM source_connections sc
                LEFT JOIN financial_accounts fa
                       ON fa.source_connection_id = sc.connection_id
                WHERE sc.user_id = $1
                GROUP BY sc.status
            `, [req.user.userId]);

            res.json({
                timestamp: new Date().toISOString(),
                metrics: {
                    connectionHealth: connections,
                    activeBetaCohorts: ['INTERNAL', 'BETA_COHORT_1']
                }
            });
        } catch (err) { next(err); }
    }
}
