/**
 * Ingestion Controller
 * 
 * Exposes API endpoints for the ingestion lifecycle.
 */
export class IngestionController {
    constructor(ingestionService) {
        this.ingestionService = ingestionService;
    }

    /**
     * HTTP POST /api/v1/import/upload-intent
     * Body: { fileName: "statement.pdf", mimeType: "application/pdf" }
     */
    async initiateUpload(req, res) {
        try {
            const userId = req.user.userId; // From requireAuth middleware
            const { fileName, mimeType, correlationId } = req.body;

            if (!fileName || !mimeType) {
                return res.status(400).json({ error: 'fileName and mimeType are required.' });
            }

            const intent = await this.ingestionService.initiateUpload(userId, fileName, mimeType, correlationId);

            return res.status(201).json({
                message: 'Upload intent created. Use the upload_url to PUT the file.',
                job_id: intent.job_id,
                upload_url: intent.upload_url,
                storage_key: intent.storage_key,
                expires_in: intent.expires_in
            });

        } catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({ error: error.message });
        }
    }

    /**
     * HTTP POST /api/v1/import/confirm
     * Body: { job_id: "uuid", storage_key: "string" }
     */
    async confirmUpload(req, res) {
        try {
            const userId = req.user.userId;
            const { job_id, storage_key, checksum } = req.body;

            if (!job_id || !storage_key) {
                return res.status(400).json({ error: 'job_id and storage_key are required.' });
            }

            const result = await this.ingestionService.confirmUpload(userId, job_id, storage_key, checksum);

            return res.status(202).json({
                message: 'File processing queued successfully.',
                status: result.status
            });

        } catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({ error: error.message });
        }
    }

    /**
     * HTTP POST /api/v1/import/replay/:job_id
     * Re-queues a failed or dead-lettered job.
     */
    async replayJob(req, res) {
        try {
            const { job_id } = req.params;
            
            // In a real implementation we would check if the job belongs to req.user.userId
            const IngestionRepo = (await import('../../db/repositories.js')).IngestionRepo;
            const updatedJob = await IngestionRepo.requestJobReplay(job_id);

            if (!updatedJob) {
                return res.status(404).json({ error: 'Job not found.' });
            }

            return res.status(200).json({
                message: 'Job replay requested successfully.',
                job_id: updatedJob.job_id,
                status: updatedJob.status
            });
        } catch (error) {
            console.error('[INGESTION] Failed to replay job:', error);
            return res.status(500).json({ error: 'Internal server error during replay.' });
        }
    }
}
