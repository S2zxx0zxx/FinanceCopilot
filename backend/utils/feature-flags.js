/**
 * Phase 13 Feature Flag & Cohort Governance
 * 
 * Enforces controlled beta rollout. No hidden flags. All features must have explicit expiry.
 */

const FLAGS = {
    'ai_forecast_beta': {
        enabled: true,
        cohorts: ['INTERNAL', 'BETA_COHORT_1'],
        expiry: '2027-01-01',
        owner: 'Product Science'
    },
    'automated_corrections': {
        enabled: false,
        cohorts: ['INTERNAL'], // Extremely limited rollout for safety
        expiry: '2026-10-01',
        owner: 'Data Quality'
    },
    'new_trust_dashboard': {
        enabled: true,
        cohorts: ['ALL'], // Generally available
        expiry: '2026-12-31',
        owner: 'SRE'
    }
};

export const FeatureFlags = {
    /**
     * Determine if a user is in an allowed cohort for a feature flag.
     * In a real DB, user.cohorts would be loaded on session start.
     */
    isEnabled(flagName, userCohorts = ['ALL']) {
        const flag = FLAGS[flagName];
        if (!flag) return false;

        // Check if flag is globally disabled or expired
        if (!flag.enabled) return false;
        if (new Date() > new Date(flag.expiry)) {
            console.warn(`[FLAGS] Flag ${flagName} has expired. It must be retired or renewed.`);
            return false;
        }

        // Check cohort overlap
        return flag.cohorts.includes('ALL') || flag.cohorts.some(c => userCohorts.includes(c));
    },

    getManifest() {
        return FLAGS;
    }
};
