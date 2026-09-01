import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { FinancialStateRepo } from '../db/repositories/financial_state.repo.js';
import { SafeToSpendEngine } from '../domains/financial-state/safe-to-spend/safe_to_spend.engine.js';


describe('PHASE 5 - FINANCIAL STATE & LEDGER ENGINE', () => {

    const tenantA = '550e8400-e29b-41d4-a716-446655440055';
    
    before(async () => {
        // 0. Ensure Phase 5 schema tables exist (idempotent - safe to re-run)
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS financial_commitments (
                commitment_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id              UUID NOT NULL REFERENCES users(user_id),
                account_id           UUID REFERENCES financial_accounts(account_id),
                commitment_type      TEXT NOT NULL CHECK (commitment_type IN ('emi', 'recurring_bill', 'subscription', 'manual_plan', 'debt_payment')),
                status               TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due', 'paid', 'overdue', 'cancelled')),
                amount_paise         BIGINT NOT NULL CHECK (amount_paise > 0),
                currency             TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
                due_date             DATE NOT NULL,
                recurrence_rule      TEXT,
                source_transaction_id UUID REFERENCES transactions(transaction_id),
                confidence           NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (confidence BETWEEN 0 AND 1),
                created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS safe_to_spend_configurations (
                config_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id              UUID NOT NULL REFERENCES users(user_id) UNIQUE,
                safety_buffer_paise  BIGINT NOT NULL DEFAULT 500000,
                buffer_currency      TEXT NOT NULL DEFAULT 'INR' CHECK (buffer_currency IN ('INR')),
                essential_category_ids UUID[],
                horizon_days         INTEGER NOT NULL DEFAULT 30,
                created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS financial_snapshots (
                snapshot_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id              UUID NOT NULL REFERENCES users(user_id),
                calculation_type     TEXT NOT NULL CHECK (calculation_type IN ('safe_to_spend', 'balance_check', 'affordability')),
                calculation_version  TEXT NOT NULL,
                result_paise         BIGINT NOT NULL,
                currency             TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
                horizon_start        TIMESTAMPTZ,
                horizon_end          TIMESTAMPTZ,
                freshness_score      TEXT NOT NULL CHECK (freshness_score IN ('fresh', 'recent', 'stale', 'unknown')),
                coverage_score       TEXT NOT NULL CHECK (coverage_score IN ('full', 'partial', 'no_coverage', 'unknown')),
                confidence_level     TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low', 'unknown')),
                input_snapshot       JSONB NOT NULL,
                computed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        // 1. Create Isolated Tenant
        await dbClient.query(`
            INSERT INTO users (user_id, firebase_uid, email, is_active)
            VALUES ($1, 'firebase-test-p5-A', 'p5tenantA@test.com', true)
            ON CONFLICT DO NOTHING;
        `, [tenantA]);

        // 2. Insert test configuration
        await dbClient.query(`
            INSERT INTO safe_to_spend_configurations (user_id, safety_buffer_paise, horizon_days)
            VALUES ($1, 500000, 30)
            ON CONFLICT DO NOTHING;
        `, [tenantA]);

        // 3. Create Accounts
        const accRes1 = await dbClient.query(`
            INSERT INTO financial_accounts (user_id, account_type, institution_name, currency, is_active)
            VALUES ($1, 'savings', 'P5 Bank', 'INR', true) RETURNING account_id;
        `, [tenantA]);
        const accId1 = accRes1.rows[0].account_id;

        // 3b. Create Import Job (required FK for source_records)
        const jobRes = await dbClient.query(`
            INSERT INTO import_jobs (user_id, idempotency_key, job_type, file_ref, status)
            VALUES ($1, 'test-job-p5-A', 'csv', 'test.csv', 'completed') RETURNING job_id;
        `, [tenantA]);
        const jobId = jobRes.rows[0].job_id;

        // 4. Create Source Records (Mock) — must include import_job_id (NOT NULL FK)
        const makeSR = (userId) =>
            dbClient.query(`
                INSERT INTO source_records
                    (user_id, import_job_id, file_ref, parser_used, parser_version,
                     raw_date_text, raw_amount_text, raw_merchant_text, raw_direction_text, status)
                VALUES ($1, $2, 'test.csv', 'csv_parser', '1.0.0',
                        '2026-05-01', '500.00', 'TEST', 'debit', 'normalized')
                RETURNING source_record_id;
            `, [userId, jobId]);

        const sr1 = await makeSR(tenantA);
        const sr2 = await makeSR(tenantA);
        const sr3 = await makeSR(tenantA);
        const sr4 = await makeSR(tenantA);
        const sr5 = await makeSR(tenantA);

        // 5. Insert Transactions (Strict exact math)
        const insertTx = (srId, amount, direction, type, duplicateStatus, postingStatus, currency = 'INR') => 
            dbClient.query(`
                INSERT INTO transactions
                    (user_id, source_record_id, account_id, amount_paise, direction, currency,
                     merchant_raw, merchant_normalized, observed_at, normalization_version, 
                     is_manual, transaction_type, duplicate_status, posting_status)
                VALUES ($1, $2, $3, $4, $5, $6,
                        'TEST', 'test', '2026-05-01T10:00:00Z', 'v1', 
                        false, $7, $8, $9);
            `, [tenantA, srId, accId1, amount, direction, currency, type, duplicateStatus, postingStatus]);

        // Posted Credits (Income): ₹50,000.00
        await insertTx(sr1.rows[0].source_record_id, 5000000, 'credit', 'income', 'unique', 'posted');
        
        // Posted Debits (Expense): ₹10,000.00
        await insertTx(sr2.rows[0].source_record_id, 1000000, 'debit', 'expense', 'unique', 'posted');

        // Pending Debits (Expense): ₹2,000.00
        await insertTx(sr3.rows[0].source_record_id, 200000, 'debit', 'expense', 'unique', 'pending');

        // Duplicate Tx (Expense): ₹5,000.00 (MUST BE IGNORED)
        await insertTx(sr4.rows[0].source_record_id, 500000, 'debit', 'expense', 'duplicate', 'posted');

        // Refund (Offset): ₹1,000.00 
        await insertTx(sr5.rows[0].source_record_id, 100000, 'credit', 'refund', 'unique', 'posted');

        // NOTE: sr6 is reserved but not inserted. USD insertion is intentionally omitted.
        // The transactions schema enforces CHECK (currency IN ('INR')) at the DB level.
        // The currency isolation test below proves this constraint exists.

        // 6. Insert Commitments
        await dbClient.query(`
            INSERT INTO financial_commitments (user_id, account_id, commitment_type, status, amount_paise, due_date)
            VALUES ($1, $2, 'emi', 'upcoming', 800000, '2026-05-15');
        `, [tenantA, accId1]);
    });

    after(async () => {
        // Cleanup all dependencies (order matters due to FK constraints)
        await dbClient.query(`DELETE FROM financial_snapshots WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM safe_to_spend_configurations WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM financial_commitments WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM transactions WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM source_records WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM financial_accounts WHERE user_id = $1`, [tenantA]);
        await dbClient.query(`DELETE FROM users WHERE user_id = $1`, [tenantA]);
    });

    it('Should deterministically calculate exact Posted and Available balances', async () => {
        const balances = await FinancialStateRepo.getAccountBalances(tenantA);
        
        // Expected Posted: 50,000.00 (Cr) - 10,000.00 (Db) + 1,000.00 (Refund Cr) = 41,000.00 (4100000 paise)
        assert.strictEqual(balances.posted_balance_paise, 4100000, 'Posted balance incorrect');

        // Expected Available: Posted (41,000) - Pending Debits (2,000) = 39,000.00 (3900000 paise)
        // Assuming rulebook PENDING_POLICY DEBIT weight = 1.0
        assert.strictEqual(balances.available_balance_paise, 3900000, 'Available balance did not apply pending money policy correctly');
    });

    it('Should calculate Effective Spending accounting for refunds and duplicates', async () => {
        const spending = await FinancialStateRepo.getEffectiveSpending(tenantA, '2026-01-01', '2026-12-31');

        // Gross expenses: 10,000 (posted) + 2,000 (pending) = 12,000.00 (1200000 paise)
        // Duplicates (5,000) MUST BE EXCLUDED!
        assert.strictEqual(spending.gross_spending_paise, 1200000, 'Gross spending failed to exclude duplicate or include pending');

        // Total offsets (Refunds): 1,000.00 (100000 paise)
        assert.strictEqual(spending.offsets_paise, 100000, 'Refunds were not correctly identified as offsets');

        // Effective Spending: 12,000 - 1,000 = 11,000.00 (1100000 paise)
        assert.strictEqual(spending.effective_spending_paise, 1100000, 'Effective spending did not subtract offsets');
    });

    it('Should calculate deterministic Safe To Spend with Snapshots', async () => {
        const sts = await SafeToSpendEngine.calculateAndSnapshot(tenantA);
        
        // STS Formula: 
        // Available (39,000) + ExpectedInc (0) - Commitments (8,000) - EssentialSpend (0) - SafetyBuffer (5,000) = 26,000.00 (2600000 paise)
        assert.strictEqual(sts.safe_to_spend_paise, 2600000, 'Safe-to-Spend formula failed');
        assert.ok(sts.snapshot_id, 'No snapshot ID returned');

        // Verify the immutable snapshot was successfully created
        const snapshotQ = await dbClient.query('SELECT * FROM financial_snapshots WHERE snapshot_id = $1', [sts.snapshot_id]);
        assert.strictEqual(snapshotQ.rowCount, 1, 'Snapshot was not persisted');
        
        const payload = snapshotQ.rows[0].input_snapshot;
        assert.strictEqual(payload.inputs.safety_buffer_paise, 500000, 'Snapshot missing exact input values');
    });

    it('Should maintain Tenant Isolation (Security)', async () => {
        const randomTenant = '999e8400-e29b-41d4-a716-446655449999';
        const balances = await FinancialStateRepo.getAccountBalances(randomTenant);
        
        assert.strictEqual(balances.posted_balance_paise, 0, 'Tenant isolation failed: Random tenant received balance');
        assert.strictEqual(balances.available_balance_paise, 0, 'Tenant isolation failed: Random tenant received balance');
    });

    it('Should maintain Currency Isolation (V1 FX Safety — Schema Enforcement)', async () => {
        // PROOF: V1 Multi-Currency isolation is enforced at the DB schema level.
        // The transactions table has a CHECK constraint limiting currency to 'INR'.
        // Attempting to insert any other currency (e.g. USD) will be rejected by PostgreSQL.
        // We verify this constraint exists in pg_constraint.
        const res = await dbClient.query(`
            SELECT COUNT(*) AS constraint_count
            FROM pg_constraint
            WHERE conrelid = 'transactions'::regclass
              AND contype = 'c'
              AND pg_get_constraintdef(oid) LIKE '%currency%INR%';
        `);
        assert.ok(
            parseInt(res.rows[0].constraint_count, 10) >= 1,
            'V1 currency isolation broken: no CHECK constraint found on transactions.currency'
        );
    });

    it('Should guarantee Snapshot Determinism (Idempotency)', async () => {
        const sts1 = await SafeToSpendEngine.calculateAndSnapshot(tenantA);
        const sts2 = await SafeToSpendEngine.calculateAndSnapshot(tenantA);
        
        assert.strictEqual(sts1.safe_to_spend_paise, sts2.safe_to_spend_paise, 'Snapshot results are not deterministic');
    });
});
