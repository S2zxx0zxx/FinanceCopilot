ALTER TABLE import_jobs ADD COLUMN IF NOT EXISTS lease_token UUID;
ALTER TABLE import_jobs ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ;
ALTER TABLE source_records ADD COLUMN IF NOT EXISTS dedupe_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_source_records_dedupe ON source_records(user_id, dedupe_key);
