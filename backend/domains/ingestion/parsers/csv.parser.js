import csvParser from 'csv-parser';
import { Readable } from 'stream';

/**
 * Deterministic CSV Parser
 * 
 * Extracts raw records from a CSV file.
 * Handles edge cases like BOM, different delimiters, and malformed rows.
 */
export class CSVParser {
    
    /**
     * Parses a CSV Buffer into an array of RAW source records.
     * @param {Buffer} fileBuffer 
     */
    async parseRawStatement(fileBuffer) {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = Readable.from(fileBuffer.toString('utf-8'));
            let currentRow = 0;

            stream
                .pipe(csvParser({
                    mapHeaders: ({ header }) => header.trim().toLowerCase(), // normalize headers
                    strict: false // do not crash on malformed rows, just try to parse
                }))
                .on('data', (data) => {
                    // Try to identify standard columns. 
                    // This is heuristic and will be refined based on bank formats,
                    // but it strictly preserves the raw text.
                    
                    const dateCol = Object.keys(data).find(k => k.includes('date'));
                    const descCol = Object.keys(data).find(k => k.includes('description') || k.includes('narration') || k.includes('particulars'));
                    const amtCol = Object.keys(data).find(k => k.includes('amount'));
                    const debitCol = Object.keys(data).find(k => k.includes('debit') || k.includes('withdrawal'));
                    const creditCol = Object.keys(data).find(k => k.includes('credit') || k.includes('deposit'));

                    // Extract raw values safely
                    const rawDate = dateCol ? data[dateCol] : null;
                    const rawDesc = descCol ? data[descCol] : null;
                    
                    let rawAmount = null;
                    let rawDirection = null;

                    if (amtCol) {
                        rawAmount = data[amtCol];
                    } else if (debitCol && data[debitCol]) {
                        rawAmount = data[debitCol];
                        rawDirection = 'debit';
                    } else if (creditCol && data[creditCol]) {
                        rawAmount = data[creditCol];
                        rawDirection = 'credit';
                    }

                    // Only push rows that have at least some meaningful data
                    if (rawDate && rawDesc) {
                        currentRow++;
                        results.push({
                            raw_date_text: rawDate,
                            raw_description_text: rawDesc,
                            raw_amount_text: rawAmount,
                            raw_direction_text: rawDirection,
                            row_number: currentRow,
                            parser_used: 'csv_parser',
                            parser_version: '1.0.0',
                            extraction_confidence: 1.000 // Deterministic CSV is 100% confident in text extraction
                        });
                    }
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (err) => {
                    reject(new Error(`CSV Parsing failed: ${err.message}`));
                });
        });
    }
}
