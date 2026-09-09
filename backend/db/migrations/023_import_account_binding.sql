ALTER TABLE import_jobs ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES financial_accounts(account_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_account ON import_jobs(account_id);
