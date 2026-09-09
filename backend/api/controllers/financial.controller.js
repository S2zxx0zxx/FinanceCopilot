import { SafeToSpendEngine } from '../../domains/financial-state/safe-to-spend/safe_to_spend.engine.js';
import { FinancialStateRepo } from '../../db/repositories/financial_state.repo.js';

function currentMonthBounds(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit'}).formatToParts(now);
    const year=Number(parts.find(part=>part.type==='year').value);
    const month=Number(parts.find(part=>part.type==='month').value);
    const prefix=`${year}-${String(month).padStart(2,'0')}`;
    return {startOfMonth:`${prefix}-01`,endOfMonth:`${prefix}-${new Date(Date.UTC(year,month,0)).getUTCDate()}`};
}

export class FinancialController {
    static async getCashflowHistory(req,res,next) {
        try {
            const period=req.query.period||'30d';
            if(!['7d','30d','90d','12mo'].includes(period))return res.status(422).json({error:'Unsupported cashflow period.'});
            const {dbClient}=await import('../../db/client.js');
            const monthly=period==='12mo';
            const start=monthly?"date_trunc('month',NOW() AT TIME ZONE 'Asia/Kolkata') - INTERVAL '11 months'":`date_trunc('day',NOW() AT TIME ZONE 'Asia/Kolkata') - INTERVAL '${Number.parseInt(period,10)-1} days'`;
            const bucket=monthly?'month':'day';
            const {rows}=await dbClient.query(`WITH buckets AS (
                SELECT generate_series(${start},date_trunc('${bucket}',NOW() AT TIME ZONE 'Asia/Kolkata'),INTERVAL '1 ${bucket}') AS bucket
            ), totals AS (
                SELECT date_trunc('${bucket}',observed_at AT TIME ZONE 'Asia/Kolkata') AS bucket,
                SUM(CASE WHEN transaction_type='income' THEN amount_paise ELSE 0 END) AS income_paise,
                SUM(CASE WHEN transaction_type='expense' THEN amount_paise WHEN transaction_type IN ('refund','reversal') THEN -amount_paise ELSE 0 END) AS expense_paise
                FROM transactions WHERE user_id=$1 AND observed_at >= ((${start}) AT TIME ZONE 'Asia/Kolkata') AND observed_at<=NOW()
                  AND duplicate_status!='duplicate' AND is_deleted=false AND needs_review=false AND posting_status='posted' AND currency='INR'
                GROUP BY 1
            ) SELECT to_char(b.bucket,'${monthly?'Mon YY':'DD Mon'}') AS month,
                COALESCE(t.income_paise,0) AS income_paise,COALESCE(t.expense_paise,0) AS expense_paise
                FROM buckets b LEFT JOIN totals t USING(bucket) ORDER BY b.bucket`,[req.user.userId]);
            res.json({period,history:rows,currency:'INR',basis:'posted_records'});
        }catch(error){next(error);}
    }

    /**
     * GET /api/v1/financial-state/home
     * Returns the aggregated view-model for the Home screen.
     */
    static async getHomeState(req, res, next) {
        try {
            const userId = req.user.userId; // Provided by requireAuth middleware
            
            // 1. Calculate Safe-to-Spend (Returns final value, currency, freshness, snapshot ID)
            const stsResult = await SafeToSpendEngine.calculateAndSnapshot(userId);
            
            // 2. Fetch specific insights required for Home
            // E.g., upcoming commitments for the current month
            const {endOfMonth}=currentMonthBounds();
            const upcomingCommitments = await FinancialStateRepo.getUpcomingCommitments(userId, endOfMonth);

            // 3. Needs Attention (Placeholder for Phase 6 - would query for stale connections or unreviewed items)
            const needsAttention = []; 

            // 4. Construct the View-Model
            const viewModel = {
                greeting: 'Hello', // Can be localized later
                safe_to_spend: stsResult,
                money_outlook: {
                    upcoming_commitments_this_month_paise: upcomingCommitments.upcoming_commitments_paise,
                    currency: upcomingCommitments.currency
                },
                needs_attention: needsAttention,
                freshness: 'fresh' // Overall home freshness
            };

            res.status(200).json(viewModel);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/money
     * Returns the aggregated view-model for the Money Overview screen.
     */
    static async getMoneyState(req, res, next) {
        try {
            const userId = req.user.userId;
            
            // 1. Get total account balances
            const balances = await FinancialStateRepo.getAccountBalances(userId);

            // 2. We can also fetch the list of connected accounts to preview them
            const coverageMetrics = await FinancialStateRepo.getCoverageMetrics(userId);

            const viewModel = {
                net_position: balances, // Contains available_balance_paise, posted_balance_paise etc.
                coverage: {
                    total_accounts: coverageMetrics.totalAccounts,
                    synced_accounts: coverageMetrics.syncedAccounts
                }
            };

            res.status(200).json(viewModel);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/spending-story
     */
    static async getSpendingStory(req, res, next) {
        try {
            const userId = req.user.userId;
            const {startOfMonth,endOfMonth}=currentMonthBounds();

            const [spending,categories] = await Promise.all([
                FinancialStateRepo.getEffectiveSpending(userId, startOfMonth, endOfMonth),
                FinancialStateRepo.getSpendingCategories(userId, startOfMonth, endOfMonth)
            ]);
            
            res.status(200).json({
                period: 'This Month',
                categories,
                spending
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/income
     */
    static async getIncome(req, res, next) {
        try {
            const userId = req.user.userId;
            const {startOfMonth,endOfMonth}=currentMonthBounds();

            const [income,sources] = await Promise.all([
                FinancialStateRepo.getEffectiveIncome(userId, startOfMonth, endOfMonth),
                FinancialStateRepo.getIncomeSources(userId, startOfMonth, endOfMonth)
            ]);
            
            res.status(200).json({
                period: 'This Month',
                sources,
                income
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/financial-state/categories/:id
     * Returns category detail (e.g. total spent this month)
     */
    static async getCategoryDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const categoryId = req.params.id;
            
            const {startOfMonth,endOfMonth}=currentMonthBounds();

            // Simplified for Phase 6: directly query transactions for this category
            const { dbClient } = await import('../../db/client.js');
            const query = `
                SELECT COALESCE(SUM(amount_paise), 0) AS total_spent
                FROM transactions
                WHERE user_id = $1 
                  AND category_id = $2::uuid
                  AND observed_at >= $3 
                  AND observed_at <= $4
                  AND is_deleted = false
                  AND direction = 'debit'
            `;
            const result = await dbClient.query(query, [userId, categoryId, startOfMonth, endOfMonth]);

            res.status(200).json({
                category_id: categoryId,
                period: 'This Month',
                total_spent_paise: Number.parseInt(result.rows[0].total_spent, 10),
                currency: 'INR'
            });
        } catch (error) {
            next(error);
        }
    }
}
