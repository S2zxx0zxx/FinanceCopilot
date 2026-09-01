# Domain Model — AI Financial Life Manager

**Version:** 1.0  
**Status:** BASELINE (Phase 0)  
**PRD Reference:** Sections 17, 18, 19, 21  
**Last Updated:** 2026-08-22

---

## 1. Money Precision Rule (CRITICAL)

> **All monetary values are stored as INTEGER in the smallest currency unit.**
> For INR: **paise** (1 INR = 100 paise).
> NEVER use FLOAT or DECIMAL for authoritative money storage.
> See ADR-003.

```sql
-- CORRECT
amount_paise BIGINT NOT NULL    -- Rs.1,234.56 stored as 123456

-- FORBIDDEN
amount DECIMAL(15,2)           -- floating point risk
amount FLOAT                   -- forbidden
```

Display layer: divide by 100, format to 2 decimal places using Indian locale.

---

## 2. Core Entity Definitions

### 2.1 User

```sql
CREATE TABLE users (
  user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid    TEXT UNIQUE NOT NULL,        -- external auth ID
  email           TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  phone_number    TEXT,
  locale          TEXT NOT NULL DEFAULT 'en-IN',
  currency        TEXT NOT NULL DEFAULT 'INR',
  timezone        TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  onboarding_step TEXT NOT NULL DEFAULT 'welcome',
  onboarding_done BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.2 ConsentRecord

```sql
CREATE TABLE consent_records (
  consent_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  consent_type    TEXT NOT NULL,     -- 'privacy_policy', 'terms', 'data_usage', 'ai_processing'
  version         TEXT NOT NULL,     -- e.g., '2026-08-23' (YYYY-MM-DD semantic versions; see consent.service isVersionAtLeast)
  consented       BOOLEAN NOT NULL,
  ip_address      TEXT,              -- hashed/masked
  user_agent      TEXT,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.3 FinancialAccount

```sql
CREATE TABLE financial_accounts (
  account_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(user_id),
  account_type        TEXT NOT NULL,   -- 'savings', 'current', 'credit_card', 'loan', 'investment', 'wallet', 'cash'
  institution_name    TEXT NOT NULL,
  institution_id      TEXT,            -- normalized institution key
  account_name        TEXT,            -- user-visible name
  account_number_last4 TEXT,           -- masked
  account_number_hash TEXT,            -- for dedup, not display
  currency            TEXT NOT NULL DEFAULT 'INR',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  is_investment       BOOLEAN NOT NULL DEFAULT FALSE,  -- V1 analytics disabled for investment
  source_connection_id UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.4 PaymentInstrument

```sql
CREATE TABLE payment_instruments (
  instrument_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  account_id      UUID REFERENCES financial_accounts(account_id),
  instrument_type TEXT NOT NULL,   -- 'credit_card', 'debit_card', 'upi', 'netbanking', 'wallet', 'cash', 'emi'
  last4           TEXT,
  network         TEXT,            -- 'visa', 'mastercard', 'rupay', 'amex'
  upi_id          TEXT,            -- hashed if stored
  nickname        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.5 SourceConnection

```sql
CREATE TABLE source_connections (
  connection_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  source_type     TEXT NOT NULL,   -- 'pdf', 'csv', 'excel', 'receipt', 'manual', 'voice', 'aggregator_future'
  institution_id  TEXT,
  display_name    TEXT,
  status          TEXT NOT NULL DEFAULT 'active',  -- 'active', 'error', 'disconnected', 'pending'
  last_synced_at  TIMESTAMPTZ,
  error_code      TEXT,
  error_message   TEXT,            -- safe, no internals
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.6 SourceRecord (IMMUTABLE)

```sql
CREATE TABLE source_records (
  source_record_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(user_id),
  connection_id       UUID NOT NULL REFERENCES source_connections(connection_id),
  upload_id           UUID NOT NULL,           -- batch upload identifier
  raw_content_ref     TEXT,                    -- object storage key (file ref)
  raw_row_index       INTEGER,                 -- row in file (for CSV/Excel)
  raw_page_number     INTEGER,                 -- page in PDF
  raw_data            JSONB NOT NULL,          -- immutable raw parsed data
  parse_version       TEXT NOT NULL,           -- parser version used
  parsed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  import_job_id       UUID NOT NULL,
  is_processed        BOOLEAN NOT NULL DEFAULT FALSE,
  -- IMMUTABLE: never update raw_data after creation
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No UPDATE allowed on raw_data column — enforced by application policy + trigger
```

### 2.7 Statement

```sql
CREATE TABLE statements (
  statement_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  account_id      UUID REFERENCES financial_accounts(account_id),
  connection_id   UUID NOT NULL REFERENCES source_connections(connection_id),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  opening_balance_paise BIGINT,
  closing_balance_paise BIGINT,
  currency        TEXT NOT NULL DEFAULT 'INR',
  statement_type  TEXT NOT NULL,   -- 'bank', 'credit_card'
  file_ref        TEXT,            -- object storage key
  parse_status    TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.8 Transaction (Canonical)

```sql
CREATE TABLE transactions (
  transaction_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  source_record_id        UUID NOT NULL REFERENCES source_records(source_record_id),
  statement_id            UUID REFERENCES statements(statement_id),
  account_id              UUID REFERENCES financial_accounts(account_id),
  payment_instrument_id   UUID REFERENCES payment_instruments(instrument_id),

  -- Core financial fields
  observed_at             TIMESTAMPTZ NOT NULL,    -- when transaction occurred
  amount_paise            BIGINT NOT NULL,         -- always positive
  currency                TEXT NOT NULL DEFAULT 'INR',
  direction               TEXT NOT NULL,           -- 'debit', 'credit'

  -- Merchant
  merchant_raw            TEXT NOT NULL,           -- original merchant string (immutable)
  merchant_normalized     TEXT,                    -- after merchant resolution
  merchant_id             UUID REFERENCES merchants(merchant_id),
  merchant_category_code  TEXT,                    -- MCC if known

  -- Category
  category_id             UUID REFERENCES categories(category_id),
  category_raw            TEXT,                    -- original category from source
  category_confidence     NUMERIC(4,3),            -- 0.000 – 1.000

  -- Classification
  transaction_type        TEXT,                    -- 'expense', 'income', 'transfer_out', 'transfer_in', 'refund', 'reversal', 'card_settlement', 'emi', 'interest', 'fee', 'unknown'
  sub_type                TEXT,                    -- 'salary', 'rental', 'subscription', 'upi', etc.

  -- Reconciliation
  duplicate_group_id      UUID,                    -- NULL if not duplicate
  duplicate_status        TEXT DEFAULT 'unique',   -- 'unique', 'primary', 'duplicate', 'pending_review'
  transfer_group_id       UUID,                    -- NULL if not a transfer
  transfer_role           TEXT,                    -- 'source','destination','partial_transfer' | NULL (control/domain-enums.yaml)
  settlement_group_id     UUID,                    -- card purchase ↔ settlement
  settlement_role         TEXT,                    -- 'purchase','settlement' | NULL (control/domain-enums.yaml)

  -- Pending / Posted
  posting_status          TEXT NOT NULL DEFAULT 'posted', -- 'pending', 'posted', 'reversed'
  posted_at               TIMESTAMPTZ,

  -- Reference
  reference_id            TEXT,                    -- bank's transaction ID
  description             TEXT,                    -- full bank description
  notes                   TEXT,                    -- user notes

  -- Confidence & Quality
  overall_confidence      NUMERIC(4,3) NOT NULL DEFAULT 1.000,
  needs_review            BOOLEAN NOT NULL DEFAULT FALSE,
  review_reason           TEXT[],

  -- Provenance
  normalization_version   TEXT,
  is_manual               BOOLEAN NOT NULL DEFAULT FALSE,

  -- Soft delete / correction
  is_deleted              BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at              TIMESTAMPTZ,
  deleted_by_correction_id UUID,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.9 Merchant

```sql
CREATE TABLE merchants (
  merchant_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name  TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  category_id     UUID REFERENCES categories(category_id),
  mcc             TEXT,
  merchant_type   TEXT,            -- 'retail', 'subscription', 'utility', 'food', etc.
  logo_url        TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  aliases         TEXT[],          -- known raw name variants
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.10 Category

```sql
CREATE TABLE categories (
  category_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID REFERENCES categories(category_id),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  level           INTEGER NOT NULL DEFAULT 1,   -- 1=top, 2=sub, 3=micro
  icon            TEXT,
  color           TEXT,
  is_system       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.11 Correction (Auditable — NEVER deletes original)

```sql
CREATE TABLE corrections (
  correction_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  entity_type     TEXT NOT NULL,           -- 'transaction', 'merchant', 'category'
  entity_id       UUID NOT NULL,
  field_name      TEXT NOT NULL,
  old_value       JSONB NOT NULL,          -- original value snapshot
  new_value       JSONB NOT NULL,          -- corrected value
  actor           TEXT NOT NULL DEFAULT 'user',  -- 'user', 'system', 'ai_suggested'
  reason          TEXT,
  rule_version    TEXT,                    -- normalization version in effect
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.12 RecurringSeries

```sql
CREATE TABLE recurring_series (
  series_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  merchant_id     UUID REFERENCES merchants(merchant_id),
  category_id     UUID REFERENCES categories(category_id),
  series_name     TEXT NOT NULL,
  series_type     TEXT NOT NULL,           -- 'subscription', 'emi', 'salary', 'rent', 'utility', 'insurance', 'other'
  frequency       TEXT NOT NULL,           -- 'weekly', 'monthly', 'quarterly', 'annual', 'irregular'
  typical_amount_paise BIGINT,
  amount_variance_paise BIGINT,
  currency        TEXT NOT NULL DEFAULT 'INR',
  first_seen_at   DATE,
  last_seen_at    DATE,
  next_expected_at DATE,
  confidence      NUMERIC(4,3),
  status          TEXT NOT NULL DEFAULT 'active',  -- 'active', 'cancelled', 'paused', 'completed'
  is_income       BOOLEAN NOT NULL DEFAULT FALSE,
  is_user_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.13 Commitment

```sql
CREATE TABLE commitments (
  commitment_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  series_id       UUID REFERENCES recurring_series(series_id),
  commitment_type TEXT NOT NULL,           -- 'bill', 'emi', 'subscription', 'rent', 'insurance', 'loan_payment'
  name            TEXT NOT NULL,
  amount_paise    BIGINT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  due_date        DATE,
  due_day_of_month INTEGER,               -- for monthly recurring
  account_id      UUID REFERENCES financial_accounts(account_id),
  instrument_id   UUID REFERENCES payment_instruments(instrument_id),
  status          TEXT NOT NULL DEFAULT 'upcoming',  -- 'upcoming', 'paid', 'overdue', 'cancelled'
  paid_at         TIMESTAMPTZ,
  transaction_id  UUID REFERENCES transactions(transaction_id),
  period_start    DATE,
  period_end      DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.14 Goal

```sql
CREATE TABLE goals (
  goal_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  goal_type       TEXT NOT NULL,           -- 'emergency_fund', 'vacation', 'purchase', 'debt_payoff', 'investment_future', 'education', 'home', 'other'
  name            TEXT NOT NULL,
  description     TEXT,
  target_amount_paise BIGINT NOT NULL,
  current_amount_paise BIGINT NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'INR',
  target_date     DATE,
  status          TEXT NOT NULL DEFAULT 'active',  -- 'draft', 'active', 'paused', 'completed', 'abandoned'
  priority        INTEGER NOT NULL DEFAULT 1,
  account_id      UUID REFERENCES financial_accounts(account_id),  -- linked savings account
  monthly_contribution_paise BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.15 ForecastSnapshot

```sql
CREATE TABLE forecast_snapshots (
  snapshot_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(user_id),
  horizon_days        INTEGER NOT NULL,        -- 7, 30, 90
  forecast_date       DATE NOT NULL,           -- date forecast was generated
  model_version       TEXT NOT NULL,           -- engine version
  rule_version        TEXT NOT NULL,

  -- Input snapshot (IMMUTABLE — store what was used)
  input_balance_paise BIGINT NOT NULL,
  input_coverage      NUMERIC(4,3) NOT NULL,
  input_snapshot      JSONB NOT NULL,          -- full input state

  -- Output
  projected_low_paise  BIGINT NOT NULL,
  projected_mid_paise  BIGINT NOT NULL,
  projected_high_paise BIGINT NOT NULL,
  currency             TEXT NOT NULL DEFAULT 'INR',
  confidence           NUMERIC(4,3) NOT NULL,
  coverage             NUMERIC(4,3) NOT NULL,
  drivers              JSONB NOT NULL,         -- what's driving the forecast
  assumptions          JSONB NOT NULL,         -- explicit assumptions made

  -- Evaluation
  actual_balance_paise BIGINT,                 -- filled in after horizon date passes
  evaluated_at         TIMESTAMPTZ,
  forecast_error_paise BIGINT,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.16 SafeToSpendSnapshot

```sql
CREATE TABLE safe_to_spend_snapshots (
  snapshot_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  calculated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculation_version     TEXT NOT NULL,
  horizon_days            INTEGER NOT NULL DEFAULT 30,

  -- Inputs (stored for auditability)
  available_cash_paise    BIGINT NOT NULL,
  expected_income_paise   BIGINT NOT NULL,
  upcoming_commitments_paise BIGINT NOT NULL,
  expected_essential_paise   BIGINT NOT NULL,
  safety_buffer_paise        BIGINT NOT NULL,
  pending_paise              BIGINT NOT NULL,
  input_snapshot             JSONB NOT NULL,

  -- Output
  safe_to_spend_paise    BIGINT NOT NULL,
  currency               TEXT NOT NULL DEFAULT 'INR',
  confidence             NUMERIC(4,3) NOT NULL,
  coverage               NUMERIC(4,3) NOT NULL,
  freshness_seconds      INTEGER NOT NULL,
  data_gaps              TEXT[],
  is_stale               BOOLEAN NOT NULL DEFAULT FALSE,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.17 AuditEvent

```sql
CREATE TABLE audit_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(user_id),  -- NULL for system events
  event_type      TEXT NOT NULL,     -- 'login', 'export', 'deletion', 'import', 'correction', 'consent_change', 'ai_tool_call', etc.
  entity_type     TEXT,
  entity_id       UUID,
  actor           TEXT NOT NULL,     -- 'user', 'system', 'agent', 'admin'
  request_id      TEXT,
  trace_id        TEXT,
  metadata        JSONB,             -- safe metadata (no raw financial values)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NEVER store raw balances, account numbers, or statements in audit_events.metadata
```

### 2.18 Notification

```sql
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  type            TEXT NOT NULL,     -- 'bill_due', 'unusual_spend', 'budget_alert', 'goal_drift', 'forecast_alert', 'insight'
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  action_url      TEXT,
  entity_type     TEXT,              -- linked entity
  entity_id       UUID,
  status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'sent', 'acknowledged', 'snoozed', 'archived'
  scheduled_at    TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  snoozed_until   TIMESTAMPTZ,
  channel         TEXT NOT NULL DEFAULT 'in_app',  -- 'in_app', 'push', 'email'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.19 AIInteraction

```sql
CREATE TABLE ai_interactions (
  interaction_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  session_id      TEXT NOT NULL,
  request_type    TEXT NOT NULL,     -- 'conversation', 'insight', 'afford_check', 'leak_detect', 'forecast_explain'
  intent          TEXT,
  risk_level      TEXT NOT NULL DEFAULT 'low',  -- 'low', 'medium', 'high', 'blocked'
  model_used      TEXT,
  model_route     TEXT,
  input_token_count INTEGER,
  output_token_count INTEGER,
  cost_usd_micro  BIGINT,            -- micro-dollars (cost * 1,000,000)
  tools_called    TEXT[],
  policy_decision TEXT,
  latency_ms      INTEGER,
  status          TEXT NOT NULL,     -- 'success', 'error', 'blocked', 'insufficient_data'
  error_code      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.20 ToolInvocation

```sql
CREATE TABLE tool_invocations (
  invocation_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id  UUID NOT NULL REFERENCES ai_interactions(interaction_id),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  tool_id         TEXT NOT NULL,
  tool_version    TEXT NOT NULL,
  risk_level      TEXT NOT NULL,
  input_schema_hash TEXT,            -- schema hash for validation audit
  output_status   TEXT NOT NULL,     -- 'success', 'error', 'rate_limited', 'policy_blocked'
  execution_ms    INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.21 ImportJob

```sql
CREATE TABLE import_jobs (
  job_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  connection_id   UUID REFERENCES source_connections(connection_id),
   idempotency_key TEXT NOT NULL,
   -- USER-SCOPED: UNIQUE(user_id, idempotency_key) — global-unique is a cross-user collision bug (F-B5)
   UNIQUE (user_id, idempotency_key),
  job_type        TEXT NOT NULL,     -- 'pdf', 'csv', 'excel', 'ocr', 'manual'
  status          TEXT NOT NULL DEFAULT 'queued',  -- 'queued', 'processing', 'normalization', 'reconciliation', 'completed', 'failed', 'dead_letter'
  attempt         INTEGER NOT NULL DEFAULT 0,
  max_attempts    INTEGER NOT NULL DEFAULT 3,
  last_error      TEXT,
  next_retry_at   TIMESTAMPTZ,
  file_ref        TEXT,              -- object storage key
  records_total   INTEGER,
  records_parsed  INTEGER,
  records_failed  INTEGER,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  correlation_id  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Domain Module Map

| Domain | Entities | Phase |
|--------|----------|-------|
| identity | users | Phase 1 |
| consent | consent_records | Phase 1 |
| ingestion | source_connections, source_records, statements, import_jobs | Phase 2 |
| normalization | transactions (create), merchants, categories | Phase 3 |
| merchant | merchants | Phase 3 |
| categorization | categories, transaction.category_* | Phase 3 |
| reconciliation | transaction.duplicate_*, transfer_*, settlement_*, corrections | Phase 4 |
| ledger | derived balances from transactions | Phase 5 |
| financial-state | safe_to_spend_snapshots, financial account balances | Phase 5 |
| recurring | recurring_series, commitments | Phase 7 |
| goals | goals | Phase 7 |
| forecast | forecast_snapshots | Phase 8 |
| ai-gateway | ai_interactions, tool_invocations | Phase 9 |
| notifications | notifications | Phase 11 |
| export | (cross-domain reads) | Phase 11 |
| deletion | (cross-domain deletes) | Phase 11 |
| audit | audit_events | Phase 1+ |

---

## 4. Key Invariants

1. `source_records.raw_data` is IMMUTABLE — never updated
2. `transactions.amount_paise` is always positive — direction in `direction` field
3. Transfer debit + credit = same `transfer_group_id`, both clearly marked
4. Card purchase + settlement = same `settlement_group_id`
5. Duplicates keep all records — one marked `primary`, others `duplicate`
6. All corrections write to `corrections` table — original is NEVER deleted
7. `safe_to_spend_snapshots.input_snapshot` stores full input state
8. `forecast_snapshots.input_snapshot` stores full input state
9. All monetary amounts include explicit `currency` column
10. All timestamps are `TIMESTAMPTZ` (timezone-aware)
