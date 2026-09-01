export const PrivacyPolicies = {
    privacy_policy: {
        id: 'privacy_policy',
        version: '2026-08-01',
        title: 'Privacy Policy',
        description: 'Core privacy terms for data handling'
    },
    terms: {
        id: 'terms',
        version: '2026-08-01',
        title: 'Terms of Service',
        description: 'General usage terms'
    },
    ai_processing: {
        id: 'ai_processing',
        version: '2026-08-01',
        title: 'AI Processing Consent',
        description: 'Consent for AI tools to process financial data'
    }
};

export function getActivePolicyVersion(policyId) {
    if (!PrivacyPolicies[policyId]) {
        throw new Error(`Unknown policy ID: ${policyId}`);
    }
    return PrivacyPolicies[policyId].version;
}
