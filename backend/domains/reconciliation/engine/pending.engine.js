import { RECONCILIATION_VERSION } from './duplicate.engine.js';

/**
 * PendingEngine
 * 
 * Matches a temporary pending transaction with its final posted transaction.
 * Usually they have exactly the same merchant and amount, but observed days apart.
 */
export class PendingEngine {
    
    static evaluate(tx, contextTransactions) {
        const relationships = [];

        // Only evaluate if one is pending and the other is posted
        for (const candidate of contextTransactions) {
            if (tx.transaction_id === candidate.transaction_id) continue;
            
            const hasPending = tx.posting_status === 'pending' || candidate.posting_status === 'pending';
            const hasPosted = tx.posting_status === 'posted' || candidate.posting_status === 'posted';
            
            if (!(hasPending && hasPosted)) {
                continue; // Not a pending->posted relationship
            }

            // Must belong to the exact same account
            if (tx.account_id && candidate.account_id && tx.account_id !== candidate.account_id) continue;

            // Must have the same direction
            if (tx.direction !== candidate.direction) continue;

            // Typically amounts match exactly, but sometimes pending authorizations are small (e.g. 1 INR).
            // But per Rule 25, we do not guess on amount tolerances. We enforce exact amount or flag for review.
            
            const pendingTx = tx.posting_status === 'pending' ? tx : candidate;
            const postedTx = tx.posting_status === 'posted' ? tx : candidate;

            // Pending must happen before or on the same day as Posted
            if (new Date(pendingTx.observed_at) > new Date(postedTx.observed_at)) {
                continue; 
            }

            const timeDiffMs = new Date(postedTx.observed_at) - new Date(pendingTx.observed_at);
            const diffDays = Math.abs(timeDiffMs / (1000 * 60 * 60 * 24));

            const isSameMerchant = tx.merchant_normalized && tx.merchant_normalized === candidate.merchant_normalized;
            const isSameAmount = tx.amount_paise === candidate.amount_paise;

            let status = null;
            let score = 0;
            const evidence = {
                diff_days: diffDays,
                same_merchant: isSameMerchant,
                same_amount: isSameAmount
            };

            // Rule 13: Pending / Posted Match
            if (isSameMerchant && isSameAmount && diffDays <= 7) {
                status = 'candidate';
                score = 0.95;
                evidence.reason = 'EXACT_AMOUNT_MERCHANT_POSTED';
            } else if (isSameMerchant && !isSameAmount && diffDays <= 7) {
                // Pre-auth differences (e.g. gas station authorized 1000, final was 850)
                status = 'needs_review';
                score = 0.7;
                evidence.reason = 'PRE_AUTH_AMOUNT_DIFFERENCE';
            }

            if (status) {
                relationships.push({
                    target_transaction_id: postedTx.transaction_id,
                    source_transaction_id: pendingTx.transaction_id, // Hardcoded direction: Pending -> Posted
                    relationship_type: 'posting',
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
