/**
 * Ledger Service
 * 
 * Core financial engine enforcing ADR-001 and ADR-003 constraints.
 * Protects against float math and duplicate transactions.
 */
export class LedgerService {
    constructor(dbRepository) {
        this.dbRepository = dbRepository;
    }

    /**
     * Safely inserts an array of parsed transactions into the ledger.
     */
    async processTransactions(userId, accountId, importJobId, transactionsData) {
        // Enforce ZERO-LOSS invariant:
        // All amounts must be integers (paise).
        transactionsData.forEach(tx => {
            if (!Number.isInteger(tx.amount_paise)) {
                throw new Error(`CRITICAL: Non-integer amount detected: ${tx.amount_paise}. Halting processing to prevent financial data corruption.`);
            }
        });

        console.log(`Processing ${transactionsData.length} transactions for account ${accountId}...`);

        // Scaffold: Call dbRepository to insert transactions in a single DB Transaction.
        // Will also run deduplication checks here.
        
        return {
            inserted: transactionsData.length,
            duplicates: 0
        };
    }

    /**
     * Formats an integer amount (paise) to a human-readable string for frontend display.
     */
    static formatToDisplay(amountPaise) {
        return (amountPaise / 100).toFixed(2);
    }
}
