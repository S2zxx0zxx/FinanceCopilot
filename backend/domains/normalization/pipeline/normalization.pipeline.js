import { MoneyNormalizer } from '../amount/money.normalizer.js';
import { DateNormalizer } from '../date/date.normalizer.js';
import { DirectionNormalizer } from '../direction/direction.normalizer.js';
import { TypeNormalizer } from '../type/type.normalizer.js';
import { MerchantNormalizer } from '../merchant/merchant.normalizer.js';
import { CategoryNormalizer } from '../category/category.normalizer.js';
import { ConfidenceEngine } from '../confidence/confidence.engine.js';

// Export explicitly from ConfidenceEngine policy
export const NORMALIZATION_VERSION = ConfidenceEngine.POLICY_VERSION;

/**
 * Normalization Pipeline
 * 
 * Takes an immutable Phase 2 `source_record` and deterministically converts it
 * into a Phase 3 Canonical Transaction.
 */
export class NormalizationPipeline {
    
    /**
     * @param {Object} rawRecord DB row from `source_records`
     * @returns {Object} Canonical Transaction ready for `transactions` table
     */
    static run(rawRecord) {
        
        // 1. Money Normalization
        const moneyResult = MoneyNormalizer.normalizeToPaise(rawRecord.raw_amount_text);
        
        // 2. Direction Normalization
        const directionResult = DirectionNormalizer.normalizeDirection(
            rawRecord.raw_direction_text, 
            moneyResult.is_negative_in_source
        );

        // 3. Date Normalization
        const dateResult = DateNormalizer.normalizeDate(rawRecord.raw_date_text);

        // 4. Type & Subtype Mapping
        const typeResult = TypeNormalizer.normalizeType(
            rawRecord.raw_description_text, 
            directionResult.direction, 
            moneyResult.amount_paise
        );

        // 5. Merchant Resolution
        const merchantResult = MerchantNormalizer.normalizeMerchant(
            rawRecord.raw_description_text,
            rawRecord.raw_merchant_text
        );

        // 6. Category Resolution
        const categoryResult = CategoryNormalizer.normalizeCategory(
            rawRecord.raw_description_text,
            merchantResult.merchant_normalized,
            typeResult.type
        );

        // 7. Confidence & Review Checks
        const confidenceResult = ConfidenceEngine.calculateConfidence({
            parserConfidence: parseFloat(rawRecord.extraction_confidence),
            isDateAmbiguous: dateResult.is_ambiguous || !dateResult.date,
            isDirectionConflict: directionResult.has_conflict,
            isMerchantUnknown: merchantResult.needs_review,
            isAmountMissing: !moneyResult.is_valid || moneyResult.amount_paise === null,
            isAccountUnresolved: !rawRecord.resolved_account_id
        });

        // 7. Assemble Canonical Record (ADR-001/003 Strict Schema)
        return {
            user_id: rawRecord.user_id,
            source_record_id: rawRecord.source_record_id,
            statement_id: null, // Populated via Statement domain in Phase 1, passed from Import Job if available. For now null.
            account_id: rawRecord.resolved_account_id || null, // Mapped automatically via worker traversing the connection tree
            payment_instrument_id: null,
            
            observed_at: dateResult.date || new Date(0), // Fallback to epoch if fully ambiguous, but flagged for review
            amount_paise: moneyResult.amount_paise || 0,
            currency: rawRecord.raw_currency_text || 'INR', // Explicit default
            direction: directionResult.direction,

            merchant_raw: merchantResult.merchant_raw,
            merchant_normalized: merchantResult.merchant_normalized,
            merchant_id: null, // No explicit DB mapping yet
            merchant_category_code: null,

            category_id: categoryResult.category_id,
            category_raw: categoryResult.category_raw,
            category_confidence: categoryResult.category_confidence,

            transaction_type: typeResult.type,
            sub_type: typeResult.sub_type,
            reference_id: rawRecord.raw_reference_text || null,
            description: rawRecord.raw_description_text,
            notes: null,

            overall_confidence: confidenceResult.score,
            needs_review: confidenceResult.needs_review,
            review_reason: confidenceResult.review_reasons.length > 0 ? confidenceResult.review_reasons : null,

            normalization_version: NORMALIZATION_VERSION
        };
    }
}
