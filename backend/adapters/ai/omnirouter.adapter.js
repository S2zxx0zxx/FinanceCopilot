import { AIInterface } from './ai.interface.js';
import { AppError } from '../../utils/errors.js';

export class OmniRouterAdapter extends AIInterface {
    constructor() {
        super();
        this.apiKey = process.env.OMNIROUTER_API_KEY;
        this.providerId = 'omnirouter';
    }

    async capabilities() {
        return {
            providerId: this.providerId,
            structured_output: true,
            tool_calling: false, // In V1, we orchestrate tools natively
            streaming: false
        };
    }

    async generateStructured(systemPrompt, userPrompt, context, jsonSchema, options = {}) {
        if (options.signal?.aborted) {
            throw new AppError('Request aborted before provider invocation', 499, false, 'ABORTED');
        }

        if (!this.apiKey) {
            if (process.env.NODE_ENV === 'production') {
                throw new AppError('AI Provider unavailable in production. Configuration missing.', 503, true, 'PROVIDER_UNAVAILABLE');
            }
            console.warn('[OmniRouterAdapter] No API key provided, returning structured dry-run response.');
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    resolve({
                        result: this._generateMockResponse(userPrompt, context, jsonSchema),
                        usage: {
                            tokensIn: 100,
                            tokensOut: 150,
                            estimatedCostPaise: 5
                        },
                        modelId: options.modelHint || 'mock-model-v1',
                        providerId: this.providerId
                    });
                }, 500); // simulate network latency

                if (options.signal) {
                    options.signal.addEventListener('abort', () => {
                        // eslint-disable-next-line no-undef
                        clearTimeout(timer);
                        reject(new AppError('Provider request cancelled by AbortSignal', 499, false, 'ABORTED'));
                    });
                }
            });
        }

        // Real integration to OmniRouter/OpenRouter API
        try {
            const endpoint = process.env.OMNIROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
            
            let contextMessages = [];
            if (Array.isArray(context)) {
                contextMessages = context.map(c => ({ role: c.role, content: c.content }));
            } else if (typeof context === 'object' && context !== null) {
                contextMessages = [{ role: 'system', content: `CONTEXT:\n${JSON.stringify(context)}` }];
            }

            // Build messages array
            const messages = [
                { role: 'system', content: systemPrompt },
                ...contextMessages,
                { role: 'user', content: userPrompt }
            ];

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://fincopilot.local',
                    'X-Title': 'FinCopilot'
                },
                body: JSON.stringify({
                    model: options.modelHint || 'openai/gpt-4o-mini',
                    messages: messages,
                    response_format: jsonSchema ? { type: 'json_object' } : undefined
                }),
                signal: options.signal
            });

            if (!response.ok) {
                const errBody = await response.text();
                throw new AppError(`Provider API error: ${response.status} ${response.statusText}`, 502, false, 'PROVIDER_ERROR', { details: errBody });
            }

            const data = await response.json();
            const choice = data.choices[0];
            const content = choice.message.content;
            
            // Attempt to parse JSON structure
            let parsedResult;
            try {
                parsedResult = JSON.parse(content);
            } catch {
                throw new AppError('Provider failed to return valid JSON', 502, false, 'PROVIDER_FORMAT_ERROR');
            }

            return {
                result: parsedResult,
                usage: {
                    tokensIn: data.usage?.prompt_tokens || 0,
                    tokensOut: data.usage?.completion_tokens || 0,
                    estimatedCostPaise: (data.usage?.total_cost || 0) * 100 * 80 // approx conversion if cost provided
                },
                modelId: data.model,
                providerId: this.providerId
            };

        } catch (err) {
            if (err.name === 'AbortError') {
                throw new AppError('Provider request cancelled by timeout', 499, false, 'ABORTED');
            }
            throw err;
        }
    }

    _generateMockResponse(_prompt, _context, _jsonSchema) {
        // Safe structural mock matching the Gateway response schema
        return {
            answer: "This is a dry-run orchestrator response enforcing strict structured output.",
            evidence: [{ source: "mock", detail: "API key was omitted" }],
            assumptions: [],
            impact: [],
            options: [],
            action: null,
            requires_confirmation: false,
            trust: 'LOW'
        };
    }
}
