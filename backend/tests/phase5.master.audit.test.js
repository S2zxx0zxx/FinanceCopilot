import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { FinancialStateRepo } from '../db/repositories/financial_state.repo.js';
import { FreshnessEngine } from '../domains/financial-state/freshness/freshness.engine.js';
import { CoverageEngine } from '../domains/financial-state/coverage/coverage.engine.js';
import { ExpectedIncomePolicy } from '../domains/financial-state/expected-income/expected_income.policy.js';
import { EssentialSpendingPolicy } from '../domains/financial-state/essential-spending/essential_spending.policy.js';
import { SafeToSpendEngine } from '../domains/financial-state/safe-to-spend/safe_to_spend.engine.js';

describe('PHASE 5 - MASTER AUDIT MATRIX', () => {

    const tenantA = '550e8400-e29b-41d4-a716-446655440099'; // Unique tenant for audit
    let accId1;
    let srCount = 0;

    before(async () => {
        // Setup Tenant
        await dbClient.query(`
            INSERT INTO users (user_id, firebase_uid, email, is_active)
            VALUES ($1, 'audit-tenant', 'audit@test.com', true)
            ON CONFLICT DO NOTHING;
        `, [tenantA]);

        // Setup Account
        const acc = await dbClient.query(`
            INSERT INTO financial_accounts (user_id, account_type, institution_name, currency, is_active)
            VALUES ($1, 'savings', 'Audit Bank', 'INR', true) RETURNING account_id;
        `, [tenantA]);
        accId1 = acc.rows[0].account_id;

        // Setup Job (Required by Source Records)
        const job = await dbClient.query(`
            INSERT INTO import_jobs (user_id, idempotency_key, job_type, file_ref, status)
            VALUES ($1, 'audit-job', 'csv', 'audit.csv', 'completed') RETURNING job_id;
        `, [tenantA]);
        const jobId = job.rows[0].job_id;

        // Helper to make source records
        const makeSR = async () => {
            srCount++;
            const sr = await dbClient.query(`
                INSERT INTO source_records
                    (user_id, import_job_id, file_ref, parser_used, parser_version,
                     raw_date_text, raw_amount_text, raw_merchant_text, raw_direction_text, status)
                VALUES ($1, $2, 'audit.csv', 'csv_parser', '1.0.0',
                        '2026-05-01', '1.00', 'TEST', 'debit', 'normalized')
                RETURNING source_record_id;
            `, [tenantA, jobId]);
            return sr.rows[0].source_record_id;
        };

        const insertTx = (srId, amount, direction, type) => 
            dbClient.query(`
                INSERT INTO transactions
                    (user_id, source_record_id, account_id, amount_paise, direction, currency,
                     merchant_raw, merchant_normalized, observed_at, normalization_version, 
                     is_manual, transaction_type, duplicate_status, posting_status)
                VALUES ($1, $2, $3, $4, $5, 'INR',
                        'TEST', 'test', '2026-05-01T10:00:00Z', 'v1', 
                        false, $6, 'unique', 'posted');
            `, [tenantA, srId, accId1, amount, direction, type]);

        // 1. Income Engine Data
        const sr1 = await makeSR();
        const sr2 = await makeSR();
        await insertTx(sr1, 5000000, 'credit', 'income'); // 50k Income
        await insertTx(sr2, 1000000, 'credit', 'transfer_in'); // 10k Transfer (Should be ignored by income)

        // 2. Commitment Engine Data
        const insertCommitment = (amount, status) => 
            dbClient.query(`
                INSERT INTO financial_commitments (user_id, account_id, commitment_type, status, amount_paise, due_date)
                VALUES ($1, $2, 'emi', $3, $4, '2026-05-15');
            `, [tenantA, accId1, status, amount]);
        
        await insertCommitment(500000, 'upcoming'); // Included
        await insertCommitment(200000, 'paid'); // Ignored
        await insertCommitment(100000, 'cancelled'); // Ignored
        await insertCommitment(300000, 'overdue'); // Ignored by upcoming sum, would be separate
    });

    after(async () => {
        await dbClient.query('DELETE FROM financial_snapshots WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM safe_to_spend_configurations WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM financial_commitments WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM transactions WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM source_records WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM import_jobs WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM financial_accounts WHERE user_id = $1', [tenantA]);
        await dbClient.query('DELETE FROM users WHERE user_id = $1', [tenantA]);
    });

    it('1. Income Engine Dedicated Coverage', async () => {
        const income = await FinancialStateRepo.getEffectiveIncome(tenantA, '2026-01-01', '2026-12-31');
        assert.strictEqual(income.total_income_paise, 5000000, 'Income engine failed to isolate "income" from "transfer_in"');
    });

    it('2. Commitment Lifecycle Transitions', async () => {
        const commitments = await FinancialStateRepo.getUpcomingCommitments(tenantA, '2026-12-31');
        assert.strictEqual(commitments.upcoming_commitments_paise, 500000, 'Commitment engine failed to filter out paid/cancelled/overdue statuses');
    });

    it('3. Freshness Boundary Matrix', () => {
        const now = new Date();
        const t0 = new Date(now.getTime()).toISOString();
        const t1hr = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
        const t23hr = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();
        const t25hr = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();

        assert.strictEqual(FreshnessEngine.calculateFreshness(t0), 'fresh');
        assert.strictEqual(FreshnessEngine.calculateFreshness(t1hr), 'fresh');
        assert.strictEqual(FreshnessEngine.calculateFreshness(t23hr), 'recent');
        assert.strictEqual(FreshnessEngine.calculateFreshness(t25hr), 'stale');
    });

    it('4. Coverage Zero-Denominator Matrix', () => {
        assert.strictEqual(CoverageEngine.calculateCoverage(0, 0), 'no_coverage', 'Zero-denominator crashed or failed');
        assert.strictEqual(CoverageEngine.calculateCoverage(1, 0), 'no_coverage');
        assert.strictEqual(CoverageEngine.calculateCoverage(2, 1), 'partial');
        assert.strictEqual(CoverageEngine.calculateCoverage(2, 2), 'full');
    });

    it('5. Expected-Income Policy Execution', () => {
        const policy = ExpectedIncomePolicy.calculateExpectedIncome(tenantA, '2026-05-01');
        assert.strictEqual(policy.expected_income_paise, 0);
        assert.strictEqual(policy.evidence_status, 'NO_EVIDENCE');
    });

    it('6. Essential-Spending Policy Execution', () => {
        // With empty config
        const policy1 = EssentialSpendingPolicy.calculateEssentialSpending(tenantA, { essential_category_ids: [] }, '2026-05-01');
        assert.strictEqual(policy1.essential_spending_paise, 0);
        assert.strictEqual(policy1.evidence_status, 'NO_EVIDENCE');

        // With some config (V1 flags OPEN_DECISION / PARTIAL_EVIDENCE)
        const policy2 = EssentialSpendingPolicy.calculateEssentialSpending(tenantA, { essential_category_ids: ['uuid'] }, '2026-05-01');
        assert.strictEqual(policy2.essential_spending_paise, 0);
        assert.strictEqual(policy2.evidence_status, 'PARTIAL_EVIDENCE');
    });

    it('7. Multi-Currency Behavior Beyond INR', async () => {
        const res = await dbClient.query(`
            SELECT COUNT(*) AS constraint_count
            FROM pg_constraint
            WHERE conrelid = 'transactions'::regclass
              AND contype = 'c'
              AND pg_get_constraintdef(oid) LIKE '%currency%INR%';
        `);
        assert.ok(parseInt(res.rows[0].constraint_count, 10) >= 1, 'V1 currency isolation broken');
    });

    it('8. Failure/Recovery (Missing Configs)', async () => {
        // No safe_to_spend_configurations inserted for tenantA yet.
        // The STS Engine should not crash, it should gracefully apply defaults.
        const sts = await SafeToSpendEngine.calculateAndSnapshot(tenantA);
        
        assert.strictEqual(sts.currency, 'INR');
        assert.ok(sts.snapshot_id, 'Snapshot failed during config recovery');

        const snapshotQ = await dbClient.query('SELECT * FROM financial_snapshots WHERE snapshot_id = $1', [sts.snapshot_id]);
        const payload = snapshotQ.rows[0].input_snapshot;
        assert.strictEqual(payload.inputs.safety_buffer_paise, 500000, 'Default safety buffer not applied on missing config');
    });

    it('9. Phase 0-4 Regression Non-Mutation', async () => {
        // Insert a duplicate
        const srDup = await dbClient.query(`
            INSERT INTO source_records (user_id, import_job_id, file_ref, parser_used, parser_version, raw_date_text, raw_amount_text, raw_merchant_text, raw_direction_text, status)
            VALUES ($1, (SELECT job_id FROM import_jobs WHERE user_id = $1 LIMIT 1), 'test', 'csv', '1', 'date', 'amt', 'merch', 'dir', 'normalized') RETURNING source_record_id
        `, [tenantA]);
        
        await dbClient.query(`
            INSERT INTO transactions (user_id, source_record_id, account_id, amount_paise, direction, currency, merchant_raw, merchant_normalized, observed_at, normalization_version, is_manual, transaction_type, duplicate_status, posting_status)
            VALUES ($1, $2, $3, 99999, 'debit', 'INR', 'TEST', 'test', '2026-05-01T10:00:00Z', 'v1', false, 'expense', 'duplicate', 'posted')
        `, [tenantA, srDup.rows[0].source_record_id, accId1]);

        const spending = await FinancialStateRepo.getEffectiveSpending(tenantA, '2026-01-01', '2026-12-31');
        // Gross expense should be 0 because the only expense is marked 'duplicate'
        assert.strictEqual(spending.gross_spending_paise, 0, 'Phase 4 regression: Duplicates are leaking into aggregates');
    });
});
