ALTER TABLE source_records
    ADD COLUMN normalization_lease_token UUID,
    ADD COLUMN normalization_lease_expires_at TIMESTAMPTZ,
    ADD COLUMN normalization_attempts INTEGER NOT NULL DEFAULT 0 CHECK (normalization_attempts >= 0);

CREATE INDEX idx_source_records_normalization_recovery
    ON source_records (normalization_lease_expires_at) WHERE status = 'processing';
