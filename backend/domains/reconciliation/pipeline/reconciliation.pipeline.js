import { DuplicateEngine } from '../engine/duplicate.engine.js';
import { TransferEngine } from '../engine/transfer.engine.js';
import { SettlementEngine } from '../engine/settlement.engine.js';
import { RefundEngine } from '../engine/refund.engine.js';
import { PendingEngine } from '../engine/pending.engine.js';
import { RECONCILIATION_VERSION } from '../engine/duplicate.engine.js';

export { RECONCILIATION_VERSION };

/**
 * Reconciliation Pipeline
 * 
 * Orchestrates the execution of all Reconciliation Engines (Duplicate, Transfer, Settlement, Refund)
 * on a given set of transactions, comparing them against a historical context window.
 */
export class ReconciliationPipeline {

    /**
     * @param {Array<Object>} transactions The batch of newly normalized transactions to reconcile
     * @param {Array<Object>} contextTransactions A wide window of historical transactions (e.g. +/- 15 days)
     * @returns {Array<Object>} All discovered relationship edges
     */
    static run(transactions, contextTransactions) {
        const allRelationships = [];

        for (const tx of transactions) {
            // 1. Run Duplicate Engine
            const duplicates = DuplicateEngine.evaluate(tx, contextTransactions);
            
            // 2. Run Transfer Engine
            const transfers = TransferEngine.evaluate(tx, contextTransactions);

            // 3. Run Settlement Engine
            const settlements = SettlementEngine.evaluate(tx, contextTransactions);

            // 4. Run Refund Engine
            const refunds = RefundEngine.evaluate(tx, contextTransactions);

            // 5. Run Pending Engine
            const postings = PendingEngine.evaluate(tx, contextTransactions);

            // Inject source_transaction_id and combine
            // Note: PendingEngine and RefundEngine explicitly map target AND source inside the engine, 
            // so we shouldn't overwrite if source_transaction_id already exists.
            const txEdges = [...duplicates, ...transfers, ...settlements, ...refunds, ...postings].map(rel => ({
                source_transaction_id: rel.source_transaction_id || tx.transaction_id,
                ...rel
            }));

            allRelationships.push(...txEdges);
        }

        // Rule 27: Mutual Exclusivity / Relationship Conflicts
        return this.resolveConflicts(allRelationships);
    }

    static resolveConflicts(relationships) {
        const resolved = [];
        const pairs = new Map();

        for (const rel of relationships) {
            // Uniquely identify the pair (order-independent for conflicts)
            const id1 = rel.source_transaction_id;
            const id2 = rel.target_transaction_id;
            const pairKey = id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
            
            if (!pairs.has(pairKey)) {
                pairs.set(pairKey, []);
            }
            pairs.get(pairKey).push(rel);
        }

        // Evaluate conflicts
        for (const [pairKey, rels] of pairs.entries()) {
            if (rels.length === 1) {
                resolved.push(rels[0]);
            } else {
                // Conflict detected! The same pair of transactions has MULTIPLE competing relationship types.
                // E.g. flagged as both 'duplicate' and 'transfer'.
                // Master Prompt Rule 27: Do not let duplicate implicitly mean transfer.
                // Action: Downgrade to 'conflict' status so it goes to manual review.
                for (const r of rels) {
                    resolved.push({
                        ...r,
                        status: 'conflict',
                        evidence: {
                            ...r.evidence,
                            conflict_reason: 'MULTIPLE_RELATIONSHIP_TYPES_DETECTED'
                        }
                    });
                }
            }
        }

        return resolved;
    }
}
