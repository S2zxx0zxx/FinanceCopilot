import { dbClient } from '../../db/client.js';
import { FinancialStateRepo } from '../../db/repositories/financial_state.repo.js';

export class AccountsController {
    /**
     * GET /api/v1/accounts
     * Returns a list of all connected accounts for the user.
     */
    static async getAccounts(req, res, next) {
        try {
            const userId = req.user.userId;
            
            const query = `
                SELECT account_id, account_type, institution_name, currency, is_active, created_at
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
                SELECT account_id, account_type, institution_name, currency, is_active, created_at
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
