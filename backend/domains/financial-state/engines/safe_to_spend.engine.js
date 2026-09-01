import { FinancialStateRepo } from '../../../db/repositories/financial_state.repo.js';
import { FinancialRulebook } from '../financial_rulebook.js';

export class SafeToSpendEngine {
    
    /**
     * Derives deterministic Safe-To-Spend (STS) based on exact integer formula.
     * Core Formula: Available Cash + Expected Income - Upcoming Commitments - Essential Spending - Safety Buffer
     */
    static async calculateAndSnapshot(userId) {
        
        // 1. Fetch available cash (apply pending policies)
        const balanceResult = await FinancialStateRepo.getAccountBalances(userId);
        const availableCash = balanceResult.available_balance_paise;
        
        // 2. Fetch configurations (Safety Buffer, Horizon)
        const stsConfig = await FinancialStateRepo.getStsConfig(userId);
        const horizonDays = stsConfig.horizon_days;
        const safetyBuffer = stsConfig.safety_buffer_paise;
        
        // Calculate the horizon cutoff date
        const horizonDate = new Date();
        horizonDate.setDate(horizonDate.getDate() + horizonDays);
        const horizonDateStr = horizonDate.toISOString().split('T')[0];

        // 3. Expected Income (Simplified for Phase 5 to just zero or explicit configuration)
        // A full prediction engine is Phase 6. For now, we only use explicit known incomes.
        // If we don't have explicit future income, we default to 0 to remain conservative.
        const expectedIncome = 0; 
        
        // 4. Upcoming Commitments
        const upcomingCommitments = await FinancialStateRepo.getUpcomingCommitments(userId, horizonDateStr);

        // 5. Essential Spending
        // If the user has explicitly defined essential categories in config, we could calculate average past spending.
        // For strict determinism in V1, unless hard configured, we default to 0 or manual configuration.
        const essentialSpending = 0;
        
        // 6. STS Formula Execution
        const rawSts = availableCash + expectedIncome - upcomingCommitments - essentialSpending - safetyBuffer;
        const finalSts = rawSts > 0 ? rawSts : 0; // STS cannot be negative

        // 7. Trust / Explainability Metrics
        // Simple mock for freshness/coverage for demonstration of the trust model.
        // Real logic would check statements table MAX(period_end).
        const freshness = 'fresh';
        const coverage = 'full';
        const confidence = 'high';

        // 8. Construct immutable input payload
        const inputSnapshot = {
            formula: 'Available Cash + Expected Income - Upcoming Commitments - Essential Spending - Safety Buffer',
            inputs: {
                available_cash_paise: availableCash,
                expected_income_paise: expectedIncome,
                upcoming_commitments_paise: upcomingCommitments,
                essential_spending_paise: essentialSpending,
                safety_buffer_paise: safetyBuffer
            },
            horizon_days: horizonDays,
            rulebook_version: FinancialRulebook.PENDING_POLICY.VERSION
        };

        // 9. Persist calculation snapshot
        const snapshotId = await FinancialStateRepo.saveSnapshot(
            userId,
            'safe_to_spend',
            finalSts,
            inputSnapshot,
            freshness,
            coverage,
            confidence
        );

        return {
            snapshot_id: snapshotId,
            safe_to_spend_paise: finalSts,
            currency: 'INR',
            trust: confidence
        };
    }
}
