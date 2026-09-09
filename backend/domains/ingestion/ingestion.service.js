import { AppError } from '../../utils/errors.js';
import { AuditRepo } from '../../db/repositories.js';
import { randomUUID, createHash } from 'node:crypto';

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
    async initiateUpload(userId, fileName, mimeType, correlationId = null, accountId = null) {
        // 1. Strict Validation
        this.validateFileType(mimeType, fileName);
        if (typeof fileName !== 'string' || fileName.length > 255) throw new AppError('Invalid filename', 400);
        if (!accountId || !await this.dbRepository.getOwnedImportAccount(userId, accountId)) throw new AppError('Select an active account you own.', 422);

        // 2. Generate Deterministic Key
        const timestamp = randomUUID();
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
                ,account_id: accountId
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
        if (checkOwnership.file_ref !== storageKey) throw new AppError('Storage key does not match this upload.', 400);
        if (checkOwnership.status !== 'received') return { status: checkOwnership.status };
        const contents = await this.storageAdapter.downloadFile(process.env.R2_BUCKET_NAME || 'fincopilot-raw', storageKey);
        if (!contents.length || contents.length > 10 * 1024 * 1024) throw new AppError('Statement must be between 1 byte and 10 MB.', 422);
        const verifiedChecksum = createHash('sha256').update(contents).digest('hex');
        if (checksum && checksum !== verifiedChecksum) throw new AppError('Statement checksum mismatch.', 422);
        const confirmed = await this.dbRepository.confirmImportJob(userId, jobId, verifiedChecksum);
        return { status: confirmed?.status || (await this.dbRepository.getImportJob(jobId)).status };
    }

    validateFileType(mimeType, _fileName) {
        const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(mimeType)) {
            throw new AppError('Invalid file type. Only PDF, CSV, and Excel are allowed.', 400);
        }
    }
}
