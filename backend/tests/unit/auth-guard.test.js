import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FirebaseAuthAdapter } from '../../adapters/auth/firebase.adapter.js';

test('INV-SEC-001: mock auth throws in production', () => {
  assert.throws(() => new FirebaseAuthAdapter({ NODE_ENV: 'production', AUTH_MODE: 'mock' }),
    /forbidden when NODE_ENV=production/);
});

test('fail-closed: unconfigured adapter rejects every token', async () => {
  const a = new FirebaseAuthAdapter({ NODE_ENV: 'development', AUTH_MODE: 'unconfigured' });
  await assert.rejects(a.verifyToken('anything_longer_than_8_chars'), /Invalid Firebase token/);
});

test('dev-mock: deterministic hashed uid, shape enforced', async () => {
  const a = new FirebaseAuthAdapter({ NODE_ENV: 'development', AUTH_MODE: 'mock' });
  const r1 = await a.verifyToken('dev-token-abcdef');
  const r2 = await a.verifyToken('dev-token-abcdef');
  assert.equal(r1.uid, r2.uid);
  assert.ok(r1.uid.startsWith('mock_') && r1.mock === true);
  await assert.rejects(a.verifyToken('short'), /TOKEN_INVALID/);
});

test('revoke/delete return explicit MOCKED_SUCCESS in mock mode', async () => {
  const a = new FirebaseAuthAdapter({ NODE_ENV: 'development', AUTH_MODE: 'mock' });
  assert.equal((await a.revokeSessions('user-1')).status, 'MOCKED_SUCCESS');
  assert.equal((await a.deleteUser('user-1')).status, 'MOCKED_SUCCESS');
});
