import { JobLifecycle } from './job-lifecycle.js';
import { IngestionRepo, AuditRepo } from '../db/repositories.js';
import { R2StorageAdapter } from '../adapters/storage/r2.adapter.js';
import { ParserRegistry } from '../domains/ingestion/parsers/parser.registry.js';
import { AIAdapter } from '../adapters/ai/ai.adapter.js';

/**
 * Background Ingestion Worker
 * 
 * Polls the DB (Local Dev) or is triggered by CF Queues (Prod) to process uploaded statements.
 * Implements strict error boundaries and exactly-once semantics.
 */
export class IngestionWorker {
    /**
     * Dependency Injection for all external adapters to enable pure testing.
     * Fallbacks to real production adapters if none provided.
     */
    constructor(storageAdapter, parserRegistry) {
        this.lifecycle = new JobLifecycle();
        this.storage = storageAdapter || new R2StorageAdapter();
        this.parserRegistry = parserRegistry || new ParserRegistry(new AIAdapter(process.env.GEMINI_API_KEY));
        this.isPolling = false;
    }

    /**
     * Start the local polling loop (For Local Dev / PostgreSQL queue mode)
     */
    startPolling(intervalMs = 5000) {
        if (this.isPolling) return;
        this.isPolling = true;
        console.log(`[WORKER] Started background polling for ingestion jobs every ${intervalMs}ms...`);
        
        // eslint-disable-next-line no-undef
        setInterval(async () => {
            try {
                // eslint-disable-next-line
                await this.pollOnce();
            } catch (err) {
                console.error('[WORKER] Uncaught error in polling loop:', err);
            }
        }, intervalMs);
    }

    /**
     * Attempt to claim and process exactly one job.
     */
    async pollOnce(specificJobId = null) {
        const job = await this.lifecycle.claimNext(specificJobId);
        if (!job) return; // Queue empty

        console.log(`[WORKER] Acquired Job: ${job.job_id} (Type: ${job.job_type}, Attempt: ${job.attempt + 1})`);

        try {
            // 1. Process the job (Fetch file, Parse, Store Source Records)
            await this.processJob(job);
            
            // 2. Mark Success
            await this.lifecycle.markSuccess(job.job_id);
            await AuditRepo.logEvent('INGESTION_SUCCESS', 'import_job', job.job_id, 'system_worker', { job_id: job.job_id });
            console.log(`[WORKER] Successfully completed Job: ${job.job_id}`);

        } catch (error) {
            // 3. Handle Failure Boundary
            if (error.isPermanentFailure) {
                await this.lifecycle.markDeadLetter(job.job_id, error);
            } else {
                await this.lifecycle.markFailure(job, error);
            }
            await AuditRepo.logEvent('INGESTION_FAILED', 'import_job', job.job_id, 'system_worker', { error: error.message });
        }
    }

    /**
     * Core processing logic. Throws errors on failure.
     */
    async processJob(job) {
        // 1. Download File from Storage
        let fileBuffer;
        try {
            const bucketName = process.env.R2_BUCKET_NAME || 'fincopilot-raw';
            fileBuffer = await this.storage.downloadFile(bucketName, job.file_ref);
        } catch (err) {
            console.error(`[WORKER] Failed to download ${job.file_ref}`);
            throw err; // Transient failure, will retry
        }

        // 2. Select Parser
        let parser;
        try {
            parser = this.parserRegistry.getParser(job.job_type);
        } catch (err) {
            err.isPermanentFailure = true;
            throw err;
        }

        // 3. Extract Raw Records
        let extractedRecords;
        try {
            if (job.job_type === 'csv') {
                extractedRecords = await parser.parseRawStatement(fileBuffer);
            } else {
                extractedRecords = await parser.parseRawStatement(fileBuffer.toString());
            }
        } catch (err) {
            console.error(`[WORKER] Parser failed: ${err.message}`);
            err.isPermanentFailure = true; // Malformed content is permanent
            throw err;
        }

        // 4. Persist strictly Immutable Source Records
        for (const record of extractedRecords) {
            await IngestionRepo.createSourceRecord({
                user_id: job.user_id,
                import_job_id: job.job_id,
                file_ref: job.file_ref,
                parser_used: record.parser_used || 'unknown',
                parser_version: record.parser_version || 'unknown',
                row_number: record.row_number || null,
                raw_date_text: record.raw_date_text,
                raw_description_text: record.raw_description_text,
                raw_amount_text: record.raw_amount_text,
                raw_direction_text: record.raw_direction_text,
                extraction_confidence: record.extraction_confidence || 1.0
            });
        }
    }
}
