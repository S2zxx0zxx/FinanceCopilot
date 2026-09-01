import { test } from 'node:test';
import assert from 'node:assert';
import { ForecastEngine } from '../../domains/forecast/engine.js';

test('Phase 8 - Forecast Engine Orchestration', async (t) => {
    const mockDb = { query: async () => ({ rows: [{ forecast_id: 1 }] }) };
    const engine = new ForecastEngine(mockDb);
    
    // Monkey patch the internal featureExtractor
    engine.featureExtractor.extractPointInTimeFeatures = async () => ({
        cutoffDate: '2026-08-27T00:00:00.000Z',
        liquidBalancePaise: 1000000, // 10k
        upcomingCommitments: [
            { amountPaise: 200000, dueDate: '2026-08-30' } // 2k
        ],
        historicalDailySpending: [
            { date: '2026-08-13', spendPaise: 50000 },
            { date: '2026-08-14', spendPaise: 50000 },
            { date: '2026-08-15', spendPaise: 50000 },
            { date: '2026-08-16', spendPaise: 50000 },
            { date: '2026-08-17', spendPaise: 50000 },
            { date: '2026-08-18', spendPaise: 50000 },
            { date: '2026-08-19', spendPaise: 50000 },
            { date: '2026-08-20', spendPaise: 50000 },
            { date: '2026-08-21', spendPaise: 50000 },
            { date: '2026-08-22', spendPaise: 50000 },
            { date: '2026-08-23', spendPaise: 50000 },
            { date: '2026-08-24', spendPaise: 50000 },
            { date: '2026-08-25', spendPaise: 50000 },
            { date: '2026-08-26', spendPaise: 50000 },
            { date: '2026-08-27', spendPaise: 50000 }
        ], // median = 50000 per day
        spendingVolatilityPaise: 10000, // low volatility → HIGH trust
        featureVersion: 'v1.0.0'
    });

    await t.test('should generate a fully calibrated snapshot integrating baselines and uncertainty', async () => {
        // 7 days * 50000/day spending = 350000 projected spend
        // Balance(1000000) - commitments(200000) - projectedSpend(350000) = 450000
        const snapshot = await engine.generateForecast('user-1', 7, new Date('2026-08-27T00:00:00.000Z'));
        assert.strictEqual(snapshot.pointEstimatePaise, 450000);
        assert.ok(snapshot.upperBoundPaise > 450000);
        assert.ok(snapshot.lowerBoundPaise < 450000);
        assert.strictEqual(snapshot.trustState, 'HIGH');
        assert.strictEqual(snapshot.drivers.length, 2);
    });
});
