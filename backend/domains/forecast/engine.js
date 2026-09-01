/**
 * Phase 8: Forecast Engine Orchestrator
 * Central integration point for features, models, calibration, and snapshotting.
 */
import { ForecastFeatures } from './features.js';
import { ForecastBaselines } from './baselines.js';
import { ForecastCalibration } from './calibration.js';

export class ForecastEngine {
    constructor(dbClient) {
        this.dbClient = dbClient;
        this.featureExtractor = new ForecastFeatures(dbClient);
    }

    /**
     * Generates a forecast for a specific user and horizon.
     */
    async generateForecast(userId, horizonDays, asOfDate = new Date()) {
        
        // 1. Point-in-time Feature Extraction
        const features = await this.featureExtractor.extractPointInTimeFeatures(userId, asOfDate);

        // 2. Assess Data Trust / Quality (Cold-Start Policy)
        let trustState = 'HIGH';
        const historyDays = features.historicalDailySpending.length;
        
        if (historyDays < 15) {
            trustState = 'LIMITED_HISTORY';
        } else {
            // Check spending volatility vs median.
            // If volatility is abnormally high relative to general spending behavior, downgrade trust.
            const medianSpend = ForecastBaselines.rollingMedian(features, 1).pointEstimatePaise;
            // Since pointEstimate is the balance - median - commitments, we need to extract median spend.
            // A quick surrogate: if daily volatility exceeds 5000 INR (500000 paise), flag as LOW.
            if (features.spendingVolatilityPaise > 500000) {
                trustState = 'LOW'; // Highly unpredictable spending behavior
            }
        }

        // 3. Select & Run Model
        // For V1, we rely on the validated Rolling Median Baseline.
        
        // 90-Day Production Policy Enforcement:
        // A random walk sqrt(t) interval cannot cover uncommitted deterministic linear drift at long horizons.
        if (trustState === 'LOW' && horizonDays >= 90) {
            return {
                userId,
                asOf: asOfDate.toISOString(),
                horizonDays,
                modelId: 'baseline_rolling_median',
                featureVersion: features.featureVersion,
                ruleVersion: 'v1.0.0',
                pointEstimatePaise: null,
                lowerBoundPaise: null,
                upperBoundPaise: null,
                intervalLevel: null,
                trustState: 'LOW_TRUST_LONG_HORIZON',
                status: 'FORECAST_UNAVAILABLE',
                drivers: [],
                pressurePoints: [{ type: 'unsupported_horizon', severity: 'HIGH', description: '90-day forecast is scientifically invalid for highly volatile uncommitted income cohorts.' }],
                assumptions: {}
            };
        }

        let rawForecast = ForecastBaselines.rollingMedian(features, horizonDays);

        // 4. Calibration (Intervals)
        const calibratedForecast = ForecastCalibration.calibrateIntervals(rawForecast, features, horizonDays);

        // 5. Generate Pressure Points
        const pressurePoints = [];
        if (calibratedForecast.lowerBoundPaise < 0) {
            pressurePoints.push({ type: 'negative_balance_risk', severity: 'HIGH', description: 'Forecast lower bound falls below zero.' });
        }

        const snapshot = {
            userId,
            asOf: asOfDate.toISOString(),
            horizonDays,
            modelId: 'baseline_rolling_median', // mapped to UUID in DB ideally
            featureVersion: features.featureVersion,
            ruleVersion: 'v1.0.0',
            pointEstimatePaise: calibratedForecast.pointEstimatePaise,
            lowerBoundPaise: calibratedForecast.lowerBoundPaise,
            upperBoundPaise: calibratedForecast.upperBoundPaise,
            intervalLevel: calibratedForecast.intervalLevel,
            trustState,
            drivers: calibratedForecast.drivers,
            pressurePoints,
            assumptions: { knownCommitmentsEvaluated: features.upcomingCommitments.length }
        };

        return snapshot;
    }

    /**
     * Persists the snapshot to PostgreSQL.
     */
    async saveSnapshot(snapshot) {
        const query = `
            INSERT INTO forecast_snapshots (
                user_id, as_of, horizon_days, feature_version, rule_version,
                point_estimate_paise, lower_bound_paise, upper_bound_paise,
                interval_level, trust_state, drivers, pressure_points, assumptions
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) RETURNING forecast_id
        `;
        const values = [
            snapshot.userId, snapshot.asOf, snapshot.horizonDays, snapshot.featureVersion, snapshot.ruleVersion,
            snapshot.pointEstimatePaise, snapshot.lowerBoundPaise, snapshot.upperBoundPaise,
            snapshot.intervalLevel, snapshot.trustState, JSON.stringify(snapshot.drivers), 
            JSON.stringify(snapshot.pressurePoints), JSON.stringify(snapshot.assumptions)
        ];
        
        const res = await this.dbClient.query(query, values);
        return res.rows[0].forecast_id;
    }
}
