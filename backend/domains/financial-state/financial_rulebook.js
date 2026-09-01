/**
 * Phase 5 - Financial Rulebook
 * Canonical Source of Truth for pending money policies, rounding, and storage units.
 */
export const FinancialRulebook = {
    // Exact Money Configuration
    STORAGE_UNIT: 'paise',
    DECIMAL_PRECISION: 0,
    ROUNDING_MODE: 'none', // Strictly integer math

    // Pending Money Policy (SINGLE SOURCE OF TRUTH)
    // Ensures that pending debits act conservatively on Safe-to-Spend
    // and pending credits do not artificially inflate available cash.
    PENDING_POLICY: {
        VERSION: 'v1.0.0',
        DEBITS: {
            // A pending debit reduces available balance immediately
            AFFECTS_AVAILABLE_BALANCE: true,
            WEIGHT: 1.0 // 100% impact
        },
        CREDITS: {
            // A pending credit does NOT increase available balance until posted
            AFFECTS_AVAILABLE_BALANCE: false,
            WEIGHT: 0.0 // 0% impact
        }
    },

    // Default configuration if user lacks safe_to_spend_configurations row
    DEFAULT_SAFETY_BUFFER_PAISE: 500000, // ₹5,000.00
    DEFAULT_STS_HORIZON_DAYS: 30
};
