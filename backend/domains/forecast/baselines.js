/**
 * Phase 8: Forecast Baselines
 * Implements robust baseline models against which complex models must compete.
 */

export class ForecastBaselines {
    
    /**
     * Rolling Median Baseline
     * Calculates median daily residual spend over recent history, 
     * multiplies by horizon, and deducts from liquid cash minus known commitments.
     */
    static rollingMedian(features, horizonDays) {
        let medianDailySpend = 0;
        const spends = features.historicalDailySpending.map(s => s.spendPaise).sort((a, b) => a - b);
        
        if (spends.length > 0) {
            const mid = Math.floor(spends.length / 2);
            medianDailySpend = spends.length % 2 !== 0 ? spends[mid] : (spends[mid - 1] + spends[mid]) / 2;
        }

        // Project residual net cashflow (unknowns)
        const projectedResidualNetFlowPaise = medianDailySpend * horizonDays;

        // Sum deterministic upcoming commitments (stored as positive expected amounts to be deducted/added)
        // Wait, if it's an expense, we deduct. Let's check how Phase 7 stores them.
        // Assume commitments are stored as absolute amounts and we just deduct them for now.
        const cutoffTime = new Date(features.cutoffDate).getTime();
        const horizonEnd = cutoffTime + (horizonDays * 24 * 60 * 60 * 1000);
        
        let deterministicCommitmentSpendPaise = 0;
        for (const c of features.upcomingCommitments) {
            const dueTime = new Date(c.dueDate).getTime();
            if (dueTime >= cutoffTime && dueTime <= horizonEnd) {
                deterministicCommitmentSpendPaise += c.amountPaise;
            }
        }

        // Final ending balance estimate
        // Balance - deterministic expenses + projected net cashflow (which is usually negative)
        const estimatedEndingBalancePaise = features.liquidBalancePaise 
                                            - deterministicCommitmentSpendPaise 
                                            - projectedResidualNetFlowPaise;

        return {
            pointEstimatePaise: Math.round(estimatedEndingBalancePaise),
            drivers: [
                { type: 'deterministic', description: 'Known upcoming commitments', impactPaise: -deterministicCommitmentSpendPaise },
                { type: 'probabilistic', description: 'Projected residual net cashflow (median)', impactPaise: -projectedResidualNetFlowPaise }
            ],
            modelVersion: 'baseline_rolling_median_v1'
        };
    }
}
