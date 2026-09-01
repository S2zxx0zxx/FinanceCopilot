import { dbClient } from '../../db/client.js';

export class DataQualityController {
    static async getQualityMetrics(req, res, next) {
        try {
            const db = dbClient;
            
            // This endpoint aggregates connection health, sync failures, and freshness
            // to satisfy Phase 13 Data Quality Dashboard requirements (Section 45).
            const { rows: connections } = await db.query(`
                SELECT 
                    status,
                    COUNT(*) as count,
                    MAX(last_sync) as latest_sync
                FROM user_connections
                WHERE user_id = $1
                GROUP BY status
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
