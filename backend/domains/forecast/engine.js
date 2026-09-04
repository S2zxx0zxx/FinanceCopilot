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
        // FIX (audit P1 #49): `historyDays` was the row COUNT — a user with
        // 5 transactions on the same day would report `historyDays = 5` and
        // pass the `>= 15` threshold spuriously. Compute the actual span
        // (latest observed_at − earliest observed_at) in days so the
        // LIMITED_HISTORY / LOW trust gating reflects real history length.
        let historySpanDays = 0;
        if (features.historicalDailySpending.length > 0) {
            const dates = features.historicalDailySpending
                .map(r => new Date(r.date).getTime())
                .filter(t => !Number.isNaN(t));
            if (dates.length > 0) {
                historySpanDays = Math.round(
                    (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24)
                );
            }
        }

        if (historySpanDays < 15) {
            trustState = 'LIMITED_HISTORY';
        } else {
            // Check spending volatility. If daily volatility is abnormally
            // high, downgrade trust. (FIX audit P1 #50: dead `medianSpend`
            // branch removed — the variable was computed and never used.)
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
