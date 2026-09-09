import { AppError } from '../../utils/errors.js';

/**
 * Setu Account Aggregator Gateway adapter.
 *
 * Current Setu AA Gateway contract:
 * - Sandbox API: https://fiu-sandbox.setu.co
 * - Production API: https://fiu.setu.co
 * - OAuth token is generated with a Bridge OAuth clientID/secret.
 * - API calls use Authorization: Bearer <token> + x-product-instance-id.
 * - FI data returned by Setu is already decrypted; FinCopilot must NOT
 *   implement legacy AA ECDH decryption for the current Gateway API.
 */
export class AccountAggregatorAdapter {
    constructor(config = {}) {
        this.baseUrl = String(config.baseUrl || 'https://fiu-sandbox.setu.co').replace(/\/$/, '');
        this.authUrl = config.authUrl || 'https://uat.setu.co/api/v2/auth/token';
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.productInstanceId = config.productInstanceId;
        this.staticAccessToken = config.accessToken || null;
        this.apiPrefix = String(config.apiPrefix || '/v2').replace(/\/$/, '');

        this.cachedToken = null;
        this.tokenExpiresAt = 0;
    }

    isConfigured() {
        return Boolean(
            this.productInstanceId &&
            (this.staticAccessToken || (this.clientId && this.clientSecret))
        );
    }

    async #getAccessToken(forceRefresh = false) {
        if (this.staticAccessToken) return this.staticAccessToken;

        const now = Date.now();
        // Refresh one minute before expiry.
        if (!forceRefresh && this.cachedToken && now < this.tokenExpiresAt - 60_000) {
            return this.cachedToken;
        }

        if (!this.clientId || !this.clientSecret) {
            throw new AppError('Setu OAuth credentials are not configured.', 503, true, 'SETU_NOT_CONFIGURED');
        }

        const response = await fetch(this.authUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientID: this.clientId, secret: this.clientSecret })
        });

        const body = await this.#readJson(response);
        if (!response.ok) {
            throw new AppError(
                `Setu OAuth token request failed (${response.status}).`,
                502,
                true,
                'SETU_AUTH_ERROR',
                { providerStatus: response.status, providerError: body?.errorCode || body?.errorMsg || null }
            );
        }

        const token = body?.data?.token || body?.token || body?.access_token;
        const expiresInSeconds = Number(body?.data?.expiresIn || body?.expiresIn || body?.expires_in || 1800);
        if (!token) {
            throw new AppError('Setu OAuth response did not contain an access token.', 502, true, 'SETU_AUTH_FORMAT_ERROR');
        }

        this.cachedToken = token;
        this.tokenExpiresAt = now + Math.max(60, expiresInSeconds) * 1000;
        return token;
    }

    async #readJson(response) {
        const text = await response.text();
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch {
            return { raw: text.slice(0, 500) };
        }
    }

    #path(pathname) {
        const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
        if (path.startsWith('/v2/')) return `${this.baseUrl}${path}`;
        return `${this.baseUrl}${this.apiPrefix}${path}`;
    }

    async #request(pathname, { method = 'GET', body, retryAuth = true } = {}) {
        if (!this.isConfigured()) {
            throw new AppError('Setu Account Aggregator is not configured.', 503, true, 'SETU_NOT_CONFIGURED');
        }

        const token = await this.#getAccessToken(false);
        const response = await fetch(this.#path(pathname), {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-product-instance-id': this.productInstanceId
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });

        if (response.status === 401 && retryAuth && !this.staticAccessToken) {
            await this.#getAccessToken(true);
            return this.#request(pathname, { method, body, retryAuth: false });
        }

        const data = await this.#readJson(response);
        if (!response.ok) {
            throw new AppError(
                `Setu AA request failed (${response.status}).`,
                response.status >= 500 ? 502 : response.status,
                true,
                'SETU_API_ERROR',
                {
                    providerStatus: response.status,
                    providerError: data?.errorCode || data?.errorMsg || data?.error?.code || null,
                    traceId: data?.traceId || null
                }
            );
        }

        return data;
    }

    /** Create a Setu consent and return FinCopilot's canonical shape. */
    async createConsentDetail(_userId, vua, templateParams = {}) {
        const now = new Date();
        const defaultFrom = new Date(now);
        defaultFrom.setFullYear(defaultFrom.getFullYear() - 1);

        const dataRange = templateParams.dataRange || {
            from: defaultFrom.toISOString(),
            to: now.toISOString()
        };

        const body = {
            consentDuration: templateParams.consentDuration || { unit: 'MONTH', value: '12' },
            vua,
            dataRange,
            redirectUrl: templateParams.redirectUrl,
            context: templateParams.context || [
                { key: 'accountSelectionMode', value: 'multi' },
                { key: 'purposeCode', value: '102' }
            ]
        };

        if (!body.redirectUrl) delete body.redirectUrl;
        if (templateParams.additionalParams) body.additionalParams = templateParams.additionalParams;

        const data = await this.#request('/consents', { method: 'POST', body });
        if (!data?.id || !data?.url) {
            throw new AppError('Setu consent response is missing id/url.', 502, true, 'SETU_CONSENT_FORMAT_ERROR');
        }

        return {
            consentHandle: data.id,
            consentId: data.id,
            redirectUrl: data.url,
            status: data.status,
            traceId: data.traceId || null,
            detail: data.detail || null
        };
    }

    async checkConsentStatus(consentId) {
        return this.#request(`/consents/${encodeURIComponent(consentId)}?expanded=true`);
    }

    async revokeConsent(consentId) {
        return this.#request(`/consents/${encodeURIComponent(consentId)}/revoke`, { method: 'POST' });
    }

    async requestData(consentId, dateRange = {}) {
        const body = {
            consentId,
            dataRange: dateRange?.from && dateRange?.to ? dateRange : undefined,
            format: 'json'
        };
        if (!body.dataRange) delete body.dataRange;

        const data = await this.#request('/sessions', { method: 'POST', body });
        if (!data?.id) {
            throw new AppError('Setu data-session response is missing id.', 502, true, 'SETU_SESSION_FORMAT_ERROR');
        }
        return {
            sessionId: data.id,
            status: data.status,
            consentId: data.consentId || consentId,
            dataRange: data.dataRange || null,
            traceId: data.traceId || null
        };
    }

    async fetchDataSession(sessionId) {
        return this.#request(`/sessions/${encodeURIComponent(sessionId)}`);
    }

    async getDataSessions(consentId) {
        return this.#request(`/consents/${encodeURIComponent(consentId)}/data-sessions`);
    }

    async getLastFetchStatus(consentId) {
        return this.#request(`/consents/${encodeURIComponent(consentId)}/fetch/status`);
    }
}
