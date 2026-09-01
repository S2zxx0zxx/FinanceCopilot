import test from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { SessionService } from '../domains/auth/session.service.js';
import { ConsentService } from '../domains/consent/consent.service.js';
import { ConsentRepo, AuditRepo } from '../db/repositories.js';
import { UnauthorizedError } from '../utils/errors.js';
import { requireAuth, requireOwnership, apiRateLimiter } from '../api/middlewares/security.js';

test('PHASE 1 - AUTO CLOSURE TEST SUITE', async (t) => {
    
    await t.test('1. Database Connection & Pooling', async () => {
        try {
            await dbClient.connect();
            const res = await dbClient.query('SELECT 1 AS connected');
            assert.strictEqual(res.rows[0].connected, 1, 'DB failed to return 1');
        } catch (e) {
            assert.fail(`DB Connection Failed: ${e.message}`);
        }
    });

    await t.test('2. Authentication Security Middleware', async () => {
        const req1 = { headers: {} };
        requireAuth(req1, null, (err) => assert.ok(err instanceof UnauthorizedError));

        const req2 = { headers: { authorization: 'Bearer ' } };
        requireAuth(req2, null, (err) => assert.ok(err instanceof UnauthorizedError));
    });

    await t.test('3. Session Lifecycle Strictness', async () => {
        const sessionSvc = new SessionService({ isSessionRevoked: async () => false });

        await assert.doesNotReject(async () => {
            await sessionSvc.validateSession({ sub: 'user_1', sid: 'sess_1', exp: Math.floor(Date.now() / 1000) + 1000 });
        });

        await assert.rejects(async () => {
            await sessionSvc.validateSession({ sub: 'user_1', exp: Math.floor(Date.now() / 1000) - 1000 });
        }, UnauthorizedError);
    });

    await t.test('4. Authorization / Tenant Isolation', async () => {
        requireOwnership({ params: { id: 'user_1' } }, null, (err) => assert.ok(err instanceof UnauthorizedError));
        requireOwnership({ user: { id: 'user_2' }, params: { id: 'user_1' } }, null, (err) => assert.strictEqual(err.statusCode, 403));
        
        let called = false;
        requireOwnership({ user: { id: 'user_1' }, params: { id: 'user_1' } }, null, (err) => {
            assert.ifError(err);
            called = true;
        });
        assert.ok(called);
    });

    await t.test('5. Consent & Audit Real Implementation', async () => {
        const consentSvc = new ConsentService(ConsentRepo, AuditRepo, { CONSENT_HASH_SALT: 'test_salt' });
        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ($1) RETURNING user_id`, [`firebase_uid_${Date.now()}`]);
        const testUser = userRes.rows[0].user_id;
        const policyId = 'TERMS_OF_SERVICE';

        // Initial state: no consent
        const hasConsentInit = await consentSvc.hasConsent(testUser, policyId, '2024-01-01');
        assert.strictEqual(hasConsentInit, false, 'Should default to deny (no consent)');

        // Grant consent
        const granted = await consentSvc.recordConsent(testUser, policyId, '2024-01-01', { ip_address: '127.0.0.1' });
        assert.ok(granted.consent_id, 'Consent must be persisted with an ID');
        
        // Verify valid consent
        const hasConsentNow = await consentSvc.hasConsent(testUser, policyId, '2024-01-01');
        assert.strictEqual(hasConsentNow, true, 'Should allow after grant');

        // Revoke consent
        await consentSvc.revokeConsent(testUser, policyId, 'User deleted account');
        
        // Verify revoked consent
        const hasConsentAfterRevoke = await consentSvc.hasConsent(testUser, policyId, '2024-01-01');
        assert.strictEqual(hasConsentAfterRevoke, false, 'Should deny after revocation');

        // Test Policy Version mismatch
        await consentSvc.recordConsent(testUser, policyId, '2024-01-01', { ip_address: '127.0.0.1' });
        const hasOutdatedConsent = await consentSvc.hasConsent(testUser, policyId, '2025-01-01');
        assert.strictEqual(hasOutdatedConsent, false, 'Should deny if required version is strictly newer');
    });

    await t.test('6. API Smoke Test (Middleware)', async () => {
        assert.strictEqual(typeof apiRateLimiter, 'function', 'apiRateLimiter must be an active middleware');
    });
});
