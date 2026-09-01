/**
 * Phase 9: AI Validator
 * Ensures that LLM responses do not hallucinate numbers or violate safety policies.
 */

export class Validator {
    /**
     * Checks if the numerical claims in the LLM text output are grounded in the deterministic context.
     * @param {object} structuredLlmOutput 
     * @param {object} deterministicContext 
     */
    static validateEvidence(structuredLlmOutput, deterministicContext) {
        if (!structuredLlmOutput || !structuredLlmOutput.answer) return { isValid: true };
        
        // 1. Extract context numerical values in paise
        const contextPaiseValues = new Set();
        const extractPaise = (obj) => {
            if (!obj) return;
            if (typeof obj === 'object') {
                for (const [key, val] of Object.entries(obj)) {
                    if (key.endsWith('_paise') && typeof val === 'number') {
                        contextPaiseValues.add(val);
                    } else if (typeof val === 'object') {
                        extractPaise(val);
                    }
                }
            }
        };
        extractPaise(deterministicContext);

        // 2. Extract monetary claims from LLM text
        // Matches: ₹500, 500 INR, 500.00, Rs. 500, 500 rupees
        const answer = structuredLlmOutput.answer;
        const regexPrefix = /(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{2})?)/gi;
        const regexSuffix = /([\d,]+(?:\.\d{2})?)\s*(?:INR|rupees)/gi;
        
        const extractAmount = (match) => {
            const numStr = match[1].replaceAll(',', '');
            const parsedRupees = Number.parseFloat(numStr);
            if (!Number.isNaN(parsedRupees)) {
                const claimedPaise = Math.round(parsedRupees * 100);
                if (!contextPaiseValues.has(claimedPaise)) {
                    return claimedPaise;
                }
            }
            return null;
        };

        let match;
        while ((match = regexPrefix.exec(answer)) !== null) {
            const claimedPaise = extractAmount(match);
            if (claimedPaise !== null) {
                return { isValid: false, reason: `Hallucination Risk: Model claimed monetary value (${claimedPaise} paise) not found in authoritative context.` };
            }
        }
        while ((match = regexSuffix.exec(answer)) !== null) {
            const claimedPaise = extractAmount(match);
            if (claimedPaise !== null) {
                return { isValid: false, reason: `Hallucination Risk: Model claimed monetary value (${claimedPaise} paise) not found in authoritative context.` };
            }
        }

        return { isValid: true };
    }

    /**
     * Checks for prompt injection echoes or disallowed regulatory language.
     * @param {object} structuredLlmOutput 
     */
    static validateSafety(structuredLlmOutput) {
        const stringifiedOutput = JSON.stringify(structuredLlmOutput).toLowerCase();
        
        const bannedPhrases = [
            'guaranteed return',
            'guaranteed savings',
            'best investment',
            'ignore previous instructions',
            'as an ai'
        ];

        for (const phrase of bannedPhrases) {
            if (stringifiedOutput.includes(phrase)) {
                return {
                    isValid: false,
                    reason: `Safety Violation: Output contained disallowed phrase "${phrase}"`
                };
            }
        }

        return { isValid: true };
    }
}
