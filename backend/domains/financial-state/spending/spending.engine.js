export class SpendingEngine {
    /**
     * Derives effective spending.
     * Subtracts refunds/reversals as explicit offsets.
     */
    static calculateEffectiveSpending(grossExpense, totalOffsets) {
        const gross = parseInt(grossExpense, 10);
        const offsets = parseInt(totalOffsets, 10);
        
        return {
            gross_spending_paise: gross,
            offsets_paise: offsets,
            effective_spending_paise: gross - offsets,
            currency: 'INR'
        };
    }
}
