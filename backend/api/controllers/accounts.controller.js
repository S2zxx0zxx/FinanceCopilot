import { dbClient } from '../../db/client.js';
import { FinancialStateRepo } from '../../db/repositories/financial_state.repo.js';

export class AccountsController {
    static async createAccount(req, res, next) {
        try {
            const { institution_name, account_type = 'savings', account_number_last4 } = req.body;
            if (typeof institution_name !== 'string' || !institution_name.trim() || institution_name.length > 120 || !['savings','current','credit_card','loan','investment','wallet','cash'].includes(account_type) || (account_number_last4 && !/^\d{4}$/.test(account_number_last4))) {
                return res.status(422).json({error:'Enter a valid institution, account type and optional last four digits.'});
            }
            const result = await dbClient.query(`INSERT INTO financial_accounts (user_id, institution_name, account_type, account_number_last4) VALUES ($1,$2,$3,$4) RETURNING account_id, institution_name, account_type`, [req.user.userId,institution_name.trim(),account_type,account_number_last4 || null]);
            res.status(201).json({account:result.rows[0]});
        } catch(error) { next(error); }
    }
    /**
     * GET /api/v1/accounts
     * Returns a list of all connected accounts for the user.
     */
    static async getAccounts(req, res, next) {
        try {
            const userId = req.user.userId;
            
            const query = `
                SELECT account_id, account_type, institution_name, account_number_last4, currency, is_active, created_at
                FROM financial_accounts
                WHERE user_id = $1
                ORDER BY created_at DESC
            `;
            
            const result = await dbClient.query(query, [userId]);
            
            // For a rich view-model, we might want to attach balance to each account
            // In a production app, we might do this via a SQL JOIN or bulk query.
            // For V1, we'll fetch balance per account using the repo.
            const accounts = [];
            for (const acc of result.rows) {
                const balances = await FinancialStateRepo.getAccountBalances(userId, acc.account_id);
                accounts.push({
                    ...acc,
                    balances
                });
            }

            res.status(200).json({ accounts });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/accounts/:id
     * Returns detail for a specific account.
     */
    static async getAccountDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const accountId = req.params.id;

            const query = `
                SELECT account_id, account_type, institution_name, account_number_last4, currency, is_active, created_at
                FROM financial_accounts
                WHERE user_id = $1 AND account_id = $2
            `;
            const result = await dbClient.query(query, [userId, accountId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Account not found or unauthorized' });
            }

            const account = result.rows[0];
            const balances = await FinancialStateRepo.getAccountBalances(userId, accountId);

            res.status(200).json({
                account,
                balances
            });
        } catch (error) {
            next(error);
        }
    }
}
