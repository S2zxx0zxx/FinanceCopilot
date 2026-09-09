export class SearchController {
    /**
     * GET /api/v1/search?q=query
     */
    static async search(req, res, next) {
        try {
            const userId = req.user.userId;
            const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
            if(query.length>200)return res.status(422).json({error:'Search must be 200 characters or fewer.'});
            
            if (!query || query.length < 2) {
                return res.status(200).json({ transactions: [], accounts: [] });
            }

            const { dbClient } = await import('../../db/client.js');
            
            // Search Transactions (by merchant or category)
            const txQuery = `
                SELECT 
                    transaction_id, account_id, amount_paise, direction, currency,
                    merchant_normalized, observed_at, transaction_type, posting_status
                FROM transactions
                WHERE user_id = $1
                  AND is_deleted = false
                  AND (merchant_normalized ILIKE $2 OR transaction_type ILIKE $2)
                ORDER BY observed_at DESC
                LIMIT 20
            `;
            const txResult = await dbClient.query(txQuery, [userId, `%${query}%`]);

            // Search Accounts
            const accQuery = `
                SELECT 
                    account_id, institution_name, account_type, account_number_last4, currency
                FROM financial_accounts
                WHERE user_id = $1
                  AND is_active = true
                  AND institution_name ILIKE $2
                LIMIT 5
            `;
            const accResult = await dbClient.query(accQuery, [userId, `%${query}%`]);

            const {GoalsService}=await import('../../domains/planning/goals/goals.service.js');
            const goals=(await GoalsService.listGoals(userId)).filter(goal=>`${goal.name} ${goal.goal_type}`.toLowerCase().includes(query.toLowerCase())).slice(0,20);
            res.status(200).json({
                goals,
                transactions: txResult.rows,
                accounts: accResult.rows
            });
        } catch (error) {
            next(error);
        }
    }
}
