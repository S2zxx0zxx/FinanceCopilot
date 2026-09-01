import { NormalizationRepo } from '../db/repositories.js';
import { NormalizationPipeline } from '../domains/normalization/pipeline/normalization.pipeline.js';
import { AuditRepo } from '../db/repositories.js';

/**
 * Normalization Worker
 * 
 * Background process that polls for `raw` source records and processes them
 * through the Normalization Pipeline to generate canonical `transactions`.
 */
export class NormalizationWorker {
    
    constructor(repo = NormalizationRepo) {
        this.repo = repo;
        this.isPolling = false;
    }

    startPolling(intervalMs = 5000) {
        if (this.isPolling) return;
        this.isPolling = true;
        console.log(`[NORMALIZATION_WORKER] Started background polling every ${intervalMs}ms...`);
        
        // eslint-disable-next-line no-undef
        setInterval(async () => {
            try {
                // eslint-disable-next-line
                await this.pollOnce();
            } catch (err) {
                console.error('[NORMALIZATION_WORKER] Uncaught error in polling loop:', err);
            }
        }, intervalMs);
    }

    async pollOnce() {
        // Claim a batch of raw records atomically
        const rawRecords = await this.repo.claimNextRawSourceRecords(20);
        if (!rawRecords || rawRecords.length === 0) return;

        console.log(`[NORMALIZATION_WORKER] Acquired ${rawRecords.length} raw records for normalization.`);

        for (const record of rawRecords) {
            try {
                // Pre-resolve the account_id from the source connection
                const accountId = await this.repo.getAccountIdForSourceRecord(record.source_record_id);
                if (accountId) {
                    record.resolved_account_id = accountId;
                }

                // 1. Run Pipeline
                const canonicalTx = NormalizationPipeline.run(record);

                // 2. Persist Canonical Record Idempotently
                const savedTx = await this.repo.saveCanonicalTransaction(canonicalTx, record.source_record_id);

                if (savedTx) {
                    await AuditRepo.logEvent('NORMALIZATION_SUCCESS', 'transaction', savedTx.transaction_id, 'system_worker', {
                        source_record_id: record.source_record_id,
                        version: canonicalTx.normalization_version
                    });
                }

            } catch (error) {
                console.error(`[NORMALIZATION_WORKER] Failed to normalize record ${record.source_record_id}:`, error);
                
                await this.repo.markSourceRecordRejected(record.source_record_id, error.message);
                
                await AuditRepo.logEvent('NORMALIZATION_FAILED', 'source_record', record.source_record_id, 'system_worker', { 
                    error: error.message 
                });
            }
        }
    }
}
