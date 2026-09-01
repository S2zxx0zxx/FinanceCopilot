import { dbClient } from '../../db/client.js';
import { BalanceEngine } from '../../domains/financial-state/balances/balance.engine.js';
import { SpendingEngine } from '../../domains/financial-state/spending/spending.engine.js';
import { IncomeEngine } from '../../domains/financial-state/income/income.engine.js';
import { CommitmentEngine } from '../../domains/financial-state/commitments/commitment.engine.js';

export class FinancialStateRepo {
    /**
     * Aggregates balances deterministically.
     * Ensures strict parenthesization of AND/OR clauses.
     * Prevents double-counting by excluding duplicates.
     */
    static async getAccountBalances(userId, accountId = null) {
        let accountFilter = '';
        const params = [userId];
        if (accountId) {
            accountFilter = `AND account_id = $2`;
            params.push(accountId);
        }

        const query = `
            WITH valid_transactions AS (
                SELECT amount_paise, direction, posting_status
                FROM transactions
                WHERE user_id = $1
                  ${accountFilter}
                  AND duplicate_status != 'duplicate'
                  AND is_deleted = false
                  AND currency = 'INR'
            )
            SELECT 
                COALESCE(SUM(CASE WHEN direction = 'credit' AND posting_status = 'posted' THEN amount_paise ELSE 0 END), 0) AS posted_credits,
                COALESCE(SUM(CASE WHEN direction = 'debit' AND posting_status = 'posted' THEN amount_paise ELSE 0 END), 0) AS posted_debits,
                COALESCE(SUM(CASE WHEN direction = 'credit' AND posting_status = 'pending' THEN amount_paise ELSE 0 END), 0) AS pending_credits,
                COALESCE(SUM(CASE WHEN direction = 'debit' AND posting_status = 'pending' THEN amount_paise ELSE 0 END), 0) AS pending_debits
            FROM valid_transactions;
        `;

        const res = await dbClient.query(query, params);
        const row = res.rows[0];

        // Offload pure exact math logic to Engine layer
        return BalanceEngine.calculateBalances(
            row.posted_credits, 
            row.posted_debits, 
            row.pending_credits, 
            row.pending_debits
        );
    }

    /**
     * Calculates effective spending.
     * Excludes transfers (transfer_out), card settlements.
     * Subtracts refunds/reversals as offsets.
     */
    static async getEffectiveSpending(userId, startDate, endDate) {
        const query = `
            WITH spending_txs AS (
                SELECT amount_paise, transaction_type
                FROM transactions
                WHERE user_id = $1
                  AND observed_at >= $2 
                  AND observed_at <= $3
                  AND duplicate_status != 'duplicate'
                  AND is_deleted = false
                  AND currency = 'INR'
                  AND (posting_status = 'posted' OR posting_status = 'pending')
                  -- Strict parentheses for OR logic (SQL PRECEDENCE SAFEGUARD)
                  AND (transaction_type = 'expense' OR transaction_type = 'refund' OR transaction_type = 'reversal')
            )
            SELECT 
                COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount_paise ELSE 0 END), 0) AS gross_expense,
                COALESCE(SUM(CASE WHEN transaction_type = 'refund' OR transaction_type = 'reversal' THEN amount_paise ELSE 0 END), 0) AS total_offsets
            FROM spending_txs;
        `;

        const res = await dbClient.query(query, [userId, startDate, endDate]);
        const row = res.rows[0];

        return SpendingEngine.calculateEffectiveSpending(row.gross_expense, row.total_offsets);
    }

    /**
     * Safe To Spend Configuration fetcher
     */
    static async getStsConfig(userId) {
        const res = await dbClient.query(`SELECT * FROM safe_to_spend_configurations WHERE user_id = $1`, [userId]);
        if (res.rowCount === 0) {
            return {
                safety_buffer_paise: 500000,
                horizon_days: 30,
                essential_category_ids: []
            };
        }
        return res.rows[0];
    }

    /**
     * Gets all known income (salary/bonus) in period
     */
    static async getEffectiveIncome(userId, startDate, endDate) {
        const query = `
            SELECT COALESCE(SUM(amount_paise), 0) AS total_income
            FROM transactions
            WHERE user_id = $1
              AND observed_at >= $2 
              AND observed_at <= $3
              AND duplicate_status != 'duplicate'
              AND is_deleted = false
              AND currency = 'INR'
              AND transaction_type = 'income'
        `;
        const res = await dbClient.query(query, [userId, startDate, endDate]);
        return IncomeEngine.calculateEffectiveIncome(res.rows[0].total_income);
    }

    /**
     * Gets upcoming commitments sum
     */
    static async getUpcomingCommitments(userId, untilDate) {
        const query = `
            SELECT COALESCE(SUM(amount_paise), 0) AS total_commitments
            FROM financial_commitments
            WHERE user_id = $1
              AND due_date <= $2
              AND status = 'upcoming'
              AND currency = 'INR'
        `;
        const res = await dbClient.query(query, [userId, untilDate]);
        return CommitmentEngine.calculateUpcomingCommitments(res.rows[0].total_commitments);
    }
    /**
     * Gets account sync metrics for Coverage Engine
     */
    static async getCoverageMetrics(userId) {
        const query = `
            SELECT COUNT(*) AS total_accounts
            FROM financial_accounts
            WHERE user_id = $1 AND is_active = true
        `;
        const res = await dbClient.query(query, [userId]);
        // For V1, we assume all active accounts are synced. A full implementation would check latest import jobs.
        const total = parseInt(res.rows[0].total_accounts, 10);
        return { totalAccounts: total, syncedAccounts: total };
    }
}
