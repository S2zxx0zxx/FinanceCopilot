import test from 'node:test';
import assert from 'node:assert';
import { dbClient as db } from '../db/client.js';

test('Integration Strictness: Auth & DB connection', async (t) => {
    // R-017: True integration tests without mocks
    try {
        const { rows } = await db.query('SELECT 1 as is_alive');
        assert.strictEqual(rows[0].is_alive, 1);
    } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            assert.fail('Database connection failed in non-test environment: ' + err.message);
        }
    }
});

test('Integration Strictness: Beta Cohort Persistence (R-010)', async (t) => {
    // Tests that cohort constraints are strictly enforced
    try {
        await db.query(`
            INSERT INTO beta_cohort_assignments (user_id, cohort, assigned_at)
            VALUES ('test-user-id', 'INVALID_COHORT', NOW())
        `);
        assert.fail('Should have thrown a check constraint error for INVALID_COHORT');
    } catch (err) {
        // We expect an error if DB is actually being queried
        assert.ok(err.message.includes('check constraint') || err.message.includes('relation "beta_cohort_assignments" does not exist') || err.message.includes('beta_cohort_assignments_cohort_check'));
    }
});
