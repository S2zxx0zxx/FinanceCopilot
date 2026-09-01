/**
 * AI Adapter Interface
 * 
 * Defines the canonical contract for interacting with Model Providers.
 */
export class AIInterface {
    /**
     * Legacy extraction method for ingestion.
     */
    async extractStructuredData(prompt, documentText, jsonSchema) {
        throw new Error('Method not implemented.');
    }

    /**
     * Phase 9: Generates structured AI Gateway output.
     * @param {string} systemPrompt 
     * @param {string} userPrompt 
     * @param {object} context - Authorized minimized context JSON
     * @param {object} jsonSchema - Expected structured response schema
     * @param {object} options - Contains budget, model hints, and AbortSignal
     * @returns {Promise<object>} Parsed JSON object with token usage
     */
    async generateStructured(systemPrompt, userPrompt, context, jsonSchema, options = {}) {
        throw new Error('Method not implemented.');
    }

    async capabilities() {
        throw new Error('Method not implemented.');
    }
}
