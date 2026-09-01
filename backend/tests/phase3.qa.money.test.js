import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MoneyNormalizer } from '../domains/normalization/amount/money.normalizer.js';

describe('PHASE 3 - MONEY NORMALIZATION EXACT ARITHMETIC MATRIX', () => {

    // 10. MONEY EDGE-CASE TEST MATRIX
    const matrix = [
        { raw: '1', expected: 100, isNeg: false },
        { raw: '1.0', expected: 100, isNeg: false },
        { raw: '1.00', expected: 100, isNeg: false },
        { raw: '1,000', expected: 100000, isNeg: false },
        { raw: '1,000.50', expected: 100050, isNeg: false },
        { raw: '1.000,50', expected: 100050, isNeg: false }, // EU format
        { raw: '₹1,000', expected: 100000, isNeg: false },
        { raw: '₹ 1,000.00', expected: 100000, isNeg: false },
        { raw: '(500)', expected: 50000, isNeg: true },
        { raw: '-500', expected: 50000, isNeg: true },
        { raw: '+500', expected: 50000, isNeg: false },
        { raw: '500-', expected: 50000, isNeg: true },
        { raw: '500.123', expected: 50012, isNeg: false }, // truncation rule
        { raw: '0', expected: 0, isNeg: false },
        { raw: '-0', expected: 0, isNeg: true },
        { raw: 'blank', expected: null, isNeg: false, invalid: true },
        { raw: 'N/A', expected: null, isNeg: false, invalid: true },
        { raw: '—', expected: null, isNeg: false, invalid: true },
        { raw: 'invalid OCR', expected: null, isNeg: false, invalid: true }
    ];

    for (const tc of matrix) {
        it(`Should deterministically parse "${tc.raw}" without float corruption`, () => {
            const result = MoneyNormalizer.normalizeToPaise(tc.raw);
            
            assert.strictEqual(result.is_valid, !tc.invalid, `Validity mismatch for ${tc.raw}`);
            assert.strictEqual(result.amount_paise, tc.expected, `Amount mismatch for ${tc.raw}`);
            
            // For edge case 'invalid OCR' where it contains no numbers, isNeg defaults to false
            if (!tc.invalid) {
                assert.strictEqual(result.is_negative_in_source, tc.isNeg, `Sign mismatch for ${tc.raw}`);
            }
        });
    }

});
