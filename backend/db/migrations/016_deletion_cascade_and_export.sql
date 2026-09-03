-- Migration 016 - Deletion Cascade & Privacy Audit
-- Adds ON DELETE CASCADE to user relationships

ALTER TABLE financial_accounts DROP CONSTRAINT financial_accounts_user_id_fkey;
ALTER TABLE financial_accounts ADD CONSTRAINT financial_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE statements DROP CONSTRAINT statements_user_id_fkey;
ALTER TABLE statements ADD CONSTRAINT statements_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE transactions DROP CONSTRAINT transactions_user_id_fkey;
ALTER TABLE transactions ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE consent_records DROP CONSTRAINT consent_records_user_id_fkey;
ALTER TABLE consent_records ADD CONSTRAINT consent_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- CREATE export_jobs and deletion_jobs tables
CREATE TABLE export_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PROCESSING',
    format TEXT NOT NULL DEFAULT 'csv',
    download_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deletion_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PROCESSING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
