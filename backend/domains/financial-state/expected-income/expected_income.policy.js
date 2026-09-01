export class ExpectedIncomePolicy {
    static VERSION = 'v1.0.0';

    /**
     * Expected Income Policy V1
     * 
     * RULE: Expected income must come from approved evidence (user-confirmed future income
     * or explicit schedule). Do NOT infer future income solely from historical salary
     * without explicit product permission.
     * 
     * Since V1 schema does not currently hold expected_income schedules, this returns 0
     * and flags the confidence state.
     */
    static calculateExpectedIncome(_userId, _horizonDate) {
        return {
            expected_income_paise: 0,
            evidence_status: 'NO_EVIDENCE',
            policy_version: this.VERSION,
            reason: 'V1 does not infer future income from history without explicit schedules.'
        };
    }
}
