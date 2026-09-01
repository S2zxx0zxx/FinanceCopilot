/**
 * Phase 5 - Canonical Pending Money Policy
 * Defines exactly how pending transactions affect authoritative financial state.
 */
export const PendingPolicy = {
    VERSION: 'v1.0.0',
    STORAGE_UNIT: 'paise',
    DECIMAL_PRECISION: 0,
    ROUNDING_MODE: 'none',

    DEBITS: {
        AFFECTS_AVAILABLE_BALANCE: true,
        WEIGHT: 1.0 // 100% impact
    },
    
    CREDITS: {
        AFFECTS_AVAILABLE_BALANCE: false,
        WEIGHT: 0.0 // 0% impact until posted
    }
};
