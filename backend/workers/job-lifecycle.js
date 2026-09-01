import { IngestionRepo } from '../db/repositories.js';

export const JOB_MAX_ATTEMPTS = 3;

/**
 * Handles the state transitions of a background job.
 * Enforces strict Idempotency and Bounded Retries (DLQ).
 */
export class JobLifecycle {
    constructor(dbRepo = IngestionRepo) {
        this.dbRepo = dbRepo;
    }

    /**
     * Atomically claims a job from the DB Queue.
     * @returns {Object|null} The claimed job or null if queue is empty.
     */
    async claimNext(specificJobId = null) {
        return await this.dbRepo.claimNextJob(specificJobId);
    }

    /**
     * Records a successful processing of the job.
     */
    async markSuccess(jobId) {
        return await this.dbRepo.updateImportJobStatus(jobId, 'completed');
    }

    /**
     * Records a failure. Automatically routes to DLQ if max retries exceeded.
     */
    async markFailure(job, error) {
        const errorMessage = error.message || 'Unknown processing error';
        console.error(`[WORKER] Job ${job.job_id} failed on attempt ${job.attempt + 1}: ${errorMessage}`);
        
        return await this.dbRepo.markJobFailed(
            job.job_id, 
            errorMessage, 
            job.attempt, 
            JOB_MAX_ATTEMPTS
        );
    }

    /**
     * Explicitly forces a job to the DLQ (e.g., for non-retryable errors like Malformed PDF)
     */
    async markDeadLetter(jobId, error) {
        const errorMessage = error.message || 'Permanent failure';
        console.error(`[WORKER] Job ${jobId} sent to DLQ (Permanent Failure): ${errorMessage}`);
        return await this.dbRepo.markJobDeadLetter(jobId, errorMessage);
    }
}
