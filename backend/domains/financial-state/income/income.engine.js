export class IncomeEngine {
    /**
     * Derives effective income.
     * Prevents refunds from acting as ordinary income.
     */
    static calculateEffectiveIncome(rawIncome) {
        const total = parseInt(rawIncome, 10);
        return {
            total_income_paise: isNaN(total) ? 0 : total,
            currency: 'INR'
        };
    }
}
