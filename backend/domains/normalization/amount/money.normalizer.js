/**
 * Money Normalizer
 * 
 * Strict exact-arithmetic money parser.
 * Output is ALWAYS an integer (minor units / paise) and direction indication.
 * Never uses floating-point math to avoid precision loss.
 */
export class MoneyNormalizer {
    
    /**
     * Parses a raw amount string into paise (integer).
     * Retains sign knowledge, but amount_paise is ALWAYS absolute (positive) for canonical ledger,
     * while the direction is captured separately (ADR-001/003).
     * 
     * @param {string} rawAmountText 
     * @returns {{ amount_paise: number, is_negative_in_source: boolean, is_valid: boolean }}
     */
    static normalizeToPaise(rawAmountText) {
        if (!rawAmountText || typeof rawAmountText !== 'string') {
            return { amount_paise: null, is_negative_in_source: false, is_valid: false };
        }

        let cleanText = rawAmountText.trim();
        if (cleanText === '' || cleanText === 'N/A' || cleanText === '—' || cleanText === '-') {
            return { amount_paise: null, is_negative_in_source: false, is_valid: false };
        }

        // 1. Detect negative indicators
        // Formats: (500), -500, 500-
        let isNegative = false;
        if (cleanText.startsWith('(') && cleanText.endsWith(')')) {
            isNegative = true;
            cleanText = cleanText.substring(1, cleanText.length - 1);
        } else if (cleanText.startsWith('-')) {
            isNegative = true;
            cleanText = cleanText.substring(1);
        } else if (cleanText.endsWith('-')) {
            isNegative = true;
            cleanText = cleanText.substring(0, cleanText.length - 1);
        } else if (cleanText.startsWith('+')) {
            cleanText = cleanText.substring(1);
        }

        // 2. Strip currency symbols and whitespace
        // Matches ₹, $, Rs., etc.
        cleanText = cleanText.replace(/[^\d.,]/g, '').trim();

        if (cleanText === '') {
            return { amount_paise: null, is_negative_in_source: isNegative, is_valid: false };
        }

        // 3. Handle Indian/International Number formats
        // Indian: 1,00,000.50
        // US: 100,000.50
        // EU: 100.000,50 (comma as decimal)
        // We need deterministic parsing based on the position of the last comma or dot.
        
        const lastCommaIdx = cleanText.lastIndexOf(',');
        const lastDotIdx = cleanText.lastIndexOf('.');

        let decimalSeparator = '.';
        
        if (lastCommaIdx > lastDotIdx) {
            // Likely EU format: 1.000,50
            // but check if comma is just a thousands separator for something like 1,000 (no decimal)
            if (cleanText.length - lastCommaIdx <= 3) {
                decimalSeparator = ',';
            }
        }

        // Strip thousand separators
        if (decimalSeparator === '.') {
            cleanText = cleanText.replaceAll(',', '');
        } else {
            cleanText = cleanText.replaceAll('.', '');
            cleanText = cleanText.replaceAll(',', '.'); // Convert to standard dot for parsing
        }

        // 4. Exact string-based decimal to integer conversion (to avoid IEEE 754 float precision loss)
        const parts = cleanText.split('.');
        const integerPart = parts[0] || '0';
        let fractionalPart = parts[1] || '00';

        // Pad or truncate to exactly 2 decimal places (Paise)
        if (fractionalPart.length === 1) {
            fractionalPart += '0';
        } else if (fractionalPart.length > 2) {
            fractionalPart = fractionalPart.substring(0, 2); // Truncate extra precision
        }

        const exactIntegerString = integerPart + fractionalPart;
        const amountPaise = Number.parseInt(exactIntegerString, 10);

        if (Number.isNaN(amountPaise)) {
            return { amount_paise: null, is_negative_in_source: isNegative, is_valid: false };
        }

        // Absolute value enforcement
        return {
            amount_paise: Math.abs(amountPaise),
            is_negative_in_source: isNegative,
            is_valid: true
        };
    }
}
