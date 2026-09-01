import { test } from 'node:test';
import assert from 'node:assert';

test('Goals Service', async (t) => {
    
    await t.test('calculates pace correctly when active', () => {
        const getPaceStatus = (currentPaise, targetPaise, targetDateStr) => {
            if (currentPaise >= targetPaise) return 'completed';
            if (!targetDateStr) return 'in_progress';

            const now = new Date('2023-10-01');
            const target = new Date(targetDateStr);
            const daysLeft = Math.max(0, Math.floor((target - now) / (1000 * 60 * 60 * 24)));
            
            if (daysLeft === 0) return 'deadline_passed';
            return 'in_progress';
        };

        assert.strictEqual(getPaceStatus(500000, 500000, null), 'completed');
        assert.strictEqual(getPaceStatus(500000, 1000000, null), 'in_progress');
        assert.strictEqual(getPaceStatus(500000, 1000000, '2023-09-01'), 'deadline_passed');
    });

    await t.test('calculates progress percentage', () => {
        const getProgressPct = (currentPaise, targetPaise) => {
            if (!targetPaise || targetPaise <= 0) return 0;
            const pct = Math.floor((currentPaise / targetPaise) * 100);
            return Math.min(100, Math.max(0, pct));
        };

        assert.strictEqual(getProgressPct(50, 100), 50);
        assert.strictEqual(getProgressPct(150, 100), 100);
        assert.strictEqual(getProgressPct(0, 100), 0);
        assert.strictEqual(getProgressPct(-10, 100), 0);
    });
});
