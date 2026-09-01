import { CSVParser } from './csv.parser.js';
import { LLMParserService } from './llm-parser.service.js';

import { ExcelParser } from './excel.parser.js';

/**
 * Parser Registry
 * 
 * Factory that selects the correct deterministic parser based on the job type.
 */
export class ParserRegistry {
    constructor(aiAdapter) {
        this.csvParser = new CSVParser();
        this.excelParser = new ExcelParser();
        this.llmParser = new LLMParserService(aiAdapter);
    }

    /**
     * Returns the appropriate parser strategy.
     */
    getParser(jobType) {
        switch (jobType) {
            case 'csv':
                return this.csvParser;
            case 'excel':
                return this.excelParser;
            case 'pdf':
                // For PDF, we fallback to LLM parser / OCR path for Phase 2 MVP
                // since pdf-parse requires native bindings that might be complex to install immediately.
                return this.llmParser;
            default:
                throw new Error(`No parser registered for job type: ${jobType}`);
        }
    }
}
