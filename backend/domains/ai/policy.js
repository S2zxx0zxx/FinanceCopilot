import { RiskLevel } from './risk.js';

/**
 * Phase 9: AI Policy Engine
 * One canonical policy engine evaluating permissions, limits, and risks.
 */
export class PolicyEngine {
    static evaluate(user, intentId, riskLevel, requestedToolScope) {
        
        // 1. External Side Effects are strictly disabled in V1
        if (riskLevel === RiskLevel.R5 || requestedToolScope?.includes('side_effect')) {
            return {
                decision: 'DENY',
                reason: 'EXTERNAL_SIDE_EFFECTS_DISABLED_V1',
                requiresConfirmation: false
            };
        }

        // 2. High Impact requires manual flow (no AI autonomy)
        if (riskLevel === RiskLevel.R4) {
            return {
                decision: 'DENY',
                reason: 'HIGH_IMPACT_REQUIRES_AUTHORITY',
                requiresConfirmation: false
            };
        }

        // 3. User-confirmed mutations (e.g. creating goals)
        if (riskLevel === RiskLevel.R3) {
            return {
                decision: 'REQUIRE_CONFIRMATION',
                reason: 'MUTATION_REQUIRES_USER_CONSENT',
                requiresConfirmation: true
            };
        }

        // 4. Fallthrough: Allow R0, R1, R2 read-only or simulation
        return {
            decision: 'ALLOW',
            reason: 'SAFE_READ_OR_SIMULATION',
            requiresConfirmation: false
        };
    }
}
