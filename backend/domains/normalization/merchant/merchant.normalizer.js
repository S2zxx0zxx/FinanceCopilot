/**
 * Merchant Normalizer
 * 
 * Maps raw strings to canonical merchants using deterministic rules first,
 * and tracks AI/fuzzy lookup boundaries.
 */
export class MerchantNormalizer {
    
    /**
     * @param {string} rawDescription 
     * @param {string} rawMerchantText 
     * @returns {{ merchant_raw: string, merchant_normalized: string|null, needs_review: boolean }}
     */
    static normalizeMerchant(rawDescription, rawMerchantText) {
        let bestRaw = (rawMerchantText || rawDescription || '').trim();
        
        if (!bestRaw) {
            return { merchant_raw: 'UNKNOWN', merchant_normalized: null, needs_review: true };
        }

        let normalized = bestRaw.toUpperCase();

        // Remove common noise (dates, transaction ids inside the text)
        // e.g. "UPI/123456789/AMAZON/axis"
        if (normalized.includes('UPI/')) {
            const parts = normalized.split('/');
            // Usually the 3rd or 4th part is the merchant in Indian UPI strings
            // Example: UPI/CR/1234567/AMAZON PAY/HDFC
            const potentialMerchant = parts.length >= 4 ? parts[3] : parts[parts.length - 1];
            normalized = potentialMerchant.replace(/[^A-Z0-9 ]/g, '').trim();
        }

        // Clean up basic asterisks and bank statement padding
        normalized = normalized.replace(/\*+/g, ' ').replace(/\s+/g, ' ').trim();

        // Known Alias Dictionary (Phase 3 Deterministic Rule)
        // In a real system, this is loaded from `merchants.aliases` DB column.
        const knownAliases = {
            'AMZN': 'AMAZON',
            'AMAZON MKTPLACE': 'AMAZON',
            'UBER TRIP': 'UBER',
            'UBER BV': 'UBER',
            'SWIGGY': 'SWIGGY',
            'ZOMATO': 'ZOMATO',
            'STARBUCKS': 'STARBUCKS'
        };

        for (const [alias, canonical] of Object.entries(knownAliases)) {
            if (normalized.includes(alias)) {
                return { merchant_raw: bestRaw, merchant_normalized: canonical, needs_review: false };
            }
        }

        // If we can't deterministically map it, we return the cleaned string but flag for potential review/AI enrichment
        return { 
            merchant_raw: bestRaw, 
            merchant_normalized: normalized, 
            needs_review: false // We don't block the transaction just because the merchant is unknown, but we could lower its confidence
        };
    }
}
