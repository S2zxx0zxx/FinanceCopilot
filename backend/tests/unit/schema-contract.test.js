import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const SQL = readFileSync(new URL('../../../backend/db/migrations/001_initial_schema.sql', import.meta.url), 'utf8');

function extractColumns(table) {
  const m = SQL.match(new RegExp(`CREATE TABLE ${table} \\([\\s\\S]*?\\n\\);`));
  if (!m) throw new Error(`table ${table} missing`);
  return m[0].split('\n').map((l) => l.trim().match(/^([a-z_]+)\s+(TEXT|UUID|BOOLEAN|TIMESTAMPTZ|INTEGER|BIGINT)/i)?.[1]).filter(Boolean);
}

test('P0-B1/F-B1: users table matches canonical domain contract exactly', () => {
  const cols = extractColumns('users').sort();
  assert.deepEqual(cols, ['created_at','currency','deleted_at','display_name','firebase_uid','is_active','is_deleted','email','locale','onboarding_done','onboarding_step','phone_number','timezone','updated_at','user_id'].sort());
});

test('canonical key is firebase_uid with unique constraint', () => {
  assert.match(SQL, /UNIQUE \(firebase_uid\)/);
  assert.doesNotMatch(SQL, /provider_uid/);   // ghost column from v1 must stay dead
  assert.match(SQL, /idx_users_firebase_uid/);
});

test('consent_records: consented present, ip stored as ip_hash only', () => {
  assert.ok(extractColumns('consent_records').includes('consented'));
  assert.ok(extractColumns('consent_records').includes('ip_hash'));
  assert.doesNotMatch(SQL, /ip_address\s+VARCHAR/);
});

test('money rule example integrity (ADR-003): BIGINT paise only in foundation tables', () => {
  // no authoritative money columns here yet — guard against float creeping in
  assert.doesNotMatch(SQL, /(FLOAT|DOUBLE|REAL|DECIMAL|NUMERIC)/i);
});
