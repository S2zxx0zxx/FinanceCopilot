import { dbClient } from './client.js';

async function seed() {
    let err;
    try {
        console.log('Seeding database according to Master Prompt...');

        const userResult = await dbClient.query(`
            INSERT INTO users (clerk_uid, firebase_uid, email, display_name, onboarding_done, onboarding_step)
            VALUES ('seed_user', 'seed_user', 'arjun.sharma@fincopilot.in', 'Arjun Sharma', true, 'completed')
            ON CONFLICT (clerk_uid) DO UPDATE SET email = 'arjun.sharma@fincopilot.in'
            RETURNING user_id
        `);

        const userId = userResult.rows[0].user_id;

        // Categories
        const categories = ['Rent', 'Groceries', 'Dining', 'Transport', 'Shopping', 'Subscriptions', 'Entertainment', 'Utilities', 'Investments', 'Salary', 'Health', 'Education', 'Travel', 'Insurance', 'Credit Card', 'Refunds'];
        for (const cat of categories) {
            await dbClient.query(`INSERT INTO categories (name, slug, level, is_system) VALUES ($1, $2, 1, true) ON CONFLICT (slug) DO NOTHING`, [cat, cat.toLowerCase()]);
        }

        // Gamification
        await dbClient.query(`
            INSERT INTO gamification_state (user_id, level, xp, tracking_streak_days, level_name)
            VALUES ($1, 4, 2450, 47, 'Pro')
            ON CONFLICT (user_id) DO UPDATE SET level = 4, xp = 2450, tracking_streak_days = 47, level_name = 'Pro'
        `, [userId]);

        // FIX (audit P1 #46): clear data in correct order to avoid FK constraint
        // errors. Previously transactions/financial_accounts were wiped but
        // source_records (which transactions FK to via source_record_id) were
        // never cleared — orphan rows accumulated and re-seed runs hit idempotency
        // conflicts. Order: source_records → transactions → financial_accounts
        // → goals/recurring/budgets/notifications. Transactions reference
        // source_records but the FK is nullable, so deleting source_records
        // first would NULL out the column (or cascade). We DELETE transactions
        // first to keep the chain clean.
        await dbClient.query(`DELETE FROM transactions WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM source_records WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM financial_accounts WHERE user_id = $1`, [userId]);

        // 4. Accounts
        const accountResult = await dbClient.query(`
            INSERT INTO financial_accounts (user_id, institution_name, account_name, account_type, currency, is_active)
            VALUES
            ($1, 'HDFC Bank', 'Savings', 'savings', 'INR', true),
            ($1, 'ICICI Bank', 'Current', 'current', 'INR', true),
            ($1, 'Axis Bank', 'Credit Card', 'credit_card', 'INR', true),
            ($1, 'Zerodha', 'Investment', 'investment', 'INR', true)
            RETURNING account_id
        `, [userId]);

        const hdfcId = accountResult.rows[0].account_id;
        const iciciId = accountResult.rows[1].account_id;
        const axisId = accountResult.rows[2].account_id;
        const zerodhaId = accountResult.rows[3].account_id;

        // 12 Transactions
        await dbClient.query(`
            INSERT INTO transactions (user_id, account_id, amount_paise, direction, currency, merchant_raw, merchant_normalized, observed_at, transaction_type, posting_status)
            VALUES 
            ($1, $2, 125000, 'debit', 'INR', 'BigBasket', 'BigBasket', NOW() - INTERVAL '1 day', 'expense', 'posted'),
            ($1, $3, 35000, 'debit', 'INR', 'Uber', 'Uber', NOW() - INTERVAL '2 days', 'expense', 'posted'),
            ($1, $2, 8500000, 'credit', 'INR', 'Salary', 'Employer', NOW() - INTERVAL '5 days', 'income', 'posted'),
            ($1, $2, 45000, 'debit', 'INR', 'Swiggy', 'Swiggy', NOW() - INTERVAL '6 days', 'expense', 'posted'),
            ($1, $4, 64900, 'debit', 'INR', 'Netflix', 'Netflix', NOW() - INTERVAL '7 days', 'expense', 'posted'),
            ($1, $4, 250000, 'debit', 'INR', 'Amazon', 'Amazon', NOW() - INTERVAL '8 days', 'expense', 'posted'),
            ($1, $3, 1450000, 'debit', 'INR', 'Rent', 'Landlord', NOW() - INTERVAL '10 days', 'expense', 'posted'),
            ($1, $2, 85000, 'debit', 'INR', 'Zomato', 'Zomato', NOW(), 'expense', 'pending'),
            ($1, $5, 1100000, 'debit', 'INR', 'SIP', 'Zerodha', NOW() - INTERVAL '12 days', 'expense', 'posted'),
            ($1, $4, 39900, 'debit', 'INR', 'Jio', 'Jio', NOW() - INTERVAL '14 days', 'expense', 'posted'),
            ($1, $4, 85000, 'debit', 'INR', 'BookMyShow', 'BookMyShow', NOW() - INTERVAL '15 days', 'expense', 'posted'),
            ($1, $4, 119900, 'debit', 'INR', 'Cult.fit', 'Cult.fit', NOW() - INTERVAL '20 days', 'expense', 'posted')
        `, [userId, hdfcId, iciciId, axisId, zerodhaId]);

        // 3 Goals
        await dbClient.query(`DELETE FROM goals WHERE user_id = $1`, [userId]);
        await dbClient.query(`
            INSERT INTO goals (user_id, goal_type, name, target_amount_paise, currency, status)
            VALUES 
            ($1, 'emergency_fund', 'Emergency Fund', 115000000, 'INR', 'active'),
            ($1, 'vacation', 'Goa Vacation', 4000000, 'INR', 'active'),
            ($1, 'purchase', 'New Laptop', 12000000, 'INR', 'active')
        `, [userId]);

        // 6 Recurring series
        await dbClient.query(`DELETE FROM recurring_series WHERE user_id = $1`, [userId]);
        await dbClient.query(`
            INSERT INTO recurring_series (user_id, series_name, series_type, frequency, deterministic_key)
            VALUES 
            ($1, 'Netflix Subscription', 'subscription', 'monthly', 'hash_netflix'),
            ($1, 'Cult.fit Membership', 'subscription', 'monthly', 'hash_cultfit'),
            ($1, 'Salary', 'salary', 'monthly', 'hash_employer'),
            ($1, 'Rent', 'rent', 'monthly', 'hash_rent'),
            ($1, 'SIP', 'other', 'monthly', 'hash_zerodha'),
            ($1, 'Jio Mobile', 'subscription', 'monthly', 'hash_jio')
        `, [userId]);

        // 6 Budgets
        await dbClient.query(`DELETE FROM budgets WHERE user_id = $1`, [userId]);
        await dbClient.query(`
            INSERT INTO budgets (user_id, category, budgeted_paise, period)
            VALUES 
            ($1, 'Groceries', 1500000, 'monthly'),
            ($1, 'Dining', 1000000, 'monthly'),
            ($1, 'Transport', 500000, 'monthly'),
            ($1, 'Shopping', 800000, 'monthly'),
            ($1, 'Entertainment', 300000, 'monthly'),
            ($1, 'Subscriptions', 400000, 'monthly')
        `, [userId]);

        // 6 Notifications
        await dbClient.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);
        await dbClient.query(`
            INSERT INTO notifications (user_id, type, title, description, is_read)
            VALUES 
            ($1, 'alert', 'Budget Alert', 'You are near your dining budget.', false),
            ($1, 'info', 'Goal Update', 'Emergency fund is 50% complete.', false),
            ($1, 'insight', 'New AI Insight', 'We found a way to save ₹500 on subscriptions.', false),
            ($1, 'info', 'Salary Received', 'Your salary has been credited.', true),
            ($1, 'alert', 'Credit Card Due', 'Axis Bank bill due in 3 days.', true),
            ($1, 'info', 'Subscription Renewal', 'Netflix will renew tomorrow.', true)
        `, [userId]);

        // AI Budgets
        await dbClient.query(`
            INSERT INTO ai_user_budgets (user_id, budget_limit_paise, consumed_paise)
            VALUES ($1, 500000, 0)
            ON CONFLICT DO NOTHING
        `, [userId]);

        console.log('✅ Master Seed successful.');
    } catch (e) {
        err = e;
        console.error('Seed Error:', e);
    } finally {
        // FIX (audit P0 #13): old code unconditionally `process.exit(0)` in
        // `finally`, swallowing every seed failure. CI thought seed succeeded
        // even when DB was empty. Exit non-zero on error.
        process.exit(err ? 1 : 0);
    }
}
await seed();
