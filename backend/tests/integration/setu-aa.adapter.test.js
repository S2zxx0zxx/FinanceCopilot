import test from 'node:test';
import assert from 'node:assert/strict';
import { AccountAggregatorAdapter } from '../../adapters/account-aggregator/account-aggregator.adapter.js';

function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

test('Setu adapter obtains OAuth token and creates consent with provider headers', async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url, init = {}) => {
        calls.push({ url: String(url), init });
        if (String(url).includes('/api/v2/auth/token')) {
            return jsonResponse(200, { status: 200, success: true, data: { token: 'sandbox-token', expiresIn: 1800 } });
        }
        return jsonResponse(200, {
            id: '11111111-1111-4111-8111-111111111111',
            url: 'https://fiu-sandbox.setu.co/v2/consents/webview/11111111-1111-4111-8111-111111111111',
            status: 'PENDING',
            traceId: 'trace-1'
        });
    };

    try {
        const adapter = new AccountAggregatorAdapter({
            baseUrl: 'https://fiu-sandbox.setu.co',
            authUrl: 'https://uat.setu.co/api/v2/auth/token',
            clientId: 'client-id',
            clientSecret: 'client-secret',
            productInstanceId: 'product-id'
        });

        const result = await adapter.createConsentDetail('user-1', '9999999999', {
            dataRange: { from: '2026-01-01T00:00:00.000Z', to: '2026-09-01T00:00:00.000Z' },
            redirectUrl: 'https://app.example.com/accounts/connect/callback'
        });

        assert.equal(result.status, 'PENDING');
        assert.equal(result.consentId, '11111111-1111-4111-8111-111111111111');
        assert.equal(calls.length, 2);
        assert.equal(calls[0].url, 'https://uat.setu.co/api/v2/auth/token');
        assert.equal(calls[1].url, 'https://fiu-sandbox.setu.co/v2/consents');
        assert.equal(calls[1].init.headers.Authorization, 'Bearer sandbox-token');
        assert.equal(calls[1].init.headers['x-product-instance-id'], 'product-id');

        const body = JSON.parse(calls[1].init.body);
        assert.equal(body.vua, '9999999999');
        assert.equal(body.redirectUrl, 'https://app.example.com/accounts/connect/callback');
        assert.deepEqual(body.dataRange, {
            from: '2026-01-01T00:00:00.000Z',
            to: '2026-09-01T00:00:00.000Z'
        });
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('Setu adapter reuses a non-expired OAuth token', async () => {
    const originalFetch = globalThis.fetch;
    let authCalls = 0;
    let apiCalls = 0;
    globalThis.fetch = async (url) => {
        if (String(url).includes('/api/v2/auth/token')) {
            authCalls += 1;
            return jsonResponse(200, { data: { token: 'cached-token', expiresIn: 1800 } });
        }
        apiCalls += 1;
        return jsonResponse(200, { id: 'session-1', status: 'PENDING', consentId: 'consent-1' });
    };

    try {
        const adapter = new AccountAggregatorAdapter({
            baseUrl: 'https://fiu-sandbox.setu.co',
            authUrl: 'https://uat.setu.co/api/v2/auth/token',
            clientId: 'client-id',
            clientSecret: 'client-secret',
            productInstanceId: 'product-id'
        });
        await adapter.requestData('consent-1', {});
        await adapter.requestData('consent-1', {});
        assert.equal(authCalls, 1);
        assert.equal(apiCalls, 2);
    } finally {
        globalThis.fetch = originalFetch;
    }
});
