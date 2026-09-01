import { PendingPolicy } from '../pending-policy/pending.policy.js';

export class BalanceEngine {
    /**
     * Derives exact integer balances from raw SQL aggregates.
     * Enforces the single source of truth Pending Money Policy.
     */
    static calculateBalances(postedCredits, postedDebits, pendingCredits, pendingDebits) {
        // Enforce integer math
        const pc = parseInt(postedCredits, 10);
        const pd = parseInt(postedDebits, 10);
        const pnc = parseInt(pendingCredits, 10);
        const pnd = parseInt(pendingDebits, 10);

        const postedBalance = pc - pd;
        let availableBalance = postedBalance;

        if (PendingPolicy.DEBITS.AFFECTS_AVAILABLE_BALANCE) {
            availableBalance -= (pnd * PendingPolicy.DEBITS.WEIGHT);
        }
        if (PendingPolicy.CREDITS.AFFECTS_AVAILABLE_BALANCE) {
            availableBalance += (pnc * PendingPolicy.CREDITS.WEIGHT);
        }

        return {
            posted_balance_paise: postedBalance,
            available_balance_paise: availableBalance,
            currency: 'INR'
        };
    }
}
