import { FinancialStateRepo } from '../../../db/repositories/financial_state.repo.js';
import { PendingPolicy } from '../pending-policy/pending.policy.js';
import { SnapshotEngine } from '../snapshots/snapshot.engine.js';
import { FreshnessEngine } from '../freshness/freshness.engine.js';
import { CoverageEngine } from '../coverage/coverage.engine.js';
import { ExpectedIncomePolicy } from '../expected-income/expected_income.policy.js';
import { EssentialSpendingPolicy } from '../essential-spending/essential_spending.policy.js';

export class SafeToSpendEngine {
    
    /**
     * Derives deterministic Safe-To-Spend (STS) using all individual engines.
     */
    static async calculateAndSnapshot(userId) {
        
        // 1. Fetch available cash (apply pending policies)
        const balanceResult = await FinancialStateRepo.getAccountBalances(userId);
        const availableCash = balanceResult.available_balance_paise;
        
        // 2. Fetch configurations
        // NOTE: pg driver returns BIGINT/INTEGER as strings — must parseInt for exact arithmetic
        const stsConfig = await FinancialStateRepo.getStsConfig(userId);
        const horizonDays = parseInt(stsConfig.horizon_days, 10);
        const safetyBuffer = parseInt(stsConfig.safety_buffer_paise, 10);
        
        // Horizon cutoff date
        const horizonDate = new Date();
        horizonDate.setDate(horizonDate.getDate() + horizonDays);
        const horizonDateStr = horizonDate.toISOString().split('T')[0];

        // 3. Expected Income
        const expectedIncomePolicyResult = ExpectedIncomePolicy.calculateExpectedIncome(userId, horizonDateStr);
        const expectedIncome = expectedIncomePolicyResult.expected_income_paise; 
        
        // 4. Upcoming Commitments
        const commitmentResult = await FinancialStateRepo.getUpcomingCommitments(userId, horizonDateStr);
        const upcomingCommitments = commitmentResult.upcoming_commitments_paise;

        // 5. Essential Spending
        const essentialSpendingPolicyResult = EssentialSpendingPolicy.calculateEssentialSpending(userId, stsConfig, horizonDateStr);
        const essentialSpending = essentialSpendingPolicyResult.essential_spending_paise;
        
        // 6. STS Formula Execution
        const rawSts = availableCash + expectedIncome - upcomingCommitments - essentialSpending - safetyBuffer;
        const finalSts = rawSts > 0 ? rawSts : 0; // Cannot be negative

        // 7. Trust / Explainability Metrics
        const freshness = FreshnessEngine.calculateFreshness(new Date().toISOString());
        
        const coverageMetrics = await FinancialStateRepo.getCoverageMetrics(userId);
        const coverage = CoverageEngine.calculateCoverage(coverageMetrics.totalAccounts, coverageMetrics.syncedAccounts);
        
        let confidence = 'high';
        if (coverage === 'no_coverage' || freshness === 'stale') confidence = 'low';
        else if (coverage === 'partial' || freshness === 'unknown') confidence = 'medium';

        // Evidence completeness is deliberately separate from coverage/freshness trust.
        // This prevents the UI from implying that currently-unmodelled planning inputs
        // (for example future income or essential-spend baselines) are verified facts.
        const planningEvidence = {
            expected_income: expectedIncomePolicyResult.evidence_status || 'UNKNOWN',
            essential_spending: essentialSpendingPolicyResult.evidence_status || 'UNKNOWN'
        };
        const evidenceStates = Object.values(planningEvidence);
        const planningDataStatus = evidenceStates.includes('NO_EVIDENCE')
            ? 'incomplete'
            : evidenceStates.includes('PARTIAL_EVIDENCE') || evidenceStates.includes('UNKNOWN')
                ? 'partial'
                : 'complete';

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
            evidence: planningEvidence,
            planning_data_status: planningDataStatus,
            horizon_days: horizonDays,
            rulebook_version: PendingPolicy.VERSION
        };

        // 9. Persist calculation snapshot
        const snapshotId = await SnapshotEngine.saveSnapshot(
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
            trust: confidence,
            horizon_days: horizonDays,
            planning_data_status: planningDataStatus,
            planning_evidence: planningEvidence
        };
    }
}
