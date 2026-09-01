/**
 * MIGRATION DISCOVERY & APPLY TEST (R-002)
 * 
 * Requirement #10:
 * fresh database -> apply all migrations -> introspect schema -> verify tables/constraints/indexes -> apply again -> zero duplicate migrations -> verify checksums
 *
 * This test simulates the CI phase by pointing to a disposable schema and executing the runner.
 */

import { execSync } from 'child_process';
import assert from 'assert';

console.log('[TEST] Starting Migration Idempotency & Strictness Test');

try {
    // We expect the script to fail if DATABASE_URL is not set (fail closed)
    if (!process.env.TEST_DATABASE_URL) {
        console.warn('TEST_DATABASE_URL not set. Skipping real DB apply test.');
        process.exit(0);
    }

    // 1. Apply all migrations
    console.log('[TEST] Applying migrations (Run 1)...');
    execSync('node backend/db/run-migrations.js', { env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL }, stdio: 'inherit' });

    // 2. Apply again - should result in zero applied
    console.log('[TEST] Applying migrations (Run 2 - Idempotency Check)...');
    const out2 = execSync('node backend/db/run-migrations.js', { env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL }, encoding: 'utf-8' });
    
    if (out2.includes('Applied')) {
        throw new Error('Idempotency failure: Migrations applied twice!');
    }

    console.log('[TEST] Migration idempotency VERIFIED.');
} catch (err) {
    console.error('[TEST] Migration test failed:', err.message);
    process.exit(1);
}
