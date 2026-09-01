import { RECONCILIATION_VERSION } from './duplicate.engine.js';

/**
 * SettlementEngine
 * 
 * Matches credit card payments (settlements) between checking accounts (debits) 
 * and credit card accounts (credits).
 */
export class SettlementEngine {
    
    static evaluate(tx, contextTransactions) {
        const relationships = [];

        // Settlement matching is essentially a specialized transfer.
        // E.g., Debit of 50k from Checking -> Credit of 50k to Credit Card.
        for (const candidate of contextTransactions) {
            if (tx.transaction_id === candidate.transaction_id) continue;
            if (tx.direction === candidate.direction) continue;
            if (tx.amount_paise !== candidate.amount_paise) continue;
            if (tx.currency !== candidate.currency) continue;

            const timeDiffMs = Math.abs(new Date(tx.observed_at) - new Date(candidate.observed_at));
            const diffDays = timeDiffMs / (1000 * 60 * 60 * 24);

            // Look for specific descriptors indicating settlement
            const isSettlementKeyword = 
                (tx.transaction_type === 'card_settlement' || candidate.transaction_type === 'card_settlement') ||
                (tx.description && tx.description.toLowerCase().includes('credit card payment')) ||
                (candidate.description && candidate.description.toLowerCase().includes('credit card payment'));

            if (isSettlementKeyword && diffDays <= 5) {
                relationships.push({
                    target_transaction_id: candidate.transaction_id,
                    relationship_type: 'settlement',
                    status: 'candidate',
                    confidence_score: 0.9,
                    evidence: { diff_days: diffDays, reason: 'SETTLEMENT_KEYWORD_MATCH' },
                    reconciliation_version: RECONCILIATION_VERSION
                });
            }
        }
        return relationships;
    }
}
