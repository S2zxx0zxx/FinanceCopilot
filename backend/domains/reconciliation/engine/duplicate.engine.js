export const RECONCILIATION_VERSION = 'v1.0.0-deterministic';

/**
 * DuplicateEngine
 * 
 * Compares a source transaction against a context window of historical transactions
 * to detect identical events (duplicates) without deleting the underlying evidence.
 */
export class DuplicateEngine {
    
    /**
     * @param {Object} tx The transaction being reconciled
     * @param {Array<Object>} contextTransactions Historical transactions in a +/- 7 day window
     * @returns {Array<Object>} Derived relationship edges
     */
    static evaluate(tx, contextTransactions) {
        const relationships = [];

        for (const candidate of contextTransactions) {
            // Cannot be a duplicate of itself
            if (tx.transaction_id === candidate.transaction_id) {
                continue;
            }

            // Must belong to the same account (if account is resolved)
            // If one is unresolved, it's ambiguous.
            if (tx.account_id && candidate.account_id && tx.account_id !== candidate.account_id) {
                continue;
            }

            // Amounts MUST match exactly for a duplicate.
            if (tx.amount_paise !== candidate.amount_paise) {
                continue;
            }

            // Directions MUST match.
            if (tx.direction !== candidate.direction) {
                continue;
            }

            // Currency MUST match.
            if (tx.currency !== candidate.currency) {
                continue;
            }

            // Evidence gathering
            const isSameAccount = tx.account_id && tx.account_id === candidate.account_id;
            const isSameReference = tx.reference_id && tx.reference_id === candidate.reference_id;
            const isSameMerchant = tx.merchant_normalized && tx.merchant_normalized === candidate.merchant_normalized;
            
            // Time proximity
            const timeDiffMs = Math.abs(new Date(tx.observed_at) - new Date(candidate.observed_at));
            const diffDays = timeDiffMs / (1000 * 60 * 60 * 24);

            let status = null;
            let score = 0;
            const evidence = {
                diff_days: diffDays,
                same_merchant: isSameMerchant,
                same_reference: isSameReference,
                same_account: isSameAccount
            };

            // Rule 1: Exact Reference Match (Strongest Deterministic Signal)
            if (isSameReference) {
                status = 'confirmed';
                score = 1.0;
            } 
            // Rule 2: Same exact amount, same merchant, same account, same day (within 24 hrs)
            else if (isSameAccount && isSameMerchant && diffDays < 1) {
                status = 'candidate'; // Needs review because you can buy two 500rs coffees in one day!
                score = 0.9;
                evidence.reason = 'SAME_DAY_IDENTICAL_AMOUNT_MERCHANT';
            }
            // Rule 3: Same exact amount, same merchant, same account, within 3 days (often happens with delayed auth)
            else if (isSameAccount && isSameMerchant && diffDays <= 3) {
                status = 'needs_review';
                score = 0.8;
                evidence.reason = 'NEARBY_IDENTICAL_AMOUNT_MERCHANT';
            }
            // Rule 4: Same amount, different merchant, same day -> Could be false positive, needs manual review to be sure
            else if (isSameAccount && !isSameMerchant && diffDays < 1) {
                // We don't automatically flag every matching amount as a duplicate,
                // but if we do, it goes to review. Actually, Rule 9 says "Never confirm on amount alone".
                // We won't even generate a candidate here to avoid noise.
                continue;
            }

            if (status) {
                relationships.push({
                    target_transaction_id: candidate.transaction_id,
                    relationship_type: 'duplicate',
                    status: status,
                    confidence_score: score,
                    evidence: evidence,
                    reconciliation_version: RECONCILIATION_VERSION
                });
            }
        }

        return relationships;
    }
}
