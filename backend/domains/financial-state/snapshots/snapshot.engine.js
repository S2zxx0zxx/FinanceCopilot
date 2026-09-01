import { dbClient } from '../../../db/client.js';

export class SnapshotEngine {
    /**
     * Persists exact calculation rules and inputs.
     */
    static async saveSnapshot(userId, calcType, resultPaise, inputSnapshot, freshness, coverage, confidence) {
        const query = `
            INSERT INTO financial_snapshots (
                user_id, calculation_type, calculation_version, result_paise, 
                input_snapshot, freshness_score, coverage_score, confidence_level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING snapshot_id
        `;
        const res = await dbClient.query(query, [
            userId, 
            calcType, 
            'v1.0.0', 
            resultPaise, 
            JSON.stringify(inputSnapshot),
            freshness,
            coverage,
            confidence
        ]);
        return res.rows[0].snapshot_id;
    }
}
