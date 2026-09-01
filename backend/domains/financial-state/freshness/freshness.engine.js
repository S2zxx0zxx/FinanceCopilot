export class FreshnessEngine {
    /**
     * Determines freshness based on real timestamps.
     * @returns 'fresh' | 'recent' | 'stale' | 'unknown'
     */
    static calculateFreshness(lastUpdatedDate) {
        if (!lastUpdatedDate) return 'unknown';
        
        const now = new Date();
        const diffHours = (now - new Date(lastUpdatedDate)) / (1000 * 60 * 60);
        
        if (diffHours < 6) return 'fresh';    // Under 6 hours
        if (diffHours < 24) return 'recent';  // 6hr - 24hr
        return 'stale';                       // Over 24 hours
    }
}
