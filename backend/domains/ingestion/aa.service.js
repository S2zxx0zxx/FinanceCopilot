import { AppError } from '../../utils/errors.js';
import { AuditRepo } from '../../db/repositories.js';

/**
 * Account Aggregator Service
 * 
 * Orchestrates the Account Aggregator consent and data retrieval flows.
 */
export class AccountAggregatorService {
    constructor(aaAdapter, consentService, dbRepository) {
        this.aaAdapter = aaAdapter;
        this.consentService = consentService;
        this.dbRepository = dbRepository;
    }

    /**
     * Initiates a consent flow with the AA network.
     */
    async initiateConsent(userId, vua) {
        if (!vua || !vua.includes('@')) {
            throw new AppError('Invalid VUA format. Must be user@fip.', 400);
        }

        try {
            // 1. Ask AA Adapter to initiate consent
            const { consentHandle, redirectUrl } = await this.aaAdapter.createConsentDetail(userId, vua, {});

            // 2. Track this pending consent in our ConsentService
            await this.consentService.trackPendingConsent(userId, 'aa_sync', consentHandle);

            // 3. Log Audit
            await AuditRepo.logEvent('AA_CONSENT_INITIATED', 'consent', consentHandle, userId, { vua });

            return { consentHandle, redirectUrl };
        } catch (error) {
            console.error('[AA Service] Failed to initiate consent:', error);
            throw new AppError('Failed to initiate Account Aggregator consent.', 500);
        }
    }

    /**
     * Handle webhook when consent status changes (e.g., ACTIVE or REVOKED).
     */
    async handleConsentWebhook(payload) {
        const { consentId, consentHandle, status } = payload;
        
        try {
            const consentRecord = await this.consentService.getConsentByHandle(consentHandle);
            if (!consentRecord) {
                console.warn(`[AA Service] Unknown consent handle: ${consentHandle}`);
                return;
            }

            if (status === 'ACTIVE') {
                await this.consentService.activateConsent(consentRecord.id, consentId);
                await AuditRepo.logEvent('AA_CONSENT_ACTIVE', 'consent', consentId, consentRecord.user_id, {});
                
                // Automatically trigger first data pull
                await this.triggerDataSync(consentRecord.user_id, consentId);
            } else if (status === 'REVOKED') {
                await this.consentService.revokeConsentById(consentRecord.id);
                await AuditRepo.logEvent('AA_CONSENT_REVOKED', 'consent', consentId, consentRecord.user_id, {});
            }
        } catch (error) {
            console.error('[AA Service] Webhook processing failed:', error);
            throw new AppError('Webhook processing failed.', 500);
        }
    }

    /**
     * Triggers a data fetch for an active consent.
     */
    async triggerDataSync(userId, consentId) {
        // 1. Request Data Session
        const { sessionId } = await this.aaAdapter.requestData(consentId, {});

        // 2. Create an Import Job for the incoming data
        const importJob = await this.dbRepository.createImportJob({
            user_id: userId,
            idempotency_key: `aa_sync_${sessionId}`,
            job_type: 'account_aggregator',
            file_ref: sessionId, // Used to map the incoming webhook data
            original_filename: `aa_sync_${new Date().toISOString()}`,
            content_type: 'application/json'
        });

        await this.dbRepository.updateImportJobStatus(importJob.job_id, 'processing');
    }

    /**
     * Handle webhook when FI Data is ready.
     */
    async handleDataWebhook(payload) {
        const { sessionId, encryptedData, dhKey } = payload;

        try {
            // Find job
            const importJob = await this.dbRepository.getJobByFileRef(sessionId);
            if (!importJob) return;

            // Decrypt data
            const decryptedPayload = await this.aaAdapter.decryptFIIData(encryptedData, dhKey);

            // Enqueue for processing
            await this.dbRepository.updateImportJobStatus(importJob.job_id, 'queued');
            
            // Assuming queueAdapter is accessible via some DI or global
            // Queue.enqueue('statement_processing_queue', { jobId: importJob.job_id, payload: decryptedPayload })
            
            await AuditRepo.logEvent('AA_DATA_RECEIVED', 'import_job', importJob.job_id, importJob.user_id, {});
        } catch (error) {
            console.error('[AA Service] Data webhook failed:', error);
            throw new AppError('Data webhook failed.', 500);
        }
    }
}
