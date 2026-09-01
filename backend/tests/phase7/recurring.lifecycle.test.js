import { test } from 'node:test';
import assert from 'node:assert';

test('Recurring Lifecycle', async (t) => {
    await t.test('allows state transition DETECTED -> CONFIRMED', () => {
        const canTransition = (current, next) => {
            const allowed = {
                'detected': ['confirmed', 'dismissed'],
                'confirmed': ['active', 'paused', 'dismissed', 'ended'],
                'active': ['paused', 'ended', 'dismissed'],
                'paused': ['active', 'ended', 'dismissed']
            };
            return allowed[current]?.includes(next) || false;
        };

        assert.strictEqual(canTransition('detected', 'confirmed'), true);
        assert.strictEqual(canTransition('detected', 'active'), false); // must confirm first (though service handles internally)
        assert.strictEqual(canTransition('active', 'paused'), true);
        assert.strictEqual(canTransition('ended', 'active'), false); // terminal state
    });
});
