/**
 * Phase 8: Forecast Evaluation
 * Time-ordered walk-forward validation to ensure empirical accuracy and calibration.
 */
import { ForecastEngine } from './engine.js';

export class ForecastEvaluation {
    constructor(dbClient) {
        this.dbClient = dbClient;
        this.engine = new ForecastEngine(dbClient);
    }

    /**
     * Evaluates a single historical cutoff point.
     */
    async evaluateHistoricalPerformance(userId, cutoffDateStr, horizonDays) {
        const cutoffDate = new Date(cutoffDateStr);
        
        // 1. Generate forecast exactly as of cutoffDate (No future leakage)
        const snapshot = await this.engine.generateForecast(userId, horizonDays, cutoffDate);

        // 2. Determine the actual outcome date (cutoff + horizonDays)
        const targetOutcomeDate = new Date(cutoffDate.getTime() + horizonDays * 24 * 60 * 60 * 1000);

        // 3. Retrieve actual ending balance precisely on the outcome date
        const actualRes = await this.dbClient.query(
            `SELECT current_balance_paise FROM financial_snapshots 
             WHERE user_id = $1 AND DATE(as_of) <= DATE($2)
             ORDER BY as_of DESC LIMIT 1`,
            [userId, targetOutcomeDate.toISOString()]
        );
        
        if (actualRes.rows.length === 0) {
            throw new Error(`Evaluation aborted: No actual data available for outcome date ${targetOutcomeDate.toISOString()}`);
        }

        const actualEndingBalancePaise = Number(actualRes.rows[0].current_balance_paise);
        const predictedEndingBalancePaise = snapshot.pointEstimatePaise;

        if (snapshot.status === 'FORECAST_UNAVAILABLE') {
            return {
                userId,
                cutoffDate: snapshot.asOf,
                horizonDays,
                actualOutcomePaise: actualEndingBalancePaise,
                predictedPaise: null,
                status: 'UNAVAILABLE',
                metrics: {
                    maePaise: null,
                    rmsePaise: null,
                    biasPaise: null,
                    intervalCoverage: null,
                    intervalWidthPaise: null
                }
            };
        }

        // 4. Calculate point metrics
        const absoluteError = Math.abs(actualEndingBalancePaise - predictedEndingBalancePaise);
        const squaredError = Math.pow(actualEndingBalancePaise - predictedEndingBalancePaise, 2);
        const bias = predictedEndingBalancePaise - actualEndingBalancePaise; // Positive means over-predicted

        // 5. Calculate interval metrics
        const isWithinInterval = (actualEndingBalancePaise >= snapshot.lowerBoundPaise && actualEndingBalancePaise <= snapshot.upperBoundPaise);
        const intervalWidth = snapshot.upperBoundPaise - snapshot.lowerBoundPaise;

        return {
            userId,
            cutoffDate: snapshot.asOf,
            horizonDays,
            actualOutcomePaise: actualEndingBalancePaise,
            predictedPaise: predictedEndingBalancePaise,
            status: 'SUCCESS',
            metrics: {
                maePaise: absoluteError,
                rmsePaise: Math.sqrt(squaredError),
                biasPaise: bias,
                intervalCoverage: isWithinInterval ? 1 : 0,
                intervalWidthPaise: intervalWidth
            }
        };
    }

    /**
     * Executes Walk-Forward Validation over multiple cutoff steps.
     * Aggregates metrics (WAPE, Avg MAE, Observed Coverage).
     */
    async runWalkForwardValidation(userId, startCutoffDate, steps, stepDays, horizonDays) {
        const results = [];
        let currentCutoff = new Date(startCutoffDate);

        for (let i = 0; i < steps; i++) {
            try {
                const res = await this.evaluateHistoricalPerformance(userId, currentCutoff.toISOString(), horizonDays);
                results.push(res);
            } catch (err) {
                // If we run out of actual future data to evaluate against, stop.
                break;
            }
            // Move cutoff forward
            currentCutoff = new Date(currentCutoff.getTime() + stepDays * 24 * 60 * 60 * 1000);
        }

        if (results.length === 0) return null;

        const validResults = results.filter(r => r.status === 'SUCCESS');
        const unavailableCount = results.length - validResults.length;

        if (validResults.length === 0) {
            return {
                totalEvaluations: results.length,
                horizonDays,
                aggregateMetrics: {
                    status: 'FORECAST_UNAVAILABLE',
                    unavailableCount,
                    avgMAEPaise: null,
                    avgRMSEPaise: null,
                    avgBiasPaise: null,
                    wape: null,
                    observedIntervalCoverage: null,
                    avgIntervalWidthPaise: null
                },
                steps: results
            };
        }

        // Aggregate Metrics for valid forecasts
        const totalMAE = validResults.reduce((sum, r) => sum + r.metrics.maePaise, 0);
        const totalRMSE = validResults.reduce((sum, r) => sum + r.metrics.rmsePaise, 0);
        const totalBias = validResults.reduce((sum, r) => sum + r.metrics.biasPaise, 0);
        const totalActuals = validResults.reduce((sum, r) => sum + r.actualOutcomePaise, 0);
        const successfulCoverage = validResults.filter(r => r.metrics.intervalCoverage === 1).length;

        return {
            totalEvaluations: results.length,
            horizonDays,
            aggregateMetrics: {
                status: 'SUPPORTED',
                unavailableCount,
                avgMAEPaise: totalMAE / validResults.length,
                avgRMSEPaise: totalRMSE / validResults.length,
                avgBiasPaise: totalBias / validResults.length, // + = Overprediction bias
                wape: totalActuals === 0 ? 0 : (totalMAE / totalActuals) * 100, // Weighted Absolute Percentage Error
                observedIntervalCoverage: successfulCoverage / validResults.length, // Should ideally be close to 0.80 for nominal 80%
                avgIntervalWidthPaise: validResults.reduce((sum, r) => sum + r.metrics.intervalWidthPaise, 0) / validResults.length
            },
            steps: results
        };
    }
}
