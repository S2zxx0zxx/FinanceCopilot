/**
 * Direction Normalizer
 * 
 * Determines whether a transaction is a debit or credit safely by examining both
 * explicit source indicators (e.g. column headers) and implicit signs (e.g. -500).
 */
export class DirectionNormalizer {
    
    /**
     * Resolves the canonical direction of the transaction.
     * @param {string} explicitDirection - 'debit' or 'credit' if the parser found it in a specific column.
     * @param {boolean} isNegativeAmount - true if the amount had a minus sign or parentheses.
     * @returns {{ direction: string, has_conflict: boolean }}
     */
    static normalizeDirection(explicitDirection, isNegativeAmount) {
        
        let determinedDirection = 'unknown';
        let conflict = false;

        if (explicitDirection === 'debit') {
            determinedDirection = 'debit';
            // If explicit column is DEBIT, but amount had a positive sign? Usually fine.
            // If explicit column is DEBIT, but amount had a negative sign? Also usually fine (double negative).
            // No strong conflict, explicit column wins.
        } else if (explicitDirection === 'credit') {
            determinedDirection = 'credit';
            if (isNegativeAmount) {
                // If it's in the CREDIT column but negative, it's actually a reversal/debit!
                // We mark it as conflict for review, but strictly map to debit mathematically.
                determinedDirection = 'debit';
                conflict = true;
            }
        } else {
            // No explicit column, rely entirely on the sign
            determinedDirection = isNegativeAmount ? 'debit' : 'credit'; // Assume positive amounts in single-column are credits (standard convention, though risky).
            // Actually, in many bank statements, single-column amounts use negative for debits.
        }

        return {
            direction: determinedDirection,
            has_conflict: conflict
        };
    }
}
