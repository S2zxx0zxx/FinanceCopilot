/**
 * Forecast Repository
 * Provides database access for forecast snapshots, registry, and evaluations.
 * Strictly scoped by user_id to enforce tenant isolation.
 */
import { dbClient } from '../client.js';

export const ForecastRepo = {
    /**
     * Retrieves the latest forecast snapshot for a user and specific horizon.
     * @param {string} userId
     * @param {number} horizonDays
     * @returns {Object} snapshot
     */
    async getLatestSnapshot(userId, horizonDays) {
        const query = `
            SELECT * FROM forecast_snapshots 
            WHERE user_id = $1 AND horizon_days = $2
            ORDER BY as_of DESC LIMIT 1
        `;
        const res = await dbClient.query(query, [userId, horizonDays]);
        return res.rows[0] || null;
    },

    /**
     * Retrieve all active forecast models from registry.
     */
    async getActiveModels() {
        const query = `SELECT * FROM forecast_models WHERE status = 'active'`;
        const res = await dbClient.query(query);
        return res.rows;
    },

    /**
     * Save an evaluation metric result from time-ordered backtesting.
     */
    async saveEvaluation(evaluation) {
        const query = `
            INSERT INTO forecast_evaluations (
                model_id, dataset_identity, data_cutoff, horizon_days,
                mae, rmse, interval_coverage, interval_width
            ) VALUES (
                (SELECT model_id FROM forecast_models WHERE model_type = $1 LIMIT 1),
                $2, $3, $4, $5, $6, $7, $8
            ) RETURNING eval_id
        `;
        const values = [
            evaluation.modelType,
            evaluation.datasetIdentity,
            evaluation.cutoffDate,
            evaluation.horizonDays,
            evaluation.metrics.maePaise,
            evaluation.metrics.rmsePaise,
            evaluation.metrics.intervalCoverage,
            evaluation.metrics.intervalWidthPaise
        ];
        const res = await dbClient.query(query, values);
        return res.rows[0].eval_id;
    },
    
    /**
     * Retrieve recent evaluation metrics.
     */
    async getRecentEvaluations(userId) {
        const query = `
            SELECT fe.*, fm.model_type 
            FROM forecast_evaluations fe
            JOIN forecast_models fm ON fe.model_id = fm.model_id
            WHERE fe.user_id = $1
            ORDER BY fe.created_at DESC LIMIT 50
        `;
        const res = await dbClient.query(query, [userId]);
        return res.rows;
    }
};
