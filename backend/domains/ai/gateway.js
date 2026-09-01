import { IntentClassifier } from './intent.js';
import { RiskClassifier, RiskLevel } from './risk.js';
import { PolicyEngine } from './policy.js';
import { ContextPlanner } from './planner.js';
import { ToolExecutor } from './tools.js';
import { Validator } from './validator.js';
import { providerRegistry } from '../../adapters/ai/provider.registry.js';
import { AppError } from '../../utils/errors.js';

/**
 * Phase 9: AI Gateway Orchestrator
 * The canonical entry point enforcing the strict orchestration pipeline.
 */
/* global AbortController, clearTimeout */
export class AIGateway {
    constructor(dbClient) {
        this.dbClient = dbClient;
        this.contextPlanner = new ContextPlanner(dbClient);
        this.toolExecutor = new ToolExecutor(dbClient);
        this.provider = providerRegistry.getProvider('omnirouter'); // V1 default
        
        // Kill Switch: Should be driven by environment variable or config DB in prod
        this.isAIEnabled = process.env.AI_KILL_SWITCH !== 'ENGAGED';
    }

    async handleQuery(userId, message, _options = {}) {
        const startTime = Date.now();

        // 0. Kill Switch Guard
        if (!this.isAIEnabled) {
            return this._buildErrorResponse('AI systems are currently offline for maintenance', 'KILL_SWITCH_ENGAGED');
        }

        // 1. Intent & Risk Classification
        const intentResult = IntentClassifier.classify(message);
        const riskLevel = RiskClassifier.classify(intentResult.intent_id);

        // 2. Policy Check
        const toolScope = intentResult.intent_id === 'CREATE_GOAL' ? ['goals:write'] : [];
        const policyDecision = PolicyEngine.evaluate(userId, intentResult.intent_id, riskLevel, toolScope);

        if (policyDecision.decision === 'DENY') {
            return this._buildErrorResponse('Request blocked by policy', policyDecision.reason);
        }

        // 3. Context Planning & Data Minimization
        const context = await this.contextPlanner.planContext(userId, intentResult.intent_id);
        const executedTools = [];

        // 4. Deterministic Tool Execution (Pre-fetching authoritative truth)
        if (intentResult.intent_id === 'AFFORDABILITY_QUESTION') {
            const toolStartTime = Date.now();
            const toolResult = await this.toolExecutor.executeTool('affordability', {}, userId);
            context.toolOutputs = { affordability: toolResult.data };
            executedTools.push({
                tool_id: 'affordability',
                tool_version: 'v1.0.0',
                policy_decision: 'PRE_FETCH_ALLOWED',
                minimized_arguments: {},
                latency_ms: Date.now() - toolStartTime,
                status: 'SUCCESS'
            });
        }

        // 5. Cost Governor (Atomic Pre-flight check)
        const estimatedTokensIn = (message.length + JSON.stringify(context).length) / 4;
        const estimatedCostPaise = Math.ceil(estimatedTokensIn * 2); 
        
        try {
            const budgetCheckQuery = `
                UPDATE ai_user_budgets 
                SET consumed_paise = consumed_paise + $1, last_updated = NOW() 
                WHERE user_id = $2 AND consumed_paise + $1 <= budget_limit_paise 
                RETURNING consumed_paise
            `;
            const budgetRes = await this.dbClient.query(budgetCheckQuery, [estimatedCostPaise, userId]);
            if (budgetRes.rows.length === 0) {
                // If 0 rows returned, either budget exceeded or user budget row missing
                return this._buildErrorResponse('Request blocked by cost governor', 'TOKEN_BUDGET_EXCEEDED');
            }
        } catch (err) {
            console.error('[AIGateway] Budget check failed:', err);
            // Fail-closed for high risk AI operations
            return this._buildErrorResponse('Cost governance unavailable', 'SYSTEM_ERROR');
        }

        // 6. LLM Router / Reasoning (with True Cancellation)
        const jsonSchema = {
            type: "object",
            properties: {
                answer: { type: "string" },
                evidence: { type: "array" },
                assumptions: { type: "array" },
                impact: { type: "array" },
                options: { type: "array" },
                action: { type: "object", nullable: true },
                requires_confirmation: { type: "boolean" },
                trust: { type: "string" }
            },
            required: ["answer", "evidence", "assumptions", "impact", "options", "requires_confirmation", "trust"]
        };

        const systemPrompt = "You are FinCopilot AI. Base all answers strictly on the provided context. Do not invent financial data.";
        
        let llmResponse;
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10s deadline

        try {
            llmResponse = await this.provider.generateStructured(
                systemPrompt, 
                message, 
                context, 
                jsonSchema, 
                { modelHint: 'omni-fast', signal: abortController.signal }
            );
        } catch (err) {
            // Rollback budget on failure since tokens were not consumed
            await this.dbClient.query(`UPDATE ai_user_budgets SET consumed_paise = GREATEST(0, consumed_paise - $1) WHERE user_id = $2`, [estimatedCostPaise, userId]).catch(() => {});
            return this._buildErrorResponse('AI Provider failed or timed out', err.message);
        } finally {
            clearTimeout(timeoutId);
        }

        // 7. Evidence & Safety Validation
        const evidenceCheck = Validator.validateEvidence(llmResponse.result, context);
        if (!evidenceCheck.isValid) {
            return this._buildErrorResponse('Evidence validation failed', evidenceCheck.reason);
        }

        const safetyCheck = Validator.validateSafety(llmResponse.result);
        if (!safetyCheck.isValid) {
            return this._buildErrorResponse('Safety validation failed', safetyCheck.reason);
        }

        // 8. Policy Override (Force confirmation for mutations)
        if (policyDecision.requiresConfirmation) {
            llmResponse.result.requires_confirmation = true;
            if (!llmResponse.result.action) {
                // Failsafe in case LLM missed generating the action payload
                llmResponse.result.action = { tool: intentResult.intent_id, arguments: {} };
            }
        }

        // 9. Audit Logging (Real DB Insert for Lineage)
        const latency = Date.now() - startTime;
        const auditPayload = {
            userId,
            intentResult,
            riskLevel,
            llmResponse,
            latency,
            status: 'SUCCESS',
            context,
            executedTools
        };
        const interactionId = await this._auditInteraction(auditPayload);

        // 10. Return final structured response
        return {
            interaction_id: interactionId,
            status: 'SUCCESS',
            ...llmResponse.result
        };
    }

    async handleConfirm(userId, interactionId, actionPayload) {
        // 1. Re-validate policy for the specific mutation action
        const policyDecision = PolicyEngine.evaluate(userId, 'CREATE_GOAL', RiskLevel.R3, ['goals:write']);
        if (policyDecision.decision === 'DENY') {
            throw new AppError('Confirmation blocked by policy', 403);
        }

        // 2. Execute deterministic tool
        const toolStartTime = Date.now();
        const toolResult = await this.toolExecutor.executeTool('create_goal', actionPayload, userId);

        // 3. Log mutation tool invocation
        await this.dbClient.query(`
            INSERT INTO ai_tool_invocations (interaction_id, user_id, tool_id, tool_version, policy_decision, minimized_arguments, latency_ms, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [interactionId, userId, 'create_goal', 'v1.0.0', 'CONFIRMED', JSON.stringify(actionPayload), Date.now() - toolStartTime, 'SUCCESS']).catch(() => {});

        // 4. Return receipt
        return {
            status: 'SUCCESS',
            receipt: toolResult.data
        };
    }

    _buildErrorResponse(message, details) {
        return {
            status: 'ERROR',
            answer: "I cannot fulfill this request due to safety or policy constraints.",
            error: { message, details }
        };
    }

    async _auditInteraction(payload) {
        const { userId, intentResult, riskLevel, llmResponse, latency, status, context, executedTools } = payload;
        try {
            await this.dbClient.query('BEGIN');

            const query = `
                INSERT INTO ai_interactions (
                    user_id, intent, risk_level, context_scope, provider_id, model_id, 
                    tokens_in, tokens_out, estimated_cost_paise, latency_ms, status, safety_state
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING interaction_id
            `;
            const values = [
                userId, 
                intentResult.intent_id, 
                riskLevel,
                JSON.stringify({ keys: Object.keys(context) }), 
                llmResponse.providerId || 'unknown',
                llmResponse.modelId || 'unknown',
                llmResponse.usage?.tokensIn || 0,
                llmResponse.usage?.tokensOut || 0,
                llmResponse.usage?.estimatedCostPaise || 0,
                latency,
                status,
                'VALIDATED'
            ];
            
            const res = await this.dbClient.query(query, values);
            const interactionId = res.rows[0]?.interaction_id;

            // Log tool lineage
            for (const tool of executedTools) {
                await this.dbClient.query(`
                    INSERT INTO ai_tool_invocations (interaction_id, user_id, tool_id, tool_version, policy_decision, minimized_arguments, latency_ms, status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [interactionId, userId, tool.tool_id, tool.tool_version, tool.policy_decision, JSON.stringify(tool.minimized_arguments), tool.latency_ms, tool.status]);
            }

            await this.dbClient.query('COMMIT');
            return interactionId || 'fallback-uuid';
        } catch (err) {
            await this.dbClient.query('ROLLBACK');
            console.error('[AIGateway] Failed to write audit log:', err);
            return 'fallback-uuid';
        }
    }
}
