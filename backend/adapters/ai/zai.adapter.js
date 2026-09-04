import { AIInterface } from './ai.interface.js';
import { AppError } from '../../utils/errors.js';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export class ZAIAdapter extends AIInterface {
    constructor() {
        super();
        this.providerId = 'zai';
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (this.geminiApiKey) {
            this.ai = new GoogleGenAI({ apiKey: this.geminiApiKey });
        }
        if (this.openaiApiKey) {
            this.openai = new OpenAI({ apiKey: this.openaiApiKey });
        }
    }

    async capabilities() {
        return {
            providerId: this.providerId,
            structured_output: true,
            tool_calling: false,
            streaming: false
        };
    }

    async generateStructured(systemPrompt, userPrompt, context, jsonSchema, options = {}) {
        if (options.signal?.aborted) {
            throw new AppError('Request aborted before provider invocation', 499, false, 'ABORTED');
        }

        if (!this.geminiApiKey && !this.openaiApiKey) {
            if (process.env.NODE_ENV === 'production') {
                throw new AppError('AI Provider unavailable. Configuration missing.', 503, true, 'PROVIDER_UNAVAILABLE');
            }
            return {
                result: this._generateMockResponse(userPrompt, context, jsonSchema),
                usage: { tokensIn: 100, tokensOut: 150, estimatedCostPaise: 5 },
                modelId: 'mock-model-v1',
                providerId: this.providerId
            };
        }

        let contextText = '';
        if (Array.isArray(context)) {
            contextText = context.map(c => `${c.role}: ${c.content}`).join('\n');
        } else if (typeof context === 'object' && context !== null) {
            contextText = `CONTEXT:\n${JSON.stringify(context)}`;
        }

        const fullPrompt = `${systemPrompt}\n\n${contextText}\n\nUser: ${userPrompt}`;

        // Attempt Gemini First
        if (this.geminiApiKey && this.ai) {
            try {
                const response = await this.ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: fullPrompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: jsonSchema
                    }
                });

                let content = response.text;
                if (!content) throw new Error("Empty response from Gemini");

                const result = JSON.parse(content);

                // FIX (audit P1 #29): use REAL token usage from the provider
                // response. Gemini SDK exposes it via `response.usage_metadata`
                // { promptTokenCount, candidatesTokenCount, totalTokenCount }.
                const usageMeta = response.usageMetadata || response.usage_metadata || {};
                const tokensIn = Number(usageMeta.promptTokenCount || 0);
                const tokensOut = Number(usageMeta.candidatesTokenCount || usageMeta.totalTokenCount || 0);
                // Real Gemini Flash cost ~ ₹0.006 per 1M tokens (~₹0.000000006/token).
                // Charge 0.001 paise/token pre-flight; refund the difference when
                // we know the real usage. 1 paise = 0.01 rupee.
                const estimatedCostPaise = Math.ceil((tokensIn + tokensOut) * 0.001);

                return {
                    result,
                    usage: { tokensIn, tokensOut, estimatedCostPaise },
                    modelId: 'gemini-2.5-flash',
                    providerId: this.providerId
                };
            } catch (err) {
                console.warn('[ZAIAdapter] Gemini failed, falling back to OpenAI:', err.message);
                if (!this.openaiApiKey) {
                    throw new AppError('Gemini failed and no OpenAI fallback configured.', 502, false, 'PROVIDER_ERROR');
                }
            }
        }

        // Fallback to OpenAI
        if (this.openaiApiKey && this.openai) {
            try {
                let contextMessages = [];
                if (Array.isArray(context)) {
                    contextMessages = context.map(c => ({ role: c.role === 'model' ? 'assistant' : c.role, content: c.content }));
                } else if (typeof context === 'object' && context !== null) {
                    contextMessages = [{ role: 'system', content: `CONTEXT:\n${JSON.stringify(context)}` }];
                }

                const messages = [
                    { role: 'system', content: systemPrompt },
                    ...contextMessages,
                    { role: 'user', content: userPrompt }
                ];

                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: messages,
                    response_format: { type: 'json_object' }
                });

                const content = response.choices[0].message.content;
                const result = JSON.parse(content);

                // FIX (audit P1 #29): real OpenAI usage object — `response.usage`
                // has { prompt_tokens, completion_tokens, total_tokens }.
                const usage = response.usage || {};
                const tokensIn = Number(usage.prompt_tokens || 0);
                const tokensOut = Number(usage.completion_tokens || 0);
                const estimatedCostPaise = Math.ceil((tokensIn + tokensOut) * 0.001);

                return {
                    result,
                    usage: { tokensIn, tokensOut, estimatedCostPaise },
                    modelId: 'gpt-4o-mini',
                    providerId: this.providerId
                };
            } catch (err) {
                console.error('[ZAIAdapter] OpenAI fallback failed:', err);
                throw new AppError('Both Gemini and OpenAI failed.', 502, false, 'PROVIDER_ERROR');
            }
        }
    }
}
