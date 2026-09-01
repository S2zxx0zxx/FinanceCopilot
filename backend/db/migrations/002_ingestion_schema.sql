-- Migration 002 v2 - INGESTION (canonical alignment, F-B12 remediation)
-- CHANGE NOTE: v1 diverged from 06_DOMAIN_MODEL sec2.21/2.5 (wrong users(id) FK,
-- missing idempotency_key/job_type/counters, uppercase status vocab). NEVER APPLIED
-- (zero commits/no DB). Replaced during Phase 0 remediation.
-- Vocabulary: control/domain-enums.yaml | Money: BIGINT paise (ADR-003)

CREATE TABLE source_connections (
    connection_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(user_id),
    source_type     TEXT NOT NULL CHECK (source_type IN ('pdf','csv','excel','receipt','manual','voice','aggregator_future')),
    institution_id  TEXT,
    display_name    TEXT,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','error','disconnected','pending')),
    last_synced_at  TIMESTAMPTZ,
    error_code      TEXT,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_source_connections_user ON source_connections (user_id);

CREATE TABLE import_jobs (
    job_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(user_id),
    connection_id    UUID REFERENCES source_connections(connection_id),
    idempotency_key  TEXT NOT NULL,
    CONSTRAINT uq_import_user_key UNIQUE (user_id, idempotency_key),
    job_type         TEXT NOT NULL CHECK (job_type IN ('pdf','csv','excel','ocr','manual')),
    status           TEXT NOT NULL DEFAULT 'queued'
                     CHECK (status IN ('queued','processing','normalization','reconciliation','completed','failed','dead_letter')),
    attempt          INTEGER NOT NULL DEFAULT 0 CHECK (attempt >= 0),
    max_attempts     INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts > 0),
    last_error       TEXT,
    next_retry_at    TIMESTAMPTZ,
    file_ref         TEXT,
    records_total    INTEGER,
    records_parsed   INTEGER,
    records_failed   INTEGER,
    started_at       TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    correlation_id   TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_import_jobs_user_status ON import_jobs (user_id, status);
CREATE INDEX idx_import_jobs_retry ON import_jobs (next_retry_at) WHERE status IN ('queued','processing');
