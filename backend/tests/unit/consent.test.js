import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConsentService, isVersionAtLeast } from '../../domains/consent/consent.service.js';
import { hashIdentifier } from '../../domains/identity/identity.service.js';

const fakeRepo = (() => {
  let latest = null;
  return {
    async saveConsent(row) { latest = { consent_id: 'c1', ...row, revoked_at: null }; return latest; },
    async getLatestConsent() { return latest; },
    async revokeConsent(_uid, _type, ts) { if (latest) latest.revoked_at = ts; return latest; },
  };
})();

function service() {
  const audit = [];
  const svc = new ConsentService(fakeRepo, { logEvent: async (eventType, entityType, entityId, actor, metadata) => audit.push({ event_type: eventType, entity_type: entityType, entity_id: entityId, actor, metadata }) }, {});
  return { svc, audit };
}

test('P0-B4: semantic version comparison (date-based, not naive string)', async () => {
  assert.equal(isVersionAtLeast('2026-08-23', '2024-01-01'), true);
  assert.equal(isVersionAtLeast('2023-12-31', '2024-01-01'), false);
  assert.throws(() => isVersionAtLeast('v2', '2024-01-01'), /must be YYYY-MM-DD/);
});

test('IP is stored hashed, never raw', async () => {
  const { svc } = service();
  const row = await svc.recordConsent('u1', 'privacy_policy', '2026-08-23', { ip_address: '203.0.113.9' });
  assert.ok(!JSON.stringify(row).includes('203.0.113.9'));
  assert.match(String(row.ip_hash), /^[a-f0-9]{64}$/);
});

test('hasConsent uses effective-date semantics + revocation', async () => {
  const { svc } = service();
  await svc.recordConsent('u1', 'privacy_policy', '2026-01-01', {});
  assert.equal(await svc.hasConsent('u1', 'privacy_policy', '2024-01-01'), true);
  assert.equal(await svc.hasConsent('u1', 'privacy_policy', '2027-01-01'), false); // future required version
  await svc.revokeConsent('u1', 'privacy_policy');
  assert.equal(await svc.hasConsent('u1', 'privacy_policy', '2024-01-01'), false); // INV-SEC-008
});

test('grant and revoke emit audit events (INV-002)', async () => {
  const { svc, audit } = service();
  await svc.recordConsent('u1', 'terms', '2026-01-01', {});
  await svc.revokeConsent('u1', 'terms');
  assert.deepEqual(audit.map((e) => e.metadata.action), ['grant', 'revoke']);
});

test('hashIdentifier deterministic + salted', () => {
  assert.equal(hashIdentifier('x', 's'), hashIdentifier('x', 's'));
  assert.notEqual(hashIdentifier('x', 's1'), hashIdentifier('x', 's2'));
});
