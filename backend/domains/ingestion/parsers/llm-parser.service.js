/**
 * LLM Parser Service (Strict Phase 2 Boundary)
 * 
 * Takes raw OCR text and uses the AI Adapter to extract structured financial data.
 * Adheres to ADR-001/003: ONLY extracts raw source fields. 
 * Normalization (categories, exact merchants) is strictly forbidden here.
 */
export class LLMParserService {
    constructor(aiAdapter) {
        this.aiAdapter = aiAdapter;
    }

    /**
     * Parses a bank statement OCR text into RAW extraction records.
     */
    async parseRawStatement(rawText) {
        const schema = {
            type: "object",
            properties: {
                transactions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            raw_date_text: { type: "string" },
                            raw_description_text: { type: "string" },
                            raw_amount_text: { type: "string" },
                            raw_direction_text: { type: "string", enum: ["debit", "credit"] }
                        },
                        required: ["raw_date_text", "raw_description_text", "raw_amount_text"]
                    }
                }
            }
        };

        const prompt = `You are a strict financial data extraction system. 
        Extract all transaction rows from the following bank statement text EXACTLY as they appear.
        Do not normalize or categorize the data.
        Extract the exact string for date, description, and amount.
        Infer the direction (debit or credit) based on the column or context if explicitly shown.`;

        // 1. Send to AI
        const parsedData = await this.aiAdapter.extractStructuredData(prompt, rawText, schema);

        if (!parsedData || !parsedData.transactions) {
            throw new Error('AI Parser failed to return expected raw transactions structure.');
        }

        // Return the RAW records for insertion into source_records
        return parsedData.transactions.map(tx => ({
            ...tx,
            parser_used: 'llm_parser',
            parser_version: '1.0.0',
            extraction_confidence: 0.85 // Heuristic confidence for LLM
        }));
    }
}
