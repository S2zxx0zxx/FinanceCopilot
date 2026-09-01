import pg from 'pg';
import { dbClient } from '../db/client.js';
import { ReconciliationPipeline, RECONCILIATION_VERSION } from '../domains/reconciliation/pipeline/reconciliation.pipeline.js';
import { ReconciliationRepo } from '../db/reconciliation.repository.js';
import { AuditRepo } from '../db/repositories.js';

/**
 * ReconciliationWorker
 * 
 * Safely claims batches of un-reconciled transactions, evaluates them against 
 * historical context, and persists the discovered relationship graph edges.
 */
export class ReconciliationWorker {

    static async startRun(tenantId) {
        const client = await dbClient.pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Create a Run Record
            const run = await ReconciliationRepo.createRun(tenantId, RECONCILIATION_VERSION);
            const runId = run.run_id;

            // 2. Safely claim a batch of transactions
            const transactions = await ReconciliationRepo.claimUnreconciledTransactions(client, tenantId, 100);

            if (transactions.length === 0) {
                await client.query('ROLLBACK');
                return { runId, status: 'no_work' };
            }

            // 3. Fetch Context Window
            const contextTransactions = await ReconciliationRepo.getContextTransactions(client, tenantId);

            // 4. Run Pipeline
            const relationships = ReconciliationPipeline.run(transactions, contextTransactions);

            let matchesFound = 0;
            let reviewsCreated = 0;

            // 5. Persist Relationships and Audit
            for (const rel of relationships) {
                rel.tenant_id = tenantId; // Inject Tenant
                
                // Idempotency: ON CONFLICT DO NOTHING
                const savedRel = await ReconciliationRepo.saveRelationship(client, rel, runId);

                if (savedRel) {
                    matchesFound++;
                    
                    // Audit Event for Relationship Creation
                    await AuditRepo.logEvent(
                        `${rel.relationship_type.toUpperCase()}_CANDIDATE_CREATED`,
                        'transaction_relationship',
                        savedRel.relationship_id,
                        tenantId, // Actor is the tenant/system
                        {
                            source_transaction_id: rel.source_transaction_id,
                            target_transaction_id: rel.target_transaction_id,
                            status: rel.status,
                            reconciliation_version: RECONCILIATION_VERSION
                        }
                    );
                    
                    // 6. Create Review Items for Ambiguous Matches
                    if (rel.status === 'needs_review' || rel.status === 'conflict') {
                        reviewsCreated++;
                        
                        const reviewItem = {
                            tenant_id: tenantId,
                            relationship_id: savedRel.relationship_id,
                            reason_code: rel.evidence.reason || rel.evidence.conflict_reason || 'AMBIGUOUS_RELATIONSHIP',
                            evidence: rel.evidence,
                            score: rel.confidence_score,
                            reconciliation_version: RECONCILIATION_VERSION
                        };

                        const savedReview = await ReconciliationRepo.createReviewItem(client, reviewItem);

                        // Audit Event for Review Creation
                        await AuditRepo.logEvent(
                            'REVIEW_CREATED',
                            'review_item',
                            savedReview.review_id,
                            tenantId,
                            { reason_code: reviewItem.reason_code }
                        );
                    }
                }
            }

            // 7. Mark Run as Completed
            await ReconciliationRepo.completeRun(client, runId, {
                records_examined: transactions.length,
                matches_found: matchesFound,
                reviews_created: reviewsCreated
            });

            await AuditRepo.logEvent(
                'RECONCILIATION_RUN_COMPLETED',
                'reconciliation_run',
                runId,
                tenantId,
                { records_examined: transactions.length, matches_found: matchesFound }
            );

            await client.query('COMMIT');
            
            return {
                runId,
                status: 'completed',
                records_examined: transactions.length,
                matches_found: matchesFound,
                reviews_created: reviewsCreated
            };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[ReconciliationWorker] Error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}
