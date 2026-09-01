-- Migration 003 v2 - CORE LEDGER (canonical alignment, F-B12 remediation)
-- CHANGE NOTE: v1 VIOLATED core invariants: signed amount ("negative=debit"),
-- wrong FKs (users(id)), accounts/merchants schemas diverging from
-- 06_DOMAIN_MODEL sec2.3/2.9, free-text category. NEVER APPLIED.
-- Replaced during Phase 0 remediation per ADR-001/002/003 + domain-enums.

CREATE TABLE financial_accounts (
    account_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(user_id),
    account_type         TEXT NOT NULL CHECK (account_type IN ('savings','current','credit_card','loan','investment','wallet','cash')),
    institution_name     TEXT NOT NULL,
    institution_id       TEXT,
    account_name         TEXT,
    account_number_last4 TEXT,
    account_number_hash  TEXT,
    currency             TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    is_investment        BOOLEAN NOT NULL DEFAULT FALSE,
    source_connection_id UUID REFERENCES source_connections(connection_id),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_user ON financial_accounts (user_id);
CREATE INDEX idx_accounts_hash ON financial_accounts (user_id, account_number_hash);

CREATE TABLE merchants (
    merchant_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name TEXT NOT NULL UNIQUE,
    display_name   TEXT NOT NULL,
    category_id    UUID,
    mcc            TEXT,
    merchant_type  TEXT,
    logo_url       TEXT,
    is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    aliases        TEXT[] NOT NULL DEFAULT '{}',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_merchants_aliases ON merchants USING gin (aliases);

CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID REFERENCES categories(category_id),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    level       INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
    icon        TEXT,
    color       TEXT,
    is_system   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE merchants ADD CONSTRAINT fk_merchant_category
    FOREIGN KEY (category_id) REFERENCES categories(category_id);

CREATE TABLE statements (
    statement_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID NOT NULL REFERENCES users(user_id),
    account_id            UUID REFERENCES financial_accounts(account_id),
    connection_id         UUID NOT NULL REFERENCES source_connections(connection_id),
    period_start          DATE NOT NULL,
    period_end            DATE NOT NULL CHECK (period_end >= period_start),
    opening_balance_paise BIGINT,
    closing_balance_paise BIGINT,
    currency              TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    statement_type        TEXT NOT NULL CHECK (statement_type IN ('bank','credit_card')),
    file_ref              TEXT,
    parse_status          TEXT NOT NULL DEFAULT 'pending',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_statements_account_period ON statements (account_id, period_start, period_end);

-- Canonical transactions: amount ALWAYS positive; direction carries sign (ADR-001/003).
CREATE TABLE transactions (
    transaction_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(user_id),
    source_record_id        UUID,
    statement_id            UUID REFERENCES statements(statement_id),
    account_id              UUID REFERENCES financial_accounts(account_id),
    payment_instrument_id   UUID,

    observed_at             TIMESTAMPTZ NOT NULL,
    amount_paise            BIGINT NOT NULL CHECK (amount_paise > 0),
    currency                TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR')),
    direction               TEXT NOT NULL CHECK (direction IN ('debit','credit')),

    merchant_raw            TEXT NOT NULL,
    merchant_normalized     TEXT,
    merchant_id             UUID REFERENCES merchants(merchant_id),
    merchant_category_code  TEXT,

    category_id             UUID REFERENCES categories(category_id),
    category_raw            TEXT,
    category_confidence     NUMERIC(4,3),

    transaction_type        TEXT DEFAULT 'unknown'
                            CHECK (transaction_type IN ('expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown')),
    sub_type                TEXT,

    duplicate_group_id      UUID,
    duplicate_status        TEXT NOT NULL DEFAULT 'unique' CHECK (duplicate_status IN ('unique','primary','duplicate','pending_review')),
    transfer_group_id       UUID,
    transfer_role           TEXT CHECK (transfer_role IN ('source','destination','partial_transfer')),
    settlement_group_id     UUID,
    settlement_role         TEXT CHECK (settlement_role IN ('purchase','settlement')),

    posting_status          TEXT NOT NULL DEFAULT 'posted' CHECK (posting_status IN ('pending','posted','reversed')),
    posted_at               TIMESTAMPTZ,

    reference_id            TEXT,
    description             TEXT,
    notes                   TEXT,

    overall_confidence      NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (overall_confidence BETWEEN 0 AND 1),
    needs_review            BOOLEAN NOT NULL DEFAULT FALSE,
    review_reason           TEXT[],

    normalization_version   TEXT,
    is_manual               BOOLEAN NOT NULL DEFAULT FALSE,

    is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ,
    deleted_by_correction_id UUID,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tx_user_observed ON transactions (user_id, observed_at DESC);
CREATE INDEX idx_tx_duplicate ON transactions (user_id, account_id, reference_id);
CREATE INDEX idx_tx_amount_dedup ON transactions (user_id, account_id, amount_paise, observed_at);
CREATE INDEX idx_tx_transfer_group ON transactions (transfer_group_id);
CREATE INDEX idx_tx_settlement_group ON transactions (settlement_group_id);
CREATE INDEX idx_tx_needs_review ON transactions (user_id) WHERE needs_review = TRUE;
