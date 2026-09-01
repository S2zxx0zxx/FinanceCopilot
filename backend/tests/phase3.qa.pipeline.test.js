import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NormalizationPipeline, NORMALIZATION_VERSION } from '../domains/normalization/pipeline/normalization.pipeline.js';

describe('PHASE 3 - PIPELINE ORCHESTRATION', () => {

    it('Should deterministically convert a valid debit raw record to a canonical transaction', () => {
        const rawRecord = {
            user_id: 'user-123',
            source_record_id: 'src-123',
            raw_date_text: '15 Jan 2026',
            raw_amount_text: '1,500.50',
            raw_currency_text: 'INR',
            raw_direction_text: 'debit',
            raw_merchant_text: 'UBER TRIP 123',
            raw_description_text: 'UBER TRIP 123',
            raw_reference_text: 'REF-123',
            extraction_confidence: 0.95,
            resolved_account_id: 'test-account-123'
        };

        const tx = NormalizationPipeline.run(rawRecord);

        assert.strictEqual(tx.user_id, 'user-123');
        assert.strictEqual(tx.source_record_id, 'src-123');
        assert.strictEqual(tx.amount_paise, 150050, 'Money must be exactly mapped without float loss');
        assert.strictEqual(tx.currency, 'INR');
        assert.strictEqual(tx.direction, 'debit');
        assert.strictEqual(tx.merchant_normalized, 'UBER', 'Deterministic alias mapping applied');
        assert.strictEqual(tx.category_raw, 'Transport', 'Category should map to Transport based on Uber merchant');
        assert.strictEqual(tx.transaction_type, 'expense');
        assert.strictEqual(tx.overall_confidence, 0.95);
        assert.strictEqual(tx.needs_review, false);
        assert.strictEqual(tx.normalization_version, NORMALIZATION_VERSION);
    });

    it('Should trigger NEEDS_REVIEW for ambiguous dates', () => {
        const rawRecord = {
            user_id: 'user-123',
            source_record_id: 'src-456',
            raw_date_text: '01/02/2026', // Ambiguous
            raw_amount_text: '500',
            raw_direction_text: 'debit',
            raw_merchant_text: 'AMZN',
            extraction_confidence: 1.0,
            resolved_account_id: 'test-account-123'
        };

        const tx = NormalizationPipeline.run(rawRecord);
        assert.strictEqual(tx.needs_review, true);
        assert.ok(tx.review_reason.includes('AMBIGUOUS_DATE'));
        assert.strictEqual(tx.overall_confidence, 0.8, 'Confidence should drop by 0.2');
    });

    it('Should resolve conflicting signs safely', () => {
        const rawRecord = {
            user_id: 'user-123',
            source_record_id: 'src-789',
            raw_date_text: '2026-02-01',
            raw_amount_text: '-500',
            raw_direction_text: 'credit', // Conflict! Negative amount in a credit column
            raw_merchant_text: 'REFUND',
            extraction_confidence: 1.0,
            resolved_account_id: 'test-account-123'
        };

        const tx = NormalizationPipeline.run(rawRecord);
        assert.strictEqual(tx.direction, 'debit', 'Resolved to debit due to negative sign');
        assert.strictEqual(tx.amount_paise, 50000, 'Absolute amount required');
        assert.strictEqual(tx.needs_review, true, 'Conflict triggers review');
        assert.ok(tx.review_reason.includes('DIRECTION_CONFLICT'));
    });
});
