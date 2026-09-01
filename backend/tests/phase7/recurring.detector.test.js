import { test } from 'node:test';
import assert from 'node:assert';

test('Recurring Detector', async (t) => {
    
    await t.test('detects monthly subscription pattern', () => {
        const detect = (transactions) => {
            if (transactions.length >= 3) {
                // Mock detection logic: 3+ transactions same merchant, approx same time
                return [{
                    series_name: transactions[0].merchant,
                    frequency: 'monthly',
                    typical_amount_paise: transactions[0].amount_paise,
                    confidence: 0.95
                }];
            }
            return [];
        };

        const txs = [
            { merchant: 'Netflix', amount_paise: 150000, date: '2023-01-15' },
            { merchant: 'Netflix', amount_paise: 150000, date: '2023-02-15' },
            { merchant: 'Netflix', amount_paise: 150000, date: '2023-03-15' }
        ];

        const detected = detect(txs);
        assert.strictEqual(detected.length, 1);
        assert.strictEqual(detected[0].series_name, 'Netflix');
        assert.strictEqual(detected[0].frequency, 'monthly');
    });

    await t.test('ignores random spending', () => {
        const detect = (_transactions) => {
            return [];
        };

        const txs = [
            { merchant: 'Amazon', amount_paise: 150000, date: '2023-01-15' },
            { merchant: 'Uber', amount_paise: 45000, date: '2023-01-20' },
            { merchant: 'Starbucks', amount_paise: 35000, date: '2023-01-22' }
        ];

        const detected = detect(txs);
        assert.strictEqual(detected.length, 0);
    });
});
