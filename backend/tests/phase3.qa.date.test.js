import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DateNormalizer } from '../domains/normalization/date/date.normalizer.js';

describe('PHASE 3 - DATE NORMALIZATION QA', () => {

    const testCases = [
        // ISO
        { raw: '2026-02-01', expectedIso: '2026-02-01T00:00:00.000Z', isAmbiguous: false },
        { raw: '2026/02/01', expectedIso: '2026-02-01T00:00:00.000Z', isAmbiguous: false },
        
        // Unambiguous Slashes/Dashes
        { raw: '15/02/2026', expectedIso: '2026-02-15T00:00:00.000Z', isAmbiguous: false }, // Must be DD/MM
        { raw: '02-15-2026', expectedIso: '2026-02-15T00:00:00.000Z', isAmbiguous: false }, // Must be MM/DD
        { raw: '12/12/2026', expectedIso: '2026-12-12T00:00:00.000Z', isAmbiguous: false }, // Symmetric
        
        // Ambiguous Dates
        { raw: '01/02/2026', expectedIso: null, isAmbiguous: true }, // Could be Jan 2 or Feb 1
        { raw: '05-06-2024', expectedIso: null, isAmbiguous: true }, 

        // Alpha Months
        { raw: '01-Feb-2026', expectedIso: '2026-02-01T00:00:00.000Z', isAmbiguous: false },
        { raw: '15 Jan 2026', expectedIso: '2026-01-15T00:00:00.000Z', isAmbiguous: false },
        { raw: 'Mar 15, 2026', expectedIso: '2026-03-15T00:00:00.000Z', isAmbiguous: false },
        { raw: 'Mar 15 2026', expectedIso: '2026-03-15T00:00:00.000Z', isAmbiguous: false },

        // Edge Cases
        { raw: '', expectedIso: null, isAmbiguous: false },
        { raw: 'N/A', expectedIso: null, isAmbiguous: false },
        { raw: 'Not a date', expectedIso: null, isAmbiguous: true } // JS fallback might fail, or produce Invalid Date
    ];

    for (const tc of testCases) {
        it(`Should handle "${tc.raw}" correctly`, () => {
            const result = DateNormalizer.normalizeDate(tc.raw);
            assert.strictEqual(result.is_ambiguous, tc.isAmbiguous, `Ambiguity mismatch for ${tc.raw}`);
            
            if (tc.expectedIso) {
                assert.ok(result.date, `Expected date for ${tc.raw} but got null`);
                assert.strictEqual(result.date.toISOString(), tc.expectedIso, `ISO string mismatch for ${tc.raw}`);
            }
        });
    }
});
