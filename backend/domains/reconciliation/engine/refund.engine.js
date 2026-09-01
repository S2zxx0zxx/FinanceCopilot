import { RECONCILIATION_VERSION } from './duplicate.engine.js';

/**
 * RefundEngine
 * 
 * Matches credit transactions (refunds) back to their original debit transactions
 * (purchases).
 */
export class RefundEngine {
    
    static evaluate(tx, contextTransactions) {
        const relationships = [];

        // A refund evaluation is only relevant if one transaction is a credit and the other is a debit.
        for (const candidate of contextTransactions) {
            if (tx.transaction_id === candidate.transaction_id) continue;
            if (tx.direction === candidate.direction) continue;
            
            // Must be on the exact same account
            if (tx.account_id && candidate.account_id && tx.account_id !== candidate.account_id) continue;

            const timeDiffMs = new Date(tx.observed_at) - new Date(candidate.observed_at);
            const diffDays = Math.abs(timeDiffMs / (1000 * 60 * 60 * 24));

            // Refunds typically happen AFTER the purchase. 
            // If tx is the refund (credit), candidate (debit) must be older.
            // If tx is the purchase (debit), candidate (credit) must be newer.
            const isTxRefund = tx.direction === 'credit';
            const refundTx = isTxRefund ? tx : candidate;
            const purchaseTx = isTxRefund ? candidate : tx;

            if (new Date(refundTx.observed_at) < new Date(purchaseTx.observed_at)) {
                // Refund cannot happen before purchase
                continue;
            }

            // Must have the same merchant
            const isSameMerchant = tx.merchant_normalized && tx.merchant_normalized === candidate.merchant_normalized;
            
            let status = null;
            let score = 0;
            const evidence = {
                diff_days: diffDays,
                same_merchant: isSameMerchant
            };

            // Rule 14/15: Exact Amount Full Refund
            if (isSameMerchant && tx.amount_paise === candidate.amount_paise) {
                status = 'candidate';
                score = 0.95;
                evidence.reason = 'EXACT_AMOUNT_FULL_REFUND';
            }
            // Partial refund (Refund amount is less than purchase amount)
            else if (isSameMerchant && refundTx.amount_paise < purchaseTx.amount_paise) {
                status = 'needs_review';
                score = 0.7;
                evidence.reason = 'PARTIAL_REFUND_CANDIDATE';
            }

            if (status) {
                // Direction of edge: Refund -> points to -> Purchase
                relationships.push({
                    source_transaction_id: isTxRefund ? refundTx.transaction_id : purchaseTx.transaction_id,
                    target_transaction_id: isTxRefund ? purchaseTx.transaction_id : refundTx.transaction_id,
                    relationship_type: 'refund',
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
