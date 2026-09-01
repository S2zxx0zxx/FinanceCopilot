import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NormalizationPipeline, NORMALIZATION_VERSION } from '../domains/normalization/pipeline/normalization.pipeline.js';
import { CategoryNormalizer } from '../domains/normalization/category/category.normalizer.js';

describe('PHASE 3 - FINAL REMEDIATION PROOFS', () => {

    it('PROOF 1: Raw Immutability - Pipeline MUST NOT mutate the source record', () => {
        const rawRecord = {
            user_id: 'tenant-A',
            source_record_id: 'src-immutability-1',
            raw_date_text: '2026-03-01',
            raw_amount_text: '999.99',
            raw_currency_text: 'INR',
            raw_direction_text: 'debit',
            raw_merchant_text: 'Amazon India',
            raw_description_text: 'Amazon India Purchase',
            extraction_confidence: 1.0,
            resolved_account_id: 'acc-123'
        };

        // Deep copy to verify no mutation occurs
        const snapshot = JSON.parse(JSON.stringify(rawRecord));

        const canonicalTx = NormalizationPipeline.run(rawRecord);

        assert.deepStrictEqual(rawRecord, snapshot, 'FATAL: Normalization pipeline mutated the raw source record');
        assert.strictEqual(canonicalTx.amount_paise, 99999);
    });

    it('PROOF 2: Determinism - Multiple runs produce identical output', () => {
        const rawRecord = {
            user_id: 'tenant-A',
            source_record_id: 'src-determinism-1',
            raw_date_text: '2026-04-01',
            raw_amount_text: '50',
            raw_direction_text: 'debit',
            raw_merchant_text: 'Uber',
            extraction_confidence: 0.95
        };

        const tx1 = NormalizationPipeline.run(rawRecord);
        const tx2 = NormalizationPipeline.run(rawRecord);
        const tx3 = NormalizationPipeline.run(rawRecord);

        assert.deepStrictEqual(tx1, tx2);
        assert.deepStrictEqual(tx2, tx3);
    });

    it('PROOF 3: Account Mapping - Handles unresolved accounts safely', () => {
        const rawRecordUnresolved = {
            user_id: 'tenant-A',
            source_record_id: 'src-unresolved-account',
            raw_date_text: '2026-04-01',
            raw_amount_text: '50',
            raw_direction_text: 'debit',
            // Missing resolved_account_id
            extraction_confidence: 0.95
        };

        const txUnresolved = NormalizationPipeline.run(rawRecordUnresolved);
        assert.strictEqual(txUnresolved.account_id, null);
        assert.strictEqual(txUnresolved.needs_review, true, 'Unresolved account must trigger NEEDS_REVIEW');
        assert.ok(txUnresolved.review_reason.includes('ACCOUNT_UNRESOLVED'));

        const rawRecordResolved = { ...rawRecordUnresolved, resolved_account_id: 'real-account-id' };
        const txResolved = NormalizationPipeline.run(rawRecordResolved);
        assert.strictEqual(txResolved.account_id, 'real-account-id');
        assert.strictEqual(txResolved.needs_review, false);
    });

    it('PROOF 4: Category Normalization Determinism', () => {
        const r1 = CategoryNormalizer.normalizeCategory('Amazon Order', 'amazon', 'expense');
        assert.strictEqual(r1.category_raw, 'Shopping');

        const r2 = CategoryNormalizer.normalizeCategory('Zomato Delivery', 'zomato', 'expense');
        assert.strictEqual(r2.category_raw, 'Food & Dining');

        const r3 = CategoryNormalizer.normalizeCategory('Monthly Salary', 'unknown', 'income');
        assert.strictEqual(r3.category_raw, 'Salary');
    });

    it('PROOF 5: Versioned Normalization', () => {
        const rawRecord = {
            user_id: 'tenant-A',
            source_record_id: 'src-version-1',
            raw_date_text: '2026-04-01',
            raw_amount_text: '50',
            raw_direction_text: 'debit',
            extraction_confidence: 0.95
        };

        const tx = NormalizationPipeline.run(rawRecord);
        assert.ok(tx.normalization_version);
        assert.strictEqual(tx.normalization_version, NORMALIZATION_VERSION, 'Must use centralized policy version');
    });

    it('PROOF 6: Cross-Tenant Isolation via Data Structure (Logical)', () => {
        const rawRecordUserA = { user_id: 'UserA', raw_amount_text: '10' };
        const rawRecordUserB = { user_id: 'UserB', raw_amount_text: '20' };

        const txA = NormalizationPipeline.run(rawRecordUserA);
        const txB = NormalizationPipeline.run(rawRecordUserB);

        assert.strictEqual(txA.user_id, 'UserA');
        assert.strictEqual(txB.user_id, 'UserB');
        assert.notStrictEqual(txA.user_id, txB.user_id, 'Tenant boundaries must not cross during stateless pipeline run');
    });
});
