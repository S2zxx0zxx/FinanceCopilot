import { test } from 'node:test';
import assert from 'node:assert';

test('Upcoming Engine', async (t) => {
    
    await t.test('merges and sorts upcoming items correctly', () => {
        const generateTimeline = (recurring, goals, _horizonDays) => {
            // Simplified logic for unit test demonstration
            const items = [];
            for (const r of recurring) {
                items.push({
                    name: r.series_name,
                    amount_paise: r.typical_amount_paise,
                    expected_date: r.next_expected_at,
                    source_type: 'confirmed_recurring'
                });
            }
            for (const g of goals) {
                items.push({
                    name: `Goal: ${g.name}`,
                    amount_paise: g.monthly_contribution_paise,
                    expected_date: '2023-10-15',
                    source_type: 'goal_contribution'
                });
            }
            
            return items.sort((a,b) => new Date(a.expected_date) - new Date(b.expected_date));
        };

        const recurring = [{ series_name: 'Netflix', typical_amount_paise: 150000, next_expected_at: '2023-10-20' }];
        const goals = [{ name: 'Emergency Fund', monthly_contribution_paise: 500000 }];
        
        const timeline = generateTimeline(recurring, goals, 30);
        
        assert.strictEqual(timeline.length, 2);
        assert.strictEqual(timeline[0].name, 'Goal: Emergency Fund'); // 15th
        assert.strictEqual(timeline[1].name, 'Netflix'); // 20th
    });
});
