-- Migration 005 - PHASE 2 INGESTION - IMMUTABLE SOURCE RECORDS
-- This table is the bedrock of Phase 2. It holds the strictly immutable raw data 
-- exactly as extracted by the parsers. It must NEVER be overwritten by normalization.

CREATE TABLE source_records (
    source_record_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id),
    import_job_id           UUID NOT NULL REFERENCES import_jobs(job_id),
    
    -- Where did this come from?
    file_ref                TEXT NOT NULL,
    parser_used             TEXT NOT NULL,
    parser_version          TEXT NOT NULL,
    
    -- Provenance (Location inside the original artifact)
    page_number             INTEGER,
    row_number              INTEGER,
    provenance_metadata     JSONB, -- E.g. bounding boxes, cell references
    
    -- RAW Values strictly as found in the source
    raw_date_text           TEXT,
    raw_amount_text         TEXT,
    raw_currency_text       TEXT,
    raw_direction_text      TEXT,
    raw_merchant_text       TEXT,
    raw_description_text    TEXT,
    raw_reference_text      TEXT,
    
    -- The parser's best attempt at translating the raw data into typed fields (NOT final normalization)
    extracted_observed_at   TIMESTAMPTZ,
    extracted_amount_paise  BIGINT,
    extracted_direction     TEXT CHECK (extracted_direction IN ('debit', 'credit')),
    
    -- Confidence of the extraction (important for OCR / LLM)
    extraction_confidence   NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (extraction_confidence BETWEEN 0 AND 1),
    
    -- Status
    status                  TEXT NOT NULL DEFAULT 'raw' CHECK (status IN ('raw', 'normalized', 'rejected')),
    rejection_reason        TEXT,
    
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_source_records_job ON source_records (import_job_id);
CREATE INDEX idx_source_records_user ON source_records (user_id);
