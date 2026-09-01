/**
 * Phase 8: Forecast Models
 * Probabilistic models capturing residual variance (e.g., Simple Exponential Smoothing).
 */

export class ForecastModels {
    /**
     * Probabilistic Exponential Smoothing (Residuals)
     * Suitable for capturing short-term trends in stationary residual series.
     * @param {Object} features 
     * @param {number} horizonDays 
     */
    static probabilisticES(features, horizonDays) {
        // Simplified ES implementation for Node.js backend.
        // In a real scenario, this applies alpha smoothing to the time series of residuals.
        let smoothedSpend = 0;
        let alpha = 0.2; // typical learning rate for stable spending

        if (features.historicalDailySpending.length > 0) {
            smoothedSpend = features.historicalDailySpending[0].spendPaise;
            for (let i = 1; i < features.historicalDailySpending.length; i++) {
                smoothedSpend = (alpha * features.historicalDailySpending[i].spendPaise) + ((1 - alpha) * smoothedSpend);
            }
        }

        // Project smoothed spend over horizon
        const projectedResidualSpendPaise = smoothedSpend * horizonDays;

        // Sum deterministic upcoming commitments
        const cutoffTime = new Date(features.cutoffDate).getTime();
        const horizonEnd = cutoffTime + (horizonDays * 24 * 60 * 60 * 1000);
        
        let deterministicCommitmentSpendPaise = 0;
        for (const c of features.upcomingCommitments) {
            const dueTime = new Date(c.dueDate).getTime();
            if (dueTime >= cutoffTime && dueTime <= horizonEnd) {
                deterministicCommitmentSpendPaise += c.amountPaise;
            }
        }

        const estimatedEndingBalancePaise = features.liquidBalancePaise 
                                            - deterministicCommitmentSpendPaise 
                                            - projectedResidualSpendPaise;

        return {
            pointEstimatePaise: Math.round(estimatedEndingBalancePaise),
            drivers: [
                { type: 'deterministic', description: 'Known upcoming commitments', impactPaise: -deterministicCommitmentSpendPaise },
                { type: 'probabilistic', description: 'Projected residual spend (Exponential Smoothing)', impactPaise: -projectedResidualSpendPaise }
            ],
            modelVersion: 'probabilistic_es_v1'
        };
    }
}
