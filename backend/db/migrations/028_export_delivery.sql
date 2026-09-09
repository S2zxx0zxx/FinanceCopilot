ALTER TABLE export_jobs
  ADD COLUMN lease_token UUID,
  ADD COLUMN lease_expires_at TIMESTAMPTZ,
  ADD COLUMN attempt INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN error_message TEXT,
  ADD COLUMN expires_at TIMESTAMPTZ;
CREATE TABLE export_artifacts (
  job_id UUID PRIMARY KEY REFERENCES export_jobs(job_id) ON DELETE CASCADE,
  content BYTEA NOT NULL CHECK (octet_length(content) <= 20971520),
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_export_jobs_processing ON export_jobs(created_at) WHERE status='PROCESSING';
