import { dbClient } from '../../db/client.js';

export class DataQualityController {
    static async getQualityMetrics(req, res, next) {
        try {
            const db = dbClient;
            
            // Aggregate connection health from source_connections (schema table).
            // Schema: source_connections has status + created_at; financial_accounts has last_synced_at.
            const { rows: connections } = await db.query(`
                SELECT
                    sc.status,
                    COUNT(*) as count,
                    MAX(fa.last_synced_at) as latest_sync
                FROM source_connections sc
                LEFT JOIN financial_accounts fa ON fa.connection_id = sc.connection_id
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
