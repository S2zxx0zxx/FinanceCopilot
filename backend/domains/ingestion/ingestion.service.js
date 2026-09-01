import { AppError } from '../../utils/errors.js';
import { AuditRepo } from '../../db/repositories.js';

/**
 * Ingestion Service
 * 
 * Manages the secure intent to upload bank statements.
 * Generates presigned URLs, creates DB jobs, and safely passes references to the Queue.
 */
export class IngestionService {
    constructor(storageAdapter, queueAdapter, dbRepository) {
        this.storageAdapter = storageAdapter;
        this.queueAdapter = queueAdapter;
        this.dbRepository = dbRepository;
    }

    /**
     * Initializes the upload process by issuing a Presigned URL.
     * The client will use this URL to upload directly to R2.
     */
    async initiateUpload(userId, fileName, mimeType, correlationId = null) {
        // 1. Strict Validation
        this.validateFileType(mimeType, fileName);

        // 2. Generate Deterministic Key
        const timestamp = Date.now();
        const idempotencyKey = `upload_${userId}_${timestamp}`;
        const secureKey = `statements/${userId}/${timestamp}_${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const bucketName = process.env.R2_BUCKET_NAME || 'fincopilot-raw';

        try {
            // 3. Persist the Intent / Job State FIRST
            // Determines job_type based on mimeType
            let jobType = 'unknown';
            if (mimeType === 'application/pdf') jobType = 'pdf';
            if (mimeType === 'text/csv') jobType = 'csv';
            if (mimeType === 'application/vnd.ms-excel' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                jobType = 'excel';
            }

            const importJob = await this.dbRepository.createImportJob({
                user_id: userId,
                idempotency_key: idempotencyKey,
                job_type: jobType,
                file_ref: secureKey,
                original_filename: fileName,
                content_type: mimeType,
                correlation_id: correlationId
            });

            await AuditRepo.logEvent('UPLOAD_INITIATED', 'import_job', importJob.job_id, userId, {
                file_name: fileName,
                job_type: jobType,
                correlation_id: correlationId
            });

            // 4. Generate Presigned URL
            const uploadUrl = await this.storageAdapter.getSignedUploadUrl(bucketName, secureKey, mimeType, 300);

            // Return the URL and Job ID so the client can upload and poll status
            return {
                job_id: importJob.job_id,
                upload_url: uploadUrl,
                storage_key: secureKey,
                expires_in: 300
            };
        } catch (error) {
            console.error('[INGESTION] Failed to initiate upload:', error);
            throw new AppError('Could not initialize upload process.', 500);
        }
    }

    /**
     * Called by the client or webhook AFTER the upload to R2 is complete.
     */
    async confirmUpload(userId, jobId, storageKey, checksum = null) {
        // Strict Security Check: Does this job belong to this user?
        const checkOwnership = await this.dbRepository.getImportJob(jobId);
        if (!checkOwnership || checkOwnership.user_id !== userId) {
            throw new AppError('Unauthorized access to this import job.', 403);
        }

        if (checksum) {
            await this.dbRepository.updateImportJobChecksum(jobId, checksum);
        }

        // Here we enqueue the job for the worker to start parsing
        await this.queueAdapter.enqueue('statement_processing_queue', {
            jobId: jobId,
            userId: userId,
            storageKey: storageKey
        });

        await this.dbRepository.updateImportJobStatus(jobId, 'queued');

        await AuditRepo.logEvent('UPLOAD_CONFIRMED', 'import_job', jobId, userId, {
            storage_key: storageKey,
            checksum: checksum,
            correlation_id: checkOwnership.correlation_id
        });

        return { status: 'queued' };
    }

    validateFileType(mimeType, _fileName) {
        const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(mimeType)) {
            throw new AppError('Invalid file type. Only PDF, CSV, and Excel are allowed.', 400);
        }
    }
}
