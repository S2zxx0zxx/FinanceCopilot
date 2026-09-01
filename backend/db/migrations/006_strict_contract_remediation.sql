-- Migration 006 - PHASE 2.4 - STRICT CONTRACT REMEDIATION
-- Aligns schema exactly with Phase 2 Architecture constraints

-- 1. Add Source Artifact Metadata to import_jobs (Section 4)
ALTER TABLE import_jobs ADD COLUMN original_filename TEXT;
ALTER TABLE import_jobs ADD COLUMN content_type TEXT;
ALTER TABLE import_jobs ADD COLUMN file_size_bytes BIGINT;
ALTER TABLE import_jobs ADD COLUMN file_checksum TEXT;

-- 2. Expand Job State Check Constraint to support Upload and Replay flows (Section 8)
-- Existing Constraint: import_jobs_status_check
ALTER TABLE import_jobs DROP CONSTRAINT import_jobs_status_check;

ALTER TABLE import_jobs ADD CONSTRAINT import_jobs_status_check
CHECK (status IN (
    'received', 'validating', 'stored',         -- Upload / Pre-queue phases
    'queued', 'processing', 'completed',        -- Queue / Processing phases
    'failed', 'dead_letter',                    -- Failure phases
    'replay_requested', 'replaying',            -- Replay phases
    'normalization', 'reconciliation'           -- Future phases
));

-- Change default to received
ALTER TABLE import_jobs ALTER COLUMN status SET DEFAULT 'received';
