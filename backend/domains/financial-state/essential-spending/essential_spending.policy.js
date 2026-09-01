export class EssentialSpendingPolicy {
    static VERSION = 'v1.0.0';

    /**
     * Essential Spending Policy V1
     * 
     * RULE: Essential spending must have a canonical production definition (e.g. baseline
     * spending averages on explicitly configured 'essential_category_ids').
     * 
     * Since V1 currently does not track historical category averages dynamically in the engine,
     * this explicitly flags an OPEN DECISION rather than silently inventing a rule or
     * zeroing out without explanation.
     */
    static calculateEssentialSpending(userId, stsConfig, _horizonDate) {
        // If categories were configured, we would calculate historical averages here.
        // For now, return 0 with an explicit OPEN_DECISION state.
        
        return {
            essential_spending_paise: 0,
            evidence_status: stsConfig.essential_category_ids && stsConfig.essential_category_ids.length > 0 
                                ? 'PARTIAL_EVIDENCE' 
                                : 'NO_EVIDENCE',
            policy_version: this.VERSION,
            reason: 'V1 OPEN DECISION: Essential spending tracking requires historical category aggregation which is not yet enabled.'
        };
    }
}
