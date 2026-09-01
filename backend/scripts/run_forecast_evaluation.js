import { ForecastEvaluation } from '../domains/forecast/evaluation.js';

// ==========================================
// 1. SYNTHETIC DATA GENERATOR (1 YEAR)
// ==========================================
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
const SEED = 123456789;
const random = mulberry32(SEED);

function generateSyntheticHistory() {
    const history = [];
    const commitments = [];
    const snapshots = [];
    
    let currentBalance = 50000000; // 5 Lakhs starting
    const startDate = new Date('2025-01-01T00:00:00Z');

    // Salary: 1 Lakh monthly on the 1st
    // Rent: 30k monthly on the 5th (Commitment)
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-01-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-02-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-03-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-04-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-05-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-06-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-07-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-08-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-09-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-10-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-11-05', status: 'expected' });
    commitments.push({ expected_amount_paise: 3000000, due_date: '2025-12-05', status: 'expected' });

    for (let i = 0; i < 365; i++) {
        const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        let dailySpend = 0;
        
        // Income
        if (d.getDate() === 1) {
            dailySpend += 10000000;
        }
        
        // Random daily expense (Mean: 1000, StdDev: ~500)
        // Uniform random mapped to rough normal-ish
        const noise = (random() + random() + random() - 1.5) * 50000; 
        let expense = 100000 + noise; // base 1000 INR
        
        // Known Commitment Deduction (Rent)
        if (d.getDate() === 5) {
            expense += 3000000;
        }

        dailySpend -= Math.round(expense);
        currentBalance += dailySpend;

        history.push({
            t_date: d.toISOString().split('T')[0],
            daily_spend: dailySpend
        });

        snapshots.push({
            as_of: d.toISOString(),
            current_balance_paise: currentBalance
        });
    }

    return { history, commitments, snapshots };
}

const db = generateSyntheticHistory();

// ==========================================
// 2. MOCK DB CLIENT
// ==========================================
const mockDbClient = {
    query: async (queryStr, values) => {
        // 1. Balance Snapshot
        if (queryStr.includes('current_balance_paise FROM financial_snapshots')) {
            const cutoff = new Date(values[1]).getTime();
            const valid = db.snapshots.filter(s => new Date(s.as_of).getTime() <= cutoff);
            if (valid.length === 0) return { rows: [] };
            return { rows: [valid[valid.length - 1]] };
        }
        // 2. Commitments
        if (queryStr.includes('FROM commitments')) {
            const cutoff = new Date(values[1]).getTime();
            return { rows: db.commitments.filter(c => new Date(c.due_date).getTime() > cutoff) };
        }
        // 3. Historical Spending
        if (queryStr.includes('SUM(amount_paise) as daily_spend')) {
            const cutoff = new Date(values[1]).getTime();
            const valid = db.history.filter(h => new Date(h.t_date).getTime() <= cutoff);
            // Engine filters for amount_paise < 0, but our synthetic data daily_spend is already < 0 and aggregated
            return { rows: valid };
        }
        
        // 4. Save Snapshot (No-op)
        if (queryStr.includes('INSERT INTO forecast_snapshots')) {
            return { rows: [{ forecast_id: 'mock-uuid' }] };
        }
        
        return { rows: [] };
    }
};

// ==========================================
// 3. EXECUTE EVALUATION
// ==========================================
async function run() {
    console.log(`[EVALUATION] Initiating Walk-Forward Backtesting Harness...`);
    console.log(`[EVALUATION] DATASET_VERSION = SYNTHETIC_WALK_FORWARD_1YR_v2`);
    console.log(`[EVALUATION] SEED = ${SEED}`);
    const evaluator = new ForecastEvaluation(mockDbClient);
    
    // We start at day 100 (April 10, 2025) to have sufficient history.
    // We walk forward 30 steps (e.g., evaluate 30 distinct historical cuts), moving forward 5 days each step.
    const startCutoff = '2025-04-10T00:00:00Z';
    const steps = 30;
    const stepDays = 5;

    console.log('\\n--- 30-DAY FORECAST EVALUATION ---');
    const results30d = await evaluator.runWalkForwardValidation('user-1', startCutoff, steps, stepDays, 30);
    console.log(JSON.stringify(results30d.aggregateMetrics, null, 2));

    console.log('\\n--- 7-DAY FORECAST EVALUATION ---');
    const results7d = await evaluator.runWalkForwardValidation('user-1', startCutoff, steps, stepDays, 7);
    console.log(JSON.stringify(results7d.aggregateMetrics, null, 2));

    console.log('\\n--- 90-DAY FORECAST EVALUATION ---');
    const results90d = await evaluator.runWalkForwardValidation('user-1', startCutoff, steps, stepDays, 90);
    console.log(JSON.stringify(results90d.aggregateMetrics, null, 2));

    console.log('\\n[EVALUATION] Complete.');
}

run().catch(console.error);
