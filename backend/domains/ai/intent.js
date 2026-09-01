/**
 * Phase 9: AI Intent Classifier
 * Categorizes natural language into strict canonical intents.
 */

export const IntentTaxonomy = {
    SPENDING_EXPLANATION: 'SPENDING_EXPLANATION',
    TRANSACTION_SEARCH: 'TRANSACTION_SEARCH',
    CASHFLOW_QUESTION: 'CASHFLOW_QUESTION',
    AFFORDABILITY_QUESTION: 'AFFORDABILITY_QUESTION',
    GOAL_STATUS: 'GOAL_STATUS',
    GOAL_PLANNING: 'GOAL_PLANNING',
    RECURRING_QUESTION: 'RECURRING_QUESTION',
    UPCOMING_PAYMENTS: 'UPCOMING_PAYMENTS',
    FINANCIAL_HEALTH: 'FINANCIAL_HEALTH',
    FORECAST_EXPLANATION: 'FORECAST_EXPLANATION',
    MONTH_COMPARISON: 'MONTH_COMPARISON',
    CATEGORY_EXPLANATION: 'CATEGORY_EXPLANATION',
    ACCOUNT_QUESTION: 'ACCOUNT_QUESTION',
    CORRECTION_REQUEST: 'CORRECTION_REQUEST',
    GENERAL_FINANCIAL_EDUCATION: 'GENERAL_FINANCIAL_EDUCATION',
    CREATE_GOAL: 'CREATE_GOAL',
    UNKNOWN: 'UNKNOWN'
};

export class IntentClassifier {
    /**
     * In V1, this is a rule-based/regex fallback classifier until the model is tuned.
     * Real implementation would use an L1 fast LLM router or embeddings.
     */
    static classify(message) {
        const text = message.toLowerCase();
        
        let intent = IntentTaxonomy.UNKNOWN;
        let ambiguity = false;

        if (text.includes('spend') || text.includes('spent')) {
            if (text.includes('month') && text.includes('last')) intent = IntentTaxonomy.MONTH_COMPARISON;
            else intent = IntentTaxonomy.SPENDING_EXPLANATION;
        } else if (text.includes('can i afford') || text.includes('safe to spend')) {
            intent = IntentTaxonomy.AFFORDABILITY_QUESTION;
            if (text.includes('afford') && text.includes('spend')) ambiguity = true; // e.g. "how much can I spend on food?" vs "safe to spend"
        } else if (text.includes('goal') && text.includes('create')) {
            intent = IntentTaxonomy.CREATE_GOAL;
        } else if (text.includes('goal') && text.includes('plan')) {
            intent = IntentTaxonomy.GOAL_PLANNING;
        } else if (text.includes('forecast') || text.includes('next month')) {
            intent = IntentTaxonomy.FORECAST_EXPLANATION;
        } else if (text.includes('health') || text.includes('score')) {
            intent = IntentTaxonomy.FINANCIAL_HEALTH;
        }

        return {
            intent_id: intent,
            confidence: intent === IntentTaxonomy.UNKNOWN ? 0.0 : 0.85,
            ambiguity_flags: ambiguity,
            classifier_version: 'v1.0.0'
        };
    }
}
