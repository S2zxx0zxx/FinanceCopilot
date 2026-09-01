const CONFIDENCE_POLICY = {
    VERSION: 'v1.0.0-deterministic',
    MIN_THRESHOLD_FOR_POSTING: 0.85,
    REASONS: {
        AMBIGUOUS_DATE: { penalty: 0.2, review_required: true },
        DIRECTION_CONFLICT: { penalty: 0.3, review_required: true },
        UNKNOWN_MERCHANT: { penalty: 0.05, review_required: false },
        MISSING_AMOUNT: { penalty: 1.0, review_required: true },
        ACCOUNT_UNRESOLVED: { penalty: 0.1, review_required: true }
    }
};

/**
 * Confidence Engine
 * 
 * Calculates evidence-based overall confidence for the normalized transaction.
 * Triggers NEEDS_REVIEW flags for anything ambiguous or risky.
 */
export class ConfidenceEngine {
    
    static get POLICY_VERSION() {
        return CONFIDENCE_POLICY.VERSION;
    }
    
    /**
     * @param {Object} extractionContext
     * @param {number} extractionContext.parserConfidence (from source_records)
     * @param {boolean} extractionContext.isDateAmbiguous
     * @param {boolean} extractionContext.isDirectionConflict
     * @param {boolean} extractionContext.isAccountUnresolved
     * @returns {{ score: number, needs_review: boolean, review_reasons: string[] }}
     */
    static calculateConfidence(extractionContext) {
        let score = extractionContext.parserConfidence || 1.0;
        let needsReview = false;
        const reasons = [];

        if (extractionContext.isDateAmbiguous) {
            score -= CONFIDENCE_POLICY.REASONS.AMBIGUOUS_DATE.penalty;
            needsReview = needsReview || CONFIDENCE_POLICY.REASONS.AMBIGUOUS_DATE.review_required;
            reasons.push('AMBIGUOUS_DATE');
        }

        if (extractionContext.isDirectionConflict) {
            score -= CONFIDENCE_POLICY.REASONS.DIRECTION_CONFLICT.penalty;
            needsReview = needsReview || CONFIDENCE_POLICY.REASONS.DIRECTION_CONFLICT.review_required;
            reasons.push('DIRECTION_CONFLICT');
        }

        if (extractionContext.isMerchantUnknown) {
            score -= CONFIDENCE_POLICY.REASONS.UNKNOWN_MERCHANT.penalty;
            needsReview = needsReview || CONFIDENCE_POLICY.REASONS.UNKNOWN_MERCHANT.review_required;
        }

        if (extractionContext.isAmountMissing) {
            score -= CONFIDENCE_POLICY.REASONS.MISSING_AMOUNT.penalty;
            needsReview = needsReview || CONFIDENCE_POLICY.REASONS.MISSING_AMOUNT.review_required;
            reasons.push('MISSING_AMOUNT');
        }

        if (extractionContext.isAccountUnresolved) {
            score -= CONFIDENCE_POLICY.REASONS.ACCOUNT_UNRESOLVED.penalty;
            needsReview = needsReview || CONFIDENCE_POLICY.REASONS.ACCOUNT_UNRESOLVED.review_required;
            reasons.push('ACCOUNT_UNRESOLVED');
        }

        if (score < CONFIDENCE_POLICY.MIN_THRESHOLD_FOR_POSTING) {
            needsReview = true;
        }

        // Bound between 0 and 1
        score = Math.max(0, Math.min(1, score));

        return {
            score: parseFloat(score.toFixed(3)),
            needs_review: needsReview,
            review_reasons: reasons
        };
    }
}
