/**
 * Type Normalizer
 * 
 * Maps raw merchant names, descriptions, or parsed indicators into a canonical 
 * transaction_type and sub_type.
 * 
 * Valid types: 'expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown'
 */
export class TypeNormalizer {
    
    /**
     * Determines type and subtype based on text heuristics and mathematical direction.
     * @param {string} rawDescription 
     * @param {string} direction 'debit' or 'credit'
     * @param {number} amountPaise
     * @returns {{ type: string, sub_type: string|null }}
     */
    static normalizeType(rawDescription, direction, _amountPaise) {
        if (!rawDescription) {
            return { type: 'unknown', sub_type: null };
        }

        const text = rawDescription.toLowerCase();

        // 1. Explicit Overrides based on keywords
        if (text.includes('reversal') || text.includes('rev:') || text.includes('reversed')) {
            return { type: 'reversal', sub_type: null };
        }
        
        if (text.includes('refund')) {
            return { type: 'refund', sub_type: null };
        }

        if (text.includes('salary') && direction === 'credit') {
            return { type: 'income', sub_type: 'salary' };
        }

        if ((text.includes('interest') || text.includes('int.pd')) && direction === 'credit') {
            return { type: 'interest', sub_type: 'interest_earned' };
        }

        if ((text.includes('fee') || text.includes('charges')) && direction === 'debit') {
            return { type: 'fee', sub_type: 'bank_fee' };
        }

        if (text.includes('atm') && text.includes('cash') && direction === 'debit') {
            return { type: 'cash_withdrawal', sub_type: 'atm' };
        }

        if (text.includes('emi') && direction === 'debit') {
            return { type: 'emi', sub_type: 'loan_repayment' };
        }

        // UPI/Transfer indicators
        if (text.includes('upi') || text.includes('neft') || text.includes('rtgs') || text.includes('imps')) {
            if (direction === 'debit') return { type: 'transfer_out', sub_type: 'peer_transfer' };
            if (direction === 'credit') return { type: 'transfer_in', sub_type: 'peer_transfer' };
        }

        // 2. Default Fallbacks based purely on direction
        if (direction === 'debit') {
            return { type: 'expense', sub_type: null };
        }
        
        if (direction === 'credit') {
            return { type: 'income', sub_type: null };
        }

        return { type: 'unknown', sub_type: null };
    }
}
