import { test } from 'node:test';
import assert from 'node:assert';
import { ForecastFeatures } from '../../domains/forecast/features.js';

test('Phase 8 - Temporal Validation & Point-In-Time Correctness', async (t) => {
    
    // We will keep track of query calls
    const queryCalls = [];
    const mockDb = {
        query: async (...args) => {
            queryCalls.push(args);
            return { rows: [] };
        }
    };

    const featureExtractor = new ForecastFeatures(mockDb);

    await t.test('should strictly query data AT OR BEFORE the cutoff date (No future leakage)', async () => {
        queryCalls.length = 0; // reset
        const cutoffDate = new Date('2026-08-20T00:00:00.000Z');
        
        await featureExtractor.extractPointInTimeFeatures('user-1', cutoffDate);

        // Verify the liquid balance query uses <= cutoff
        const balanceQueryCall = queryCalls[0];
        assert.ok(balanceQueryCall[0].includes('as_of <= $2'));
        assert.strictEqual(balanceQueryCall[1][1], cutoffDate.toISOString());

        // Verify the historical spending uses <= cutoff
        const spendingQueryCall = queryCalls[2];
        assert.ok(spendingQueryCall[0].includes('transaction_date <= $2'));
        assert.strictEqual(spendingQueryCall[1][1], cutoffDate.toISOString());
    });

    await t.test('should correctly fetch upcoming deterministic commitments strictly AFTER cutoff', async () => {
        queryCalls.length = 0; // reset
        const cutoffDate = new Date('2026-08-20T00:00:00.000Z');

        await featureExtractor.extractPointInTimeFeatures('user-1', cutoffDate);

        const commitmentQueryCall = queryCalls[1];
        assert.ok(commitmentQueryCall[0].includes('due_date > $2'));
        assert.strictEqual(commitmentQueryCall[1][1], cutoffDate.toISOString());
    });
});
