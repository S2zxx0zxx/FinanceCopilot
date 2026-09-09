-- Migration 026 — Setu Account Aggregator ingestion support
-- AA transactions still enter the immutable source_records pipeline and are
-- normalized/reconciled exactly like uploaded statement transactions.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'import_jobs_job_type_check'
          AND conrelid = 'import_jobs'::regclass
    ) THEN
        ALTER TABLE import_jobs DROP CONSTRAINT import_jobs_job_type_check;
    END IF;
END $$;

ALTER TABLE import_jobs
ADD CONSTRAINT import_jobs_job_type_check
CHECK (job_type IN ('pdf','csv','excel','ocr','manual','account_aggregator'));

CREATE INDEX IF NOT EXISTS idx_source_connections_aggregator
    ON source_connections (user_id, institution_id)
    WHERE source_type = 'aggregator_future';

CREATE INDEX IF NOT EXISTS idx_consent_records_external_id
    ON consent_records (consent_id_ext)
    WHERE consent_id_ext IS NOT NULL;
