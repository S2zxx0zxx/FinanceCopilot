# API Contracts — AI Financial Life Manager

**Version:** v1  
**Base Path:** `/api/v1`  
**Status:** Phase 0 — Defined, Not Implemented  
**PRD Reference:** Section 16  
**Last Updated:** 2026-08-22

---

## 1. API Principles

- All endpoints require authentication (Bearer token) unless marked `[PUBLIC]`
- All responses include `request_id` and `trace_id` in headers
- All errors use structured error format (see Section 3)
- All paginated endpoints use cursor-based pagination
- All monetary values in API are in **paise** (integer) with explicit `currency` field
- All timestamps in ISO-8601 UTC
- Rate limits apply per user, per endpoint (see Section 4)
- Mutations require idempotency key where marked `[IDEMPOTENT]`

---

## 2. Authentication

### POST /api/v1/auth/session
Create session from Firebase ID token.

**Request:**
```json
{
  "firebase_id_token": "string"
}
```

**Response 200:**
```json
{
  "user_id": "uuid",
  "session_token": "string",
  "expires_at": "ISO-8601",
  "onboarding_done": false,
  "onboarding_step": "welcome"
}
```

### DELETE /api/v1/auth/session
Invalidate current session.

### GET /api/v1/auth/me
Get current authenticated user.

---

## 3. Error Format (Universal)

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested transaction was not found",
    "request_id": "uuid",
    "trace_id": "uuid",
    "details": {}
  }
}
```

**Standard Error Codes:**
| Code | HTTP Status |
|------|------------|
| `UNAUTHENTICATED` | 401 |
| `FORBIDDEN` | 403 |
| `RESOURCE_NOT_FOUND` | 404 |
| `VALIDATION_ERROR` | 422 |
| `RATE_LIMITED` | 429 |
| `INTERNAL_ERROR` | 500 |
| `SERVICE_UNAVAILABLE` | 503 |
| `FINANCIAL_CALCULATION_ERROR` | 500 |
| `IMPORT_VALIDATION_FAILED` | 422 |
| `DUPLICATE_IMPORT` | 409 |
| `INSUFFICIENT_DATA` | 422 |

**NEVER expose:** stack traces, SQL errors, provider keys, internal entity IDs not belonging to user.

---

## 4. Rate Limits

| Endpoint Group | Limit |
|---------------|-------|
| Auth | 10 req/min per IP |
| Import upload | 5 req/min per user |
| Financial state reads | 60 req/min per user |
| Transactions reads | 120 req/min per user |
| AI requests | 20 req/min per user |
| Mutations | 30 req/min per user |

---

## 5. Pagination Format

```json
{
  "data": [...],
  "pagination": {
    "cursor": "opaque_cursor_string",
    "has_more": true,
    "total_count": 1234
  }
}
```

Default page size: 50. Max: 100.

---

## 6. Financial State Endpoints

### GET /api/v1/financial/summary
Get top-level financial summary for Home screen.

**Response 200:**
```json
{
  "request_id": "uuid",
  "safe_to_spend": {
    "amount_paise": 45000,
    "currency": "INR",
    "horizon_days": 30,
    "confidence": 0.85,
    "coverage": 0.92,
    "freshness_seconds": 3600,
    "is_stale": false,
    "data_gaps": [],
    "calculated_at": "ISO-8601",
    "calculation_version": "v1.0.0"
  },
  "total_liquid_cash_paise": 150000,
  "total_invested_paise": null,
  "total_liability_paise": 25000,
  "net_worth_paise": 125000,
  "currency": "INR",
  "data_freshness": {
    "status": "FRESH",
    "last_updated": "ISO-8601",
    "coverage": 0.92
  }
}
```

### GET /api/v1/financial/safe-to-spend
Get detailed Safe-to-Spend with explanation inputs.

### GET /api/v1/financial/cashflow?period=30d
Get cashflow for given period.

**Query params:** `period` = `7d` | `30d` | `90d`

**Response 200:**
```json
{
  "period": "30d",
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "income_paise": 120000,
  "expenses_paise": 85000,
  "net_paise": 35000,
  "currency": "INR",
  "by_category": [...],
  "coverage": 0.92,
  "freshness": "FRESH"
}
```

---

## 7. Account Endpoints

### GET /api/v1/accounts
List all financial accounts.

**Response 200:**
```json
{
  "accounts": [
    {
      "account_id": "uuid",
      "account_type": "savings",
      "institution_name": "HDFC Bank",
      "account_name": "Primary Savings",
      "account_number_last4": "1234",
      "currency": "INR",
      "balance_paise": 125000,
      "balance_freshness": {
        "status": "FRESH",
        "last_updated": "ISO-8601"
      },
      "is_active": true,
      "source_connection_id": "uuid"
    }
  ]
}
```

### GET /api/v1/accounts/:account_id
Get single account with balance history.

### POST /api/v1/accounts
Manually add an account.

### PATCH /api/v1/accounts/:account_id
Update account metadata (name, etc.).

---

## 8. Transaction Endpoints

### GET /api/v1/transactions
List transactions with filtering and pagination.

**Query params:**
- `account_id` — filter by account
- `category_id` — filter by category
- `merchant_id` — filter by merchant
- `direction` — `debit` | `credit`
- `from_date` — YYYY-MM-DD
- `to_date` — YYYY-MM-DD
- `min_amount` — paise
- `max_amount` — paise
- `needs_review` — `true` | `false`
- `posting_status` — `pending` | `posted`
- `cursor` — pagination cursor
- `limit` — max 100

**Response 200:**
```json
{
  "transactions": [
    {
      "transaction_id": "uuid",
      "account_id": "uuid",
      "observed_at": "ISO-8601",
      "amount_paise": 15000,
      "currency": "INR",
      "direction": "debit",
      "merchant_normalized": "Swiggy",
      "category": { "id": "uuid", "name": "Food & Dining", "slug": "food-dining" },
      "transaction_type": "expense",
      "posting_status": "posted",
      "duplicate_status": "unique",
      "transfer_role": null,
      "needs_review": false,
      "overall_confidence": 0.95,
      "is_manual": false,
      "created_at": "ISO-8601"
    }
  ],
  "pagination": { "cursor": "...", "has_more": true, "total_count": 342 }
}
```

### GET /api/v1/transactions/:transaction_id
Get single transaction with full detail and provenance.

**Response 200** — includes `source_record_id`, `corrections` array, full fields.

### POST /api/v1/transactions
`[IDEMPOTENT]` Create manual transaction.

**Headers:** `Idempotency-Key: uuid`

### PATCH /api/v1/transactions/:transaction_id
Correct transaction (category, merchant, type).  
Creates correction record. Original preserved.

---

## 9. Import Endpoints

### POST /api/v1/import/upload
`[IDEMPOTENT]` Upload file for import.

**Headers:**
```
Content-Type: multipart/form-data
Idempotency-Key: uuid
```

**Form fields:**
- `file` — PDF/CSV/Excel/image
- `source_type` — `pdf` | `csv` | `excel` | `receipt`
- `account_hint_id` — optional account association
- `institution_hint` — optional institution name

**Response 202:**
```json
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_duration_seconds": 30
}
```

### GET /api/v1/import/jobs/:job_id
Get import job status.

**Response 200:**
```json
{
  "job_id": "uuid",
  "status": "processing",
  "stage": "normalization",
  "attempt": 1,
  "records_total": 120,
  "records_parsed": 85,
  "records_failed": 2,
  "started_at": "ISO-8601",
  "estimated_completion": "ISO-8601"
}
```

### GET /api/v1/import/jobs
List recent import jobs.

---

## 10. Forecast Endpoints

### GET /api/v1/forecast?horizon=30
Get forecast for given horizon.

**Query params:** `horizon` = `7` | `30` | `90`

**Response 200:**
```json
{
  "snapshot_id": "uuid",
  "horizon_days": 30,
  "forecast_date": "YYYY-MM-DD",
  "model_version": "v1.0.0",
  "projected_low_paise": 10000,
  "projected_mid_paise": 25000,
  "projected_high_paise": 45000,
  "currency": "INR",
  "confidence": 0.72,
  "coverage": 0.88,
  "drivers": [
    { "factor": "salary", "direction": "positive", "weight": 0.6, "amount_paise": 120000 },
    { "factor": "rent", "direction": "negative", "weight": 0.3, "amount_paise": 30000 }
  ],
  "assumptions": [
    "Salary income assumed based on 3-month average",
    "Recurring subscriptions based on detected series"
  ],
  "data_gaps": ["Credit card statement not connected"],
  "calculated_at": "ISO-8601"
}
```

---

## 11. Recurring / Commitments Endpoints

### GET /api/v1/recurring
List detected recurring series.

### GET /api/v1/recurring/:series_id
Get recurring series detail.

### PATCH /api/v1/recurring/:series_id
Confirm, cancel or update recurring series.

### GET /api/v1/commitments?from=YYYY-MM-DD&to=YYYY-MM-DD
List upcoming commitments in date range.

### PATCH /api/v1/commitments/:commitment_id
Mark commitment as paid.

---

## 12. Goals Endpoints

### GET /api/v1/goals
List all goals.

### POST /api/v1/goals
Create a goal.

### GET /api/v1/goals/:goal_id
Get goal with progress.

### PATCH /api/v1/goals/:goal_id
Update goal.

### DELETE /api/v1/goals/:goal_id
Archive/delete goal (soft delete with audit).

---

## 13. AI Gateway Endpoints

### POST /api/v1/ai/chat
`[IDEMPOTENT]` Send message to AI copilot.

**Headers:** `Idempotency-Key: uuid`

**Request:**
```json
{
  "session_id": "uuid",
  "message": "How much did I spend on food this month?",
  "context_hints": {
    "screen": "ai-conversation",
    "time_window": "current_month"
  }
}
```

**Response 200:**
```json
{
  "interaction_id": "uuid",
  "response": {
    "answer": "You spent ₹8,450 on food this month (as of today).",
    "evidence": [
      { "type": "category_total", "category": "Food & Dining", "amount_paise": 845000, "period": "2024-01" }
    ],
    "assumptions": ["Based on 12 transactions in this category"],
    "impact": null,
    "options": null,
    "confidence": 0.95,
    "coverage": 0.92
  },
  "model_used": "gemini-flash",
  "latency_ms": 1200,
  "status": "success"
}
```

**States:** `success` | `insufficient_data` | `ai_unavailable` | `blocked` | `low_confidence`

### POST /api/v1/ai/afford-check
Check if user can afford a purchase.

**Request:**
```json
{
  "amount_paise": 500000,
  "currency": "INR",
  "description": "New laptop",
  "timeline_days": 30
}
```

### POST /api/v1/ai/insights/generate
Trigger insight generation (async).

### GET /api/v1/ai/insights
Get current AI insights feed.

### GET /api/v1/ai/money-leaks
Get money leak analysis.

---

## 14. Spending / Analytics Endpoints

### GET /api/v1/spending/summary?period=30d
Get spending summary by category.

### GET /api/v1/spending/story?period=30d
Get spending story data for visualization.

### GET /api/v1/spending/categories/:category_id?period=30d
Get category detail with transactions.

### GET /api/v1/income/summary?period=30d
Get income summary.

---

## 15. Search Endpoints

### GET /api/v1/search?q=swiggy&types=transactions,merchants
Search across entities.

**Response 200:**
```json
{
  "query": "swiggy",
  "results": {
    "transactions": [...],
    "merchants": [...],
    "accounts": [],
    "goals": []
  }
}
```

---

## 16. Notifications Endpoints

### GET /api/v1/notifications
List notifications.

### PATCH /api/v1/notifications/:notification_id
Acknowledge / snooze notification.

### GET /api/v1/notifications/preferences
Get notification preferences.

### PATCH /api/v1/notifications/preferences
Update notification preferences.

---

## 17. User / Profile Endpoints

### GET /api/v1/user/profile
Get user profile.

### PATCH /api/v1/user/profile
Update profile.

### GET /api/v1/user/consent
Get consent records.

### POST /api/v1/user/consent
Record consent.

### PATCH /api/v1/user/preferences
Update preferences.

---

## 18. Export / Data Endpoints

### POST /api/v1/user/export/request
Request data export.

**Response 202:** Export job queued, email sent when ready.

### GET /api/v1/user/export/:export_id
Get export status.

---

## 19. Deletion Endpoints

### POST /api/v1/user/delete/initiate
Initiate account deletion flow.

**Response 200:**
```json
{
  "deletion_id": "uuid",
  "affected_data": { "transactions": 1234, "accounts": 5, "goals": 3 },
  "irreversible_effects": ["All financial data will be deleted"],
  "confirmation_required": true,
  "confirmation_deadline": "ISO-8601"
}
```

### POST /api/v1/user/delete/confirm
`[IDEMPOTENT]` Confirm deletion.

**Headers:** `Idempotency-Key: uuid`

---

## 20. Health Endpoint

### GET /api/health
`[PUBLIC]`

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "ISO-8601"
}
```

---

## 21. View Model Stability Contract

- API response shapes are versioned
- Breaking changes require version bump
- Additive changes are backward-compatible
- Deprecated fields kept for 2 version cycles
- All fields documented — no mystery fields
- Financial values always include: `amount_paise` + `currency`
- All statuses use explicit string enums, never bare booleans for state

---

## APPENDED CONTRACTS — Phase 0 Remediation (@2026-08-23)
> Added because domain flows referenced them but no contract existed (remediation register F-A10 group). All follow existing envelope/error conventions above.

### POST /api/v1/commitments
Create a user commitment (goal/EMI/subscription) from Home.
- Auth: required (Bearer)
- Request: `{ type: 'goal'|'emi'|'subscription', name: string(1..120), target_amount_paise?: bigint>=0, monthly_amount_paise: bigint>0, due_day?: int 1..31, linked_account_id?: uuid, start_date: date }`
- Responses: `201 { commitment_id, status:'active' }` · `400 INVALID_ARGUMENT` · `409 COMMITMENT_LIMIT` (max active per scope-lock)
- Errors envelope: standard.

### POST /api/v1/recurring
Register a recurring pattern detected or manually defined.
- Request: `{ merchant_id?: uuid, raw_pattern?: string, amount_paise: bigint>0, cadence: 'monthly'|'annual'|'weekly', next_expected_date: date, confidence?: numeric(4,3) }`
- Responses: `201 { recurring_id, status:'active' }` · `400`

### GET /api/v1/review-queue
List transactions needing review (`transactions.needs_review = TRUE`), oldest-first, paginated.
- Query: `?limit<=50&cursor`
- Response: `200 { items: [{ transaction_id, observed_at, amount_paise, direction, merchant_raw, review_reason[] , overall_confidence}], next_cursor? }`

### POST /api/v1/review-queue/{transaction_id}/resolve
Resolve a review item. Exactly ONE action per call; server-side invariant enforcement.
- Request: `{ resolution: 'confirm'|'reassign_category'|'merge_duplicate'|'split'|'mark_transfer', payload?: object }`
- Rules: confirm clears needs_review and writes audit event REVIEW_RESOLVED; merge requires duplicate_group_id membership; mark_transfer requires transfer_group_id.
- Responses: `200 { transaction_id, resolution_applied }` · `404 NOT_FOUND` · `422 INVARIANT_VIOLATION`

### DELETE /api/v1/user/consent/{consent_id}
Revoke a specific consent record. Soft semantics only (consented=false, revoked_at=now); audit event CONSENT_REVOKED mandatory (INV-002).
- Responses: `204` · `404 NOT_FOUND` · `409 ALREADY_REVOKED`
- Note: revoke does NOT delete ledger history (INV-SEC-006).

### PATCH /api/v1/accounts/{account_id}/disconnect
Disconnect a source connection for an account. Ledger data is NEVER deleted (INV-SEC-005).
- Request: `{ reason?: string<=280 }`
- Effects: source_connections.status='disconnected'; future syncs halted; historical transactions untouched.
- Responses: `200 { connection_id, status:'disconnected' }` · `404`

### Deferred (WONT-FIX now)
Statement-level endpoints remain deferred until Phase 2 ingestion lands; see scope-lock. Tracked in control/api-status.yaml.
