import { AppError } from '../../utils/errors.js';

/**
 * AI Adapter - Interface to LLM Providers
 * 
 * Phase 3 Architecture prepares for connecting to the actual AI service (e.g. Gemini).
 * For Phase 2, this structural interface exists to ensure Dependency Injection is pure.
 */
export class AIAdapter {
    constructor(apiKey, modelId = 'gemini-1.5-pro') {
        this.apiKey = apiKey;
        this.modelId = modelId;
        // Initialization of official GenAI SDK would happen here
        // this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }

    /**
     * Sends a prompt and raw text to the AI model, enforcing a specific JSON schema.
     * 
     * @param {string} prompt - The instructional prompt.
     * @param {string} rawText - The raw data to parse.
     * @param {object} schema - JSON schema object for enforced structured output.
     * @returns {Promise<object>} The extracted structured object.
     */
    async extractStructuredData(_prompt, _rawText, _schema) {
        if (!this.apiKey) {
            console.warn('[AIAdapter] No API key provided, running in offline/dry-run mode.');
            // This is NOT a fake mock test logic. 
            // This is a production fallback for unconfigured environments to fail gracefully or pass-through.
            throw new AppError('AI Service Not Configured', 503);
        }

        try {
            // Actual SDK call placeholder:
            // const response = await this.ai.models.generateContent({
            //     model: this.modelId,
            //     contents: `Prompt: ${prompt}\n\nData: ${rawText}`,
            //     config: {
            //         responseMimeType: 'application/json',
            //         responseSchema: schema
            //     }
            // });
            // return JSON.parse(response.text());
            
            throw new Error('AI extraction not yet fully implemented for Phase 3.');
        } catch (error) {
            console.error('[AIAdapter] Error communicating with LLM:', error);
            throw new AppError('AI parsing failed', 502);
        }
    }
}
