/**
 * Category Normalizer
 * 
 * Maps transaction text, merchant, and type to a predefined Category Taxonomy.
 */
export class CategoryNormalizer {
    
    /**
     * @param {string} rawDescription 
     * @param {string} normalizedMerchant 
     * @param {string} transactionType 
     * @returns {{ category_raw: string, category_id: string|null, category_confidence: number }}
     */
    static normalizeCategory(rawDescription, normalizedMerchant, transactionType) {
        // Simple deterministic mapping for Phase 3. 
        // In a real system, this pulls from the `categories` DB table.
        
        let determinedCategoryRaw = 'Uncategorized';
        let confidence = 0.5; // low confidence if we don't know

        const text = (rawDescription || '').toLowerCase();
        const merchant = (normalizedMerchant || '').toLowerCase();

        // 1. Transaction Type Based
        if (transactionType === 'income') {
            if (text.includes('salary')) determinedCategoryRaw = 'Salary';
            else determinedCategoryRaw = 'Income';
            confidence = 0.9;
        } else if (transactionType === 'transfer_out' || transactionType === 'transfer_in') {
            determinedCategoryRaw = 'Transfer';
            confidence = 0.9;
        } else if (transactionType === 'fee') {
            determinedCategoryRaw = 'Bank Fees';
            confidence = 0.95;
        }

        // 2. Merchant Based (Overrides type-based if strong match)
        if (merchant === 'uber' || merchant === 'ola') {
            determinedCategoryRaw = 'Transport';
            confidence = 0.95;
        } else if (merchant === 'swiggy' || merchant === 'zomato' || merchant === 'starbucks') {
            determinedCategoryRaw = 'Food & Dining';
            confidence = 0.95;
        } else if (merchant === 'amazon' || merchant === 'flipkart') {
            determinedCategoryRaw = 'Shopping';
            confidence = 0.85;
        } else if (text.includes('atm') && text.includes('cash')) {
            determinedCategoryRaw = 'Cash';
            confidence = 0.95;
        }

        return {
            category_raw: determinedCategoryRaw,
            category_id: null, // Would map to UUID in categories table
            category_confidence: confidence
        };
    }
}
