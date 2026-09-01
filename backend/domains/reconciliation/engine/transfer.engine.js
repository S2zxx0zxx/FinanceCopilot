import { RECONCILIATION_VERSION } from './duplicate.engine.js';

/**
 * TransferEngine
 * 
 * Compares a source transaction against a context window of historical transactions
 * to detect movement between owned financial accounts (internal transfers).
 */
export class TransferEngine {
    
    /**
     * @param {Object} tx The transaction being reconciled
     * @param {Array<Object>} contextTransactions Historical transactions in a +/- 7 day window
     * @returns {Array<Object>} Derived relationship edges
     */
    static evaluate(tx, contextTransactions) {
        const relationships = [];

        for (const candidate of contextTransactions) {
            if (tx.transaction_id === candidate.transaction_id) {
                continue;
            }

            // Rule 11: Transfer requires opposite directions
            if (tx.direction === candidate.direction) {
                continue;
            }

            // Must be between DIFFERENT accounts. (Cannot transfer to the same account)
            if (tx.account_id && candidate.account_id && tx.account_id === candidate.account_id) {
                continue;
            }

            // Rule 25: Money matching tolerance - Use exact integer minor units for INR.
            if (tx.amount_paise !== candidate.amount_paise) {
                continue;
            }

            if (tx.currency !== candidate.currency) {
                continue;
            }

            const timeDiffMs = Math.abs(new Date(tx.observed_at) - new Date(candidate.observed_at));
            const diffDays = timeDiffMs / (1000 * 60 * 60 * 24);

            let status = null;
            let score = 0;
            const evidence = {
                diff_days: diffDays,
                amount_matched: true,
                opposite_directions: true,
                different_accounts: true
            };

            // Rule 10/11: Transfer Matching Logic
            // Exact same amount, opposite direction, different accounts, same day (within 24 hrs)
            if (diffDays < 1) {
                status = 'candidate';
                score = 0.9;
                evidence.reason = 'SAME_DAY_EXACT_AMOUNT';
            }
            // Often internal bank transfers take up to 3 days (e.g., NEFT over weekend)
            else if (diffDays <= 3) {
                status = 'needs_review';
                score = 0.7;
                evidence.reason = 'NEARBY_EXACT_AMOUNT';
            }

            if (status) {
                relationships.push({
                    target_transaction_id: candidate.transaction_id,
                    relationship_type: 'transfer',
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
