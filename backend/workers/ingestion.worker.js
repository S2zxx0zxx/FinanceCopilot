import { JobLifecycle } from './job-lifecycle.js';
import { IngestionRepo, AuditRepo } from '../db/repositories.js';
import { R2StorageAdapter } from '../adapters/storage/r2.adapter.js';
import { ParserRegistry } from '../domains/ingestion/parsers/parser.registry.js';
import { AIAdapter } from '../adapters/ai/ai.adapter.js';
import { createHash } from 'node:crypto';
import { dbClient } from '../db/client.js';
import { ConsentRepo } from '../db/repositories.js';
import { ConsentService } from '../domains/consent/consent.service.js';
import { getActivePolicyVersion } from '../config/policies.js';

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
            // Source records and job completion commit together inside processJob.
            await AuditRepo.logEvent('INGESTION_SUCCESS', 'import_job', job.job_id, 'system_worker', { job_id: job.job_id });
            console.log(`[WORKER] Successfully completed Job: ${job.job_id}`);

        } catch (error) {
            // 3. Handle Failure Boundary
            await dbClient.query(`UPDATE import_jobs SET status = CASE WHEN $3 OR attempt >= max_attempts THEN 'dead_letter' ELSE 'queued' END,
                last_error = $4, next_retry_at = NOW() + INTERVAL '1 minute' * power(2, attempt),
                lease_token = NULL, lease_expires_at = NULL, updated_at = NOW()
                WHERE job_id = $1 AND lease_token = $2`, [job.job_id,job.lease_token,Boolean(error.isPermanentFailure),error.message]);
            await AuditRepo.logEvent('INGESTION_FAILED', 'import_job', job.job_id, 'system_worker', { error: error.message });
        }
    }

    /**
     * Core processing logic. Throws errors on failure.
     */
    async processJob(job) {
        const consent = new ConsentService(ConsentRepo, AuditRepo);
        for (const policy of job.job_type === 'pdf' ? ['privacy_policy','ai_processing'] : ['privacy_policy']) {
            if (!await consent.hasConsent(job.user_id,policy,getActivePolicyVersion(policy))) {
                const error = new Error(`Consent required: ${policy}`);error.isPermanentFailure=true;throw error;
            }
        }
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
        if (!job.file_checksum || createHash('sha256').update(fileBuffer).digest('hex') !== job.file_checksum) {
            const error = new Error('Uploaded file changed or was not verified. Start a new upload.');
            error.isPermanentFailure = true;
            throw error;
        }
        let parser;
        try {
            parser = this.parserRegistry.getParser(job.job_type);
        } catch (err) {
            err.isPermanentFailure = true;
            throw err;
        }

        // 3. Extract Raw Records
        // FIX (audit P0 #20): Excel/CSV parsers expect a Buffer, not a string.
        // The old code converted every non-csv upload via `fileBuffer.toString()`,
        // which corrupts binary .xlsx files. Only the PDF (LLM) parser wants
        // string input — pass Buffer for everything else.
        let extractedRecords;
        try {
            if (job.job_type === 'pdf') {
                if (fileBuffer.subarray(0,5).toString('ascii') !== '%PDF-') throw new Error('Invalid PDF file signature.');
                extractedRecords = await parser.parseRawStatement(fileBuffer);
            } else {
                extractedRecords = await parser.parseRawStatement(fileBuffer);
            }
        } catch (err) {
            console.error(`[WORKER] Parser failed: ${err.message}`);
            err.isPermanentFailure = true; // Malformed content is permanent
            throw err;
        }

        // Commit the entire parsed file under the lease fence. A stale worker cannot write.
        const client = await dbClient.connect();
        try {
            await client.query('BEGIN');
            const held = await client.query(`SELECT job_id FROM import_jobs WHERE job_id=$1 AND lease_token=$2 AND lease_expires_at > NOW() FOR UPDATE`,[job.job_id,job.lease_token]);
            if (!held.rowCount) throw new Error('Import lease expired; another worker will recover the job.');
            for (const [index, record] of extractedRecords.entries()) {
                await IngestionRepo.createSourceRecord({ ...record,
                    user_id:job.user_id,import_job_id:job.job_id,file_ref:job.file_ref,
                    parser_used:record.parser_used || 'unknown',parser_version:record.parser_version || 'unknown',
                    row_number:record.row_number ?? index+1,
                    dedupe_key:createHash('sha256').update(`${job.account_id}:${job.file_checksum}:${index}`).digest('hex'),
                    extraction_confidence:record.extraction_confidence ?? 0,
                }, client);
            }
            await client.query(`UPDATE import_jobs SET status='completed', records_total=$3, records_parsed=$3,
                completed_at=NOW(), lease_token=NULL, lease_expires_at=NULL, updated_at=NOW()
                WHERE job_id=$1 AND lease_token=$2`, [job.job_id,job.lease_token,extractedRecords.length]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally { client.release(); }
    }
}
