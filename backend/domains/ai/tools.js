/**
 * Phase 9: AI Tool Registry & Deterministic Execution
 * Maps AI intent capabilities to authoritative backend services.
 */

import { CashflowService } from '../planning/cashflow/cashflow.service.js';
import { SafeToSpendEngine } from '../financial-state/safe-to-spend/safe_to_spend.engine.js';
import { GoalsService } from '../planning/goals/goals.service.js';

export const ToolRegistry = {
    get_cashflow: {
        id: 'get_cashflow',
        version: 'v1.0.0',
        risk_level: 'R1',
        read_scopes: ['transactions:read'],
        write_scopes: [],
        required_consent: [],
        max_cost: 10, // arbitrary cost units
        timeout_ms: 2000
    },
    affordability: {
        id: 'affordability',
        version: 'v1.0.0',
        risk_level: 'R2',
        read_scopes: ['financial_state:read'],
        write_scopes: [],
        required_consent: [],
        max_cost: 20,
        timeout_ms: 3000
    },
    create_goal: {
        id: 'create_goal',
        version: 'v1.0.0',
        risk_level: 'R3',
        read_scopes: ['goals:read'],
        write_scopes: ['goals:write'],
        required_consent: ['goal_mutation'],
        max_cost: 30,
        timeout_ms: 5000,
        approval_policy: 'REQUIRE_CONFIRMATION'
    }
};

export class ToolExecutor {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    /**
     * Executes the AI tool by routing directly to the Phase 5/7/8 controller methods.
     */
    async executeTool(toolId, args, userId) {
        const toolMeta = ToolRegistry[toolId];
        if (!toolMeta) {
            throw new Error(`Tool ${toolId} not found in registry`);
        }

        switch (toolId) {
            case 'get_cashflow': {
                const cashflow = await CashflowService.getCashflowPlan(userId, '30d');
                return { success: true, data: cashflow };
            }
            case 'affordability': {
                // R-007/R-017: True Database Lookup, NO MOCKS
                const stsResult = await SafeToSpendEngine.calculateAndSnapshot(userId);
                const purchaseAmount = args?.amount ? Number(args.amount) : 0;
                
                return { 
                    success: true, 
                    data: {
                        ...stsResult,
                        purchase_amount: purchaseAmount,
                        is_affordable: stsResult.safe_balance_paise >= purchaseAmount,
                        remaining_balance_after_purchase: stsResult.safe_balance_paise - purchaseAmount
                    }
                };
            }
            case 'create_goal': {
                if (args?.name && args?.target_amount_paise) {
                    const goal = await GoalsService.createGoal(userId, args);
                    return { success: true, data: goal };
                }
                return { success: false, data: { status: 'MISSING_ARGS' } };
            }
            default:
                throw new Error(`Execution for ${toolId} not mapped`);
        }
    }
}
