import { AppError } from '../../utils/errors.js';
import { AuditRepo } from '../../db/repositories.js';

/**
 * Current Setu AA Gateway orchestration.
 *
 * Supports both:
 * - Auto-Fetch: Setu posts FI_DATA_READY containing decrypted FI data.
 * - Manual data sessions: Setu posts SESSION_STATUS_UPDATE and FinCopilot then
 *   GETs the session to retrieve decrypted FI data.
 */
export class AccountAggregatorService {
    constructor(aaAdapter, consentService, setuRepo, options = {}) {
        this.aaAdapter = aaAdapter;
        this.consentService = consentService;
        this.setuRepo = setuRepo;
        this.autoFetch = options.autoFetch !== false;
        this.redirectUrl = options.redirectUrl || null;
    }

    async initiateConsent(userId, vua, options = {}) {
        const normalizedVua = String(vua || '').trim();
        // Current Setu Multi-AA accepts either a mobile number or mobile@AA handle.
        if (!/^\d{10,15}(?:@[a-zA-Z0-9._-]+)?$/.test(normalizedVua)) {
            throw new AppError('VUA must be a mobile number or mobile@AA handle.', 400, false, 'INVALID_VUA');
        }

        const now = new Date();
        const from = options.from ? new Date(options.from) : new Date(now);
        if (!options.from) from.setFullYear(from.getFullYear() - 1);
        const to = options.to ? new Date(options.to) : now;
        if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) {
            throw new AppError('Invalid Account Aggregator data range.', 400, false, 'INVALID_DATA_RANGE');
        }

        try {
            const result = await this.aaAdapter.createConsentDetail(userId, normalizedVua, {
                dataRange: { from: from.toISOString(), to: to.toISOString() },
                consentDuration: options.consentDuration || { unit: 'MONTH', value: '12' },
                redirectUrl: options.redirectUrl || this.redirectUrl,
                context: options.context,
                additionalParams: options.additionalParams
            });

            await this.consentService.trackPendingConsent(userId, 'aa_sync', result.consentHandle);
            await AuditRepo.logEvent('AA_CONSENT_INITIATED', 'consent', result.consentHandle, userId, {
                provider: 'setu',
                status: result.status || 'PENDING',
                traceId: result.traceId || null
            });

            return {
                consentId: result.consentId,
                consentHandle: result.consentHandle,
                redirectUrl: result.redirectUrl,
                status: result.status
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('[AA Service] Failed to initiate consent:', error);
            throw new AppError('Failed to initiate Account Aggregator consent.', 502, true, 'AA_CONSENT_FAILED');
        }
    }

    async getConsentStatus(userId, consentId) {
        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner || owner.user_id !== userId) {
            throw new AppError('Consent not found.', 404, false, 'AA_CONSENT_NOT_FOUND');
        }
        const provider = await this.aaAdapter.checkConsentStatus(consentId);
        await this.setuRepo.updateConsentStatus(consentId, provider.status);
        return provider;
    }

    async revokeConsent(userId, consentId) {
        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner || owner.user_id !== userId) {
            throw new AppError('Consent not found.', 404, false, 'AA_CONSENT_NOT_FOUND');
        }
        const result = await this.aaAdapter.revokeConsent(consentId);
        await this.setuRepo.updateConsentStatus(consentId, 'REVOKED');
        await AuditRepo.logEvent('AA_CONSENT_REVOKED', 'consent', owner.consent_id, userId, { provider: 'setu' });
        return result;
    }

    async handleWebhook(payload) {
        const type = String(payload?.type || '');
        if (type === 'CONSENT_STATUS_UPDATE') return this.handleConsentWebhook(payload);
        if (type === 'SESSION_STATUS_UPDATE') return this.handleSessionWebhook(payload);
        if (type === 'FI_DATA_READY') return this.handleAutoFetchWebhook(payload);
        throw new AppError('Unsupported Setu notification type.', 400, false, 'SETU_WEBHOOK_TYPE_INVALID');
    }

    async handleConsentWebhook(payload) {
        const consentId = payload?.consentId;
        const status = payload?.data?.status || payload?.status;
        if (!consentId || !status) {
            throw new AppError('Malformed Setu consent notification.', 400, false, 'SETU_WEBHOOK_INVALID');
        }

        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner) {
            // A webhook must never create an uncorrelated user/consent.
            throw new AppError('Unknown Setu consent notification.', 404, false, 'SETU_CONSENT_UNKNOWN');
        }

        const updated = await this.setuRepo.updateConsentStatus(consentId, status);
        await AuditRepo.logEvent('AA_CONSENT_STATUS_UPDATE', 'consent', updated?.consent_id || owner.consent_id, owner.user_id, {
            provider: 'setu', status, notificationId: payload.notificationId || null,
            errorCode: payload?.error?.code || null
        });

        // Auto-Fetch creates/fetches sessions inside Setu. Manual mode creates
        // the initial session here after the consent becomes ACTIVE.
        if (String(status).toUpperCase() === 'ACTIVE' && !this.autoFetch) {
            await this.triggerDataSync(owner.user_id, consentId);
        }
        return { handled: true, type: 'CONSENT_STATUS_UPDATE' };
    }

    async triggerDataSync(userId, consentId, dateRange = null) {
        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner || owner.user_id !== userId) {
            throw new AppError('Consent not found.', 404, false, 'AA_CONSENT_NOT_FOUND');
        }
        if (String(owner.status).toLowerCase() !== 'active') {
            throw new AppError('Consent is not active.', 409, false, 'AA_CONSENT_NOT_ACTIVE');
        }

        const result = await this.aaAdapter.requestData(consentId, dateRange || {});
        await AuditRepo.logEvent('AA_DATA_SESSION_CREATED', 'consent', owner.consent_id, userId, {
            provider: 'setu', sessionId: result.sessionId, status: result.status
        });
        return result;
    }

    async handleSessionWebhook(payload) {
        const consentId = payload?.consentId;
        const sessionId = payload?.dataSessionId;
        const status = String(payload?.data?.status || '').toUpperCase();
        if (!consentId || !sessionId) {
            throw new AppError('Malformed Setu session notification.', 400, false, 'SETU_WEBHOOK_INVALID');
        }
        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner) throw new AppError('Unknown Setu consent.', 404, false, 'SETU_CONSENT_UNKNOWN');

        if (!['PARTIAL', 'COMPLETED'].includes(status)) {
            await AuditRepo.logEvent('AA_DATA_SESSION_STATUS', 'consent', owner.consent_id, owner.user_id, {
                provider: 'setu', sessionId, status
            });
            return { handled: true, imported: 0, status };
        }

        const session = await this.aaAdapter.fetchDataSession(sessionId);
        const imported = await this.#ingestManualSession(owner.user_id, consentId, sessionId, session);
        return { handled: true, imported, status };
    }

    async handleAutoFetchWebhook(payload) {
        const consentId = payload?.consentId;
        if (!consentId || !Array.isArray(payload?.fiData)) {
            throw new AppError('Malformed Setu Auto-Fetch notification.', 400, false, 'SETU_WEBHOOK_INVALID');
        }
        const owner = await this.setuRepo.getConsentOwner(consentId);
        if (!owner) throw new AppError('Unknown Setu consent.', 404, false, 'SETU_CONSENT_UNKNOWN');

        let recordsCreated = 0;
        for (const fip of payload.fiData) {
            const fipId = fip?.fipID || fip?.fipId || 'unknown-fip';
            const accountEntries = Array.isArray(fip?.data) ? fip.data : [];
            for (const accountEnvelope of accountEntries) {
                const result = await this.setuRepo.ingestAccountTransactions({
                    userId: owner.user_id,
                    consentId,
                    sessionId: payload.dataSessionId || null,
                    fipId,
                    accountEnvelope,
                    dataRange: payload.dataRange || null
                });
                recordsCreated += result.recordsCreated || 0;
            }
        }

        await AuditRepo.logEvent('AA_DATA_RECEIVED', 'consent', owner.consent_id, owner.user_id, {
            provider: 'setu', mode: 'auto_fetch', status: payload.status || null, recordsCreated
        });
        return { handled: true, imported: recordsCreated, status: payload.status || null };
    }

    async #ingestManualSession(userId, consentId, sessionId, session) {
        let recordsCreated = 0;
        for (const fip of session?.fips || []) {
            const fipId = fip?.fipID || fip?.fipId || 'unknown-fip';
            for (const accountEnvelope of fip?.accounts || []) {
                if (!accountEnvelope?.data) continue;
                const result = await this.setuRepo.ingestAccountTransactions({
                    userId, consentId, sessionId, fipId,
                    accountEnvelope: { ...accountEnvelope, decryptedFI: accountEnvelope.data },
                    dataRange: session?.dataRange || null
                });
                recordsCreated += result.recordsCreated || 0;
            }
        }
        await AuditRepo.logEvent('AA_DATA_RECEIVED', 'consent', (await this.setuRepo.getConsentOwner(consentId))?.consent_id, userId, {
            provider: 'setu', mode: 'manual_session', sessionId, recordsCreated
        });
        return recordsCreated;
    }
}
