import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { ReconciliationWorker } from '../workers/reconciliation.worker.js';

describe('PHASE 4 - RECONCILIATION INTEGRATION & FINANCE REGRESSION', () => {

    const tenantA = '550e8400-e29b-41d4-a716-446655440000'; // Fake UUIDs for testing
    const tenantB = '660e8400-e29b-41d4-a716-446655441111';

    before(async () => {
        // Setup: Clean up testing state if necessary
        // In a real isolated DB, we'd truncate tables. For this, we'll just insert new mock records.

        // 1. Create mock users
        await dbClient.query(`
            INSERT INTO users (user_id, firebase_uid, email, is_active)
            VALUES ($1, 'firebase-test-A', 'tenantA@test.com', true),
                   ($2, 'firebase-test-B', 'tenantB@test.com', true)
            ON CONFLICT DO NOTHING;
        `, [tenantA, tenantB]);

        // 2. Create real financial_accounts (needed for transfer engine - account_id is UUID FK)
        const accRes1 = await dbClient.query(`
            INSERT INTO financial_accounts (user_id, account_type, institution_name, currency, is_active)
            VALUES ($1, 'savings', 'Test Bank A1', 'INR', true) RETURNING account_id;
        `, [tenantA]);
        const accId1 = accRes1.rows[0].account_id;

        const accRes2 = await dbClient.query(`
            INSERT INTO financial_accounts (user_id, account_type, institution_name, currency, is_active)
            VALUES ($1, 'savings', 'Test Bank A2', 'INR', true) RETURNING account_id;
        `, [tenantA]);
        const accId2 = accRes2.rows[0].account_id;

        // 3. Insert mock import jobs
        const jobResA = await dbClient.query(`
            INSERT INTO import_jobs (user_id, idempotency_key, job_type, file_ref, status)
            VALUES ($1, 'test-job-A', 'csv', 'test.csv', 'completed') RETURNING job_id;
        `, [tenantA]);
        const jobIdA = jobResA.rows[0].job_id;

        const jobResB = await dbClient.query(`
            INSERT INTO import_jobs (user_id, idempotency_key, job_type, file_ref, status)
            VALUES ($1, 'test-job-B', 'csv', 'test.csv', 'completed') RETURNING job_id;
        `, [tenantB]);
        const jobIdB = jobResB.rows[0].job_id;

        // 3. Insert Mock Transactions for Tenant A (Duplicates & Transfers)
        // Note: The schema requires source_record_id etc, we will mock minimal data
        
        // Setup mock source records for FK constraints
        const srResA = await dbClient.query(`
            INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_merchant_text, status)
            VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0', 'test', 'normalized') RETURNING source_record_id;
        `, [tenantA, jobIdA]);
        const srIdA = srResA.rows[0].source_record_id;

        const srResB = await dbClient.query(`
            INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_merchant_text, status)
            VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0', 'test', 'normalized') RETURNING source_record_id;
        `, [tenantB, jobIdB]);
        const srIdB = srResB.rows[0].source_record_id;

        // Insert duplicate pair
        const dup1Res = await dbClient.query(`
            INSERT INTO transactions (user_id, source_record_id, amount_paise, direction, currency, merchant_raw, merchant_normalized, observed_at, reference_id, normalization_version, is_manual)
            VALUES ($1, $2, 50000, 'debit', 'INR', 'amazon', 'amazon', '2026-05-01T10:00:00Z', 'ref-123', 'v1', false)
            RETURNING transaction_id;
        `, [tenantA, srIdA]);

        // Ensure unique source_record_id for second transaction
        const srResA2 = await dbClient.query(`INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_merchant_text, status) VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0', 'test', 'normalized') RETURNING source_record_id;`, [tenantA, jobIdA]);
        const dup2Res = await dbClient.query(`
            INSERT INTO transactions (user_id, source_record_id, amount_paise, direction, currency, merchant_raw, merchant_normalized, observed_at, reference_id, normalization_version, is_manual)
            VALUES ($1, $2, 50000, 'debit', 'INR', 'amazon', 'amazon', '2026-05-01T10:00:00Z', 'ref-123', 'v1', false)
            RETURNING transaction_id;
        `, [tenantA, srResA2.rows[0].source_record_id]);

        // Insert Transfer pair
        const srResA3 = await dbClient.query(`INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_merchant_text, status) VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0', 'test', 'normalized') RETURNING source_record_id;`, [tenantA, jobIdA]);
        const srResA4 = await dbClient.query(`INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_merchant_text, status) VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0', 'test', 'normalized') RETURNING source_record_id;`, [tenantA, jobIdA]);

        const tOutRes = await dbClient.query(`
            INSERT INTO transactions
                (user_id, source_record_id, account_id, amount_paise, direction,
                 currency, merchant_raw, merchant_normalized, observed_at,
                 normalization_version, is_manual)
            VALUES ($1, $2, $3, 1000000, 'debit', 'INR',
                    'TRANSFER OUT', 'transfer', '2026-05-01T10:00:00Z', 'v1', false)
            RETURNING transaction_id;
        `, [tenantA, srResA3.rows[0].source_record_id, accId1]);

        const tInRes = await dbClient.query(`
            INSERT INTO transactions
                (user_id, source_record_id, account_id, amount_paise, direction,
                 currency, merchant_raw, merchant_normalized, observed_at,
                 normalization_version, is_manual)
            VALUES ($1, $2, $3, 1000000, 'credit', 'INR',
                    'TRANSFER IN', 'transfer', '2026-05-01T14:00:00Z', 'v1', false)
            RETURNING transaction_id;
        `, [tenantA, srResA4.rows[0].source_record_id, accId2]);

        // Insert Tenant B isolated transaction (should never match with A)
        const tBRes = await dbClient.query(`
            INSERT INTO transactions (user_id, source_record_id, amount_paise, direction, currency, merchant_raw, merchant_normalized, observed_at, reference_id, normalization_version, is_manual)
            VALUES ($1, $2, 50000, 'debit', 'INR', 'amazon', 'amazon', '2026-05-01T10:00:00Z', 'ref-123', 'v1', false)
            RETURNING transaction_id;
        `, [tenantB, srIdB]);
    });

    after(async () => {
        // Cleanup all mock data
        await dbClient.query(`DELETE FROM audit_events WHERE actor IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM review_items WHERE tenant_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM transaction_relationships WHERE tenant_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM reconciliation_runs WHERE tenant_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM transactions WHERE user_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM source_records WHERE user_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM financial_accounts WHERE user_id IN ($1, $2);`, [tenantA, tenantB]);
        await dbClient.query(`DELETE FROM users WHERE user_id IN ($1, $2);`, [tenantA, tenantB]);
    });

    it('Should successfully run worker and persist real relationships (DB INTEGRATION)', async () => {
        const result = await ReconciliationWorker.startRun(tenantA);
        assert.strictEqual(result.status, 'completed');
        assert.ok(result.runId);
        
        // Since the pipeline matches pairs symmetrically (A->B and B->A), matches will be double for duplicates
        // But transfer only matches one way? Wait, TransferEngine looks at context. 
        // We just assert that matches_found > 0.
        assert.ok(result.matches_found > 0);

        // Verify DB Persistence
        const rels = await dbClient.query(`SELECT * FROM transaction_relationships WHERE reconciliation_run_id = $1`, [result.runId]);
        assert.ok(rels.rowCount > 0);
        
        // Should have a duplicate and a transfer
        const hasDuplicate = rels.rows.some(r => r.relationship_type === 'duplicate');
        const hasTransfer = rels.rows.some(r => r.relationship_type === 'transfer');
        assert.ok(hasDuplicate, 'Should have persisted a duplicate edge');
        assert.ok(hasTransfer, 'Should have persisted a transfer edge');
    });

    it('Should enforce idempotency on repeated runs', async () => {
        // Run again
        const result2 = await ReconciliationWorker.startRun(tenantA);
        
        // Matches found should be 0 because ON CONFLICT DO NOTHING will reject duplicate inserts!
        assert.strictEqual(result2.matches_found, 0, 'Idempotency failed: worker inserted duplicate edges!');
        assert.strictEqual(result2.reviews_created, 0, 'Idempotency failed: worker created duplicate reviews!');
    });

    it('Should strictly isolate tenants (Tenant A matches should not leak to Tenant B)', async () => {
        const resultB = await ReconciliationWorker.startRun(tenantB);
        
        // Tenant B only has ONE transaction. It cannot match with Tenant A's identical transaction!
        // Matches should be 0.
        assert.strictEqual(resultB.matches_found, 0, 'Tenant Isolation failed: cross-tenant matching occurred!');
    });

    it('Should verify Audit Trail Integration', async () => {
        const audits = await dbClient.query(`SELECT * FROM audit_events WHERE actor = $1 ORDER BY timestamp DESC`, [tenantA]);
        assert.ok(audits.rowCount > 0, 'No audit events found');
        
        const hasRunCompleted = audits.rows.some(a => a.event_type === 'RECONCILIATION_RUN_COMPLETED');
        const hasDuplicateAudit = audits.rows.some(a => a.event_type === 'DUPLICATE_CANDIDATE_CREATED');
        
        assert.ok(hasRunCompleted, 'Missing run completion audit');
        assert.ok(hasDuplicateAudit, 'Missing duplicate candidate audit event');
    });
});
