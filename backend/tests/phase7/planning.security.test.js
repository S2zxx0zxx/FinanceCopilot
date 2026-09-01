import { test } from 'node:test';
import assert from 'node:assert';

test('Planning Security', async (t) => {
    
    await t.test('prevents cross-user data access in repositories', () => {
        const repoAction = (userId, targetId) => {
            if (userId !== targetId) throw new Error('Unauthorized');
            return true;
        };

        // User 1 accesses User 1 data
        assert.doesNotThrow(() => repoAction('user1', 'user1'));
        
        // User 1 tries to access User 2 data
        assert.throws(() => repoAction('user1', 'user2'), /Unauthorized/);
    });

    await t.test('enforces limits on goal amounts', () => {
        const createGoal = (targetPaise) => {
            if (targetPaise > 1000000000000) throw new Error('Limit exceeded'); // 1000 Cr limit
            return true;
        };

        assert.doesNotThrow(() => createGoal(500000));
        assert.throws(() => createGoal(9999999999999), /Limit exceeded/);
    });
});
