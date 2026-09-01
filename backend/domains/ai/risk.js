/**
 * Phase 9: AI Risk Classifier
 * Independent evaluation of risk levels based on intent and proposed actions.
 */

export const RiskLevel = {
    R0: 'R0', // Informational
    R1: 'R1', // Low-risk financial explanation
    R2: 'R2', // Planning/simulation
    R3: 'R3', // User-confirmed mutation
    R4: 'R4', // High-impact financial action
    R5: 'R5'  // External financial side effect
};

export class RiskClassifier {
    static classify(intentId) {
        switch (intentId) {
            case 'GENERAL_FINANCIAL_EDUCATION':
            case 'UNKNOWN':
                return RiskLevel.R0;

            case 'SPENDING_EXPLANATION':
            case 'TRANSACTION_SEARCH':
            case 'CASHFLOW_QUESTION':
            case 'GOAL_STATUS':
            case 'RECURRING_QUESTION':
            case 'UPCOMING_PAYMENTS':
            case 'MONTH_COMPARISON':
            case 'CATEGORY_EXPLANATION':
            case 'ACCOUNT_QUESTION':
            case 'FINANCIAL_HEALTH':
                return RiskLevel.R1;

            case 'AFFORDABILITY_QUESTION':
            case 'FORECAST_EXPLANATION':
            case 'GOAL_PLANNING':
                return RiskLevel.R2;

            case 'CREATE_GOAL':
            case 'CORRECTION_REQUEST':
                return RiskLevel.R3;

            // R4 and R5 are currently disabled/unmapped from basic NLP intents
            // to enforce safety. Explicit side-effects are blocked.
            
            default:
                return RiskLevel.R0;
        }
    }
}
