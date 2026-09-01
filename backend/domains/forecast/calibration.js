/**
 * Phase 8: Forecast Calibration
 * Empirically derives prediction intervals using observed residual volatility.
 */

export class ForecastCalibration {
    
    /**
     * Calculates empirical prediction intervals based on rolling variance.
     * Nominal 80% interval (Z-score ~1.28 for normal distribution approximation of residuals)
     * 
     * @param {Object} forecast - The point estimate object
     * @param {Object} features - Extracted features including volatility
     * @param {number} horizonDays 
     */
    static calibrateIntervals(forecast, features, horizonDays) {
        // Volatility scales with square root of time
        const scaledVolatilityPaise = features.spendingVolatilityPaise * Math.sqrt(horizonDays);
        
        // 80% prediction interval z-score = ~1.28
        const zScore80 = 1.28; 
        
        const marginOfErrorPaise = scaledVolatilityPaise * zScore80;

        return {
            ...forecast,
            lowerBoundPaise: Math.round(forecast.pointEstimatePaise - marginOfErrorPaise),
            upperBoundPaise: Math.round(forecast.pointEstimatePaise + marginOfErrorPaise),
            intervalLevel: 0.800,
            calibrationVersion: 'v1.0.0'
        };
    }
}
