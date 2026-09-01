# AI Gateway Specification

**Version:** 1.0  
**Status:** Phase 0 — Defined, Not Implemented  
**PRD Reference:** Sections 28, 29, 30, 31, 32, 33, 50  
**ADR Reference:** ADR-004, ADR-005  
**Last Updated:** 2026-08-22

---

## 1. Core Principle

> The AI gateway is the ONLY path from user intent to AI model.
> The browser NEVER calls an AI provider directly.
> The AI model is NEVER the source of financial truth.

---

## 2. Request Flow (Non-Negotiable)

```
USER
  ↓
AI GATEWAY (backend domain: ai-gateway)
  ↓
INTENT / RISK CLASSIFICATION
  ↓
AUTHORIZATION / CONSENT CHECK
  ↓
CONTEXT PLANNER (minimum-necessary context)
  ↓
TOOL SELECTION
  ↓
DETERMINISTIC FINANCIAL COMPUTATION (tools execute server-side)
  ↓
LLM REASONING (model gets: context + tool results + prompt)
  ↓
EVIDENCE VALIDATOR (verify LLM references match tool outputs)
  ↓
SAFETY / POLICY VALIDATOR
  ↓
STRUCTURED RESPONSE
  ↓
UI
```

---

## 3. Intent Classification

Every request is classified before processing:

| Intent Type | Description | Risk |
|-------------|-------------|------|
| `FINANCIAL_QUERY` | "How much did I spend?" | LOW |
| `FINANCIAL_EXPLAIN` | "Why is my Safe-to-Spend low?" | LOW |
| `SCENARIO_ANALYSIS` | "Can I afford X?" | MEDIUM |
| `PATTERN_DETECTION` | "What are my money leaks?" | LOW |
| `FORECAST_QUERY` | "What's my 30-day outlook?" | LOW |
| `GOAL_ANALYSIS` | "Am I on track for my vacation?" | LOW |
| `CORRECTION_SUGGEST` | "I think this category is wrong" | LOW |
| `EXTERNAL_SIDE_EFFECT` | "Transfer money / Pay bill" | **DISABLED_V1** |
| `DATA_DELETION` | "Delete my data" | **REQUIRES_EXPLICIT_CONSENT** |
| `ADMIN_COMMAND` | Attempts to override system | **BLOCKED** |
| `POLICY_OVERRIDE` | Prompt injection attempt | **BLOCKED + LOGGED** |

---

## 4. Risk Classification

| Risk Level | Description | Policy |
|------------|-------------|--------|
| `low` | Read-only, bounded context | Execute normally |
| `medium` | Analysis with user data impact | Execute with evidence validation |
| `high` | Scenario with real-world implications | Execute with safety validator + evidence |
| `blocked` | Policy violation, injection attempt | Reject, log security event |

---

## 5. Context Planner

Context sent to LLM is **minimum necessary**.

Context must be scoped by:
- Account (only the user's own accounts)
- Time window (only what's needed for the question)
- Transaction set (bounded — never unlimited history)
- Goal (only relevant goal)
- User preference (explicit preferences only)
- Request intent (query-specific)

**NEVER send:**
- Raw bank statement files
- Other users' data
- Provider credentials
- System configuration
- Raw source records
- Unrestricted full transaction history

Context size limits:
- Default: 50 most recent relevant transactions
- Max: 200 transactions per request (configurable)
- Max tokens: governed by cost governor

---

## 6. Tool Registry

All AI tools must be registered with full metadata:

```yaml
tool_id: get_spending_by_category
version: 1.0.0
description: Get total spending for a category in a time period
class: READ_ONLY
risk_level: low
required_consent: basic_data_access
input_schema:
  category_slug: string
  from_date: date
  to_date: date
  account_ids: [uuid]  # optional filter
output_schema:
  total_paise: integer
  currency: string
  transaction_count: integer
  period_start: date
  period_end: date
read_scopes: [transactions:read, accounts:read]
write_scopes: []
max_cost_tokens: 0  # deterministic, no LLM tokens
timeout_ms: 5000
rate_limit: 60/min
allowed_environments: [development, staging, production]
approval_policy: auto  # no user approval needed for read
audit_event: TOOL_INVOCATION
retry_policy: { max_attempts: 2, backoff: exponential }
```

### V1 Tool Class Definitions

| Class | Description | V1 Status |
|-------|-------------|-----------|
| `READ_ONLY` | Reads from canonical financial state | ✅ ENABLED |
| `DETERMINISTIC_COMPUTE` | Safe-to-Spend, balance, forecast engine calls | ✅ ENABLED |
| `DRAFT` | Creates draft items for user to review | ✅ ENABLED |
| `USER_CONFIRMED_MUTATION` | Writes after explicit user confirmation | ✅ ENABLED (corrections) |
| `EXTERNAL_SIDE_EFFECT` | Any external financial action | ❌ DISABLED |
| `ENGINEERING_ADMIN` | System configuration | ❌ DISABLED (agent only, L7) |

### V1 Tool Inventory

| Tool ID | Class | Description |
|---------|-------|-------------|
| `get_account_balance` | READ_ONLY | Get account balance + freshness |
| `get_spending_by_category` | READ_ONLY | Category spending total for period |
| `get_spending_summary` | READ_ONLY | Overall spending summary |
| `get_income_summary` | READ_ONLY | Income summary for period |
| `get_transactions` | READ_ONLY | Bounded transaction list |
| `get_recurring_series` | READ_ONLY | Detected recurring payments |
| `get_upcoming_commitments` | READ_ONLY | Upcoming bills/EMIs |
| `get_goals` | READ_ONLY | User goals and progress |
| `compute_safe_to_spend` | DETERMINISTIC_COMPUTE | Compute Safe-to-Spend (deterministic) |
| `compute_forecast` | DETERMINISTIC_COMPUTE | Compute forecast |
| `compute_afford_check` | DETERMINISTIC_COMPUTE | Affordability analysis |
| `detect_money_leaks` | DETERMINISTIC_COMPUTE | Money leak analysis |
| `search_transactions` | READ_ONLY | Search transactions |
| `suggest_category_correction` | DRAFT | Suggest transaction category fix |
| `suggest_recurring_confirm` | DRAFT | Suggest recurring series confirmation |

**A model request alone is NEVER sufficient permission to call a tool.**

---

## 7. Evidence Validator

After the LLM generates a response, the evidence validator checks:

1. Every financial value cited by the LLM exists in tool outputs
2. No invented balances or amounts
3. No transactions referenced that weren't in the context
4. Confidence values are within tool-reported ranges
5. No unsupported claims (guaranteed savings, etc.)

If validation fails:
```
Block response
↓
Log evidence_validation_failure event
↓
Return: "I couldn't verify this information from your data"
↓
Offer to re-run with clarification
```

---

## 8. Safety Validator

Checks every response for:

| Check | Action if Failed |
|-------|-----------------|
| Financial advice claims | Block + safe response |
| Guaranteed returns/savings | Block + safe response |
| "You must" / coercive language | Soften + return |
| External side effect attempt | Block + log |
| Sensitive data leakage | Block + log + security event |
| Prompt injection in response | Block + log + security event |
| Out-of-scope financial product | Block + scope message |

---

## 9. AI Response Format

Every AI response follows this structure:

```json
{
  "answer": "You spent ₹8,450 on food this month.",
  "evidence": [
    {
      "type": "category_total",
      "label": "Food & Dining — January 2024",
      "value_paise": 845000,
      "currency": "INR",
      "source": "12 transactions",
      "tool_id": "get_spending_by_category"
    }
  ],
  "assumptions": [
    "Based on transactions from Jan 1 – Jan 22, 2024",
    "Credit card statement not connected — may be incomplete"
  ],
  "impact": null,
  "options": null,
  "confidence": 0.90,
  "coverage": 0.85,
  "status": "success"
}
```

**UX Language Rules:**
- Prefer: "Based on your data, ..."
- Prefer: "Here's what I found in your records..."
- Prefer: "This is an estimate — coverage is 85%"
- Avoid: "You should definitely...", "Guaranteed...", "Risk-free..."

---

## 10. Prompt Injection Defense

Treat as UNTRUSTED (may contain injection attempts):
- Merchant names in transactions
- Bank statement descriptions
- OCR text from receipts
- User-uploaded document content
- External API responses

Injection defense rules:
1. Never include raw untrusted text in system prompt
2. Sanitize all external content before inclusion in context
3. Structured data only in LLM context (JSON, not raw text where possible)
4. If injection detected:
   ```
   Ignore malicious instruction
   ↓
   Continue with trusted system policy
   ↓
   Log SECURITY_EVENT with risk level
   ↓
   Restrict tool access if pattern is repeated
   ↓
   Return safe result using verified data only
   ```

---

## 11. Cost Governor

```
Per-user daily budget: configurable (default $0.10)
Per-feature budget: configurable per intent type
Per-model budget: OmniRouter routing aware
Monthly budget: hard stop at limit

When budget reached:
→ Switch to smaller model (if acceptable quality)
→ Use cached responses where safe
→ Return: "AI analysis temporarily limited — financial data still available"
```

**Model Routing (via OmniRouter):**

| Intent | Default Model | Fallback |
|--------|--------------|---------|
| Simple classification | Small/fast model | Deterministic rules |
| Financial query | Small/medium model | Deterministic engine |
| Complex planning | Stronger model | Medium model |
| Document parsing | Async extraction | OCR rules |
| High-risk response | Strongest + validators | Reject if unavailable |

**Token limits per request:**
- Input context: max 16K tokens (configurable)
- Output: max 2K tokens per response

---

## 12. AI Memory Model

### Allowed Memory

| Type | Description | User Visible? |
|------|-------------|--------------|
| Session Memory | Current conversation context | In conversation |
| Preference Memory | Display/interaction preferences | Yes — editable |
| Correction Signals | User corrections to AI suggestions | Yes — auditable |
| Canonical Financial State | From deterministic systems | Yes — in app |
| Minimal Telemetry | Latency, cost (no financial values) | Aggregated only |

### Forbidden Memory

- Hidden sensitive financial profiling
- Cross-user data
- Raw balance history for training without explicit consent
- Session data persisted beyond session expiry without explicit consent

### Memory Boundaries

- Preferences: user-visible and user-editable in Privacy Center
- Financial state: always from deterministic systems, never LLM-authored
- No hidden state that influences responses without being auditable

---

## 13. AI Unavailability Contract

When AI is unavailable, core financial functionality MUST continue:

| Feature | AI Unavailable Behavior |
|---------|------------------------|
| Financial truth | ✅ AVAILABLE — never depends on AI |
| Account balances | ✅ AVAILABLE |
| Transactions | ✅ AVAILABLE |
| Reconciliation | ✅ AVAILABLE |
| Safe-to-Spend | ✅ AVAILABLE (deterministic engine) |
| Forecast | ✅ AVAILABLE if deterministic engine has data |
| AI explanations | ⚠️ Gracefully unavailable — show static summary |
| AI insights | ⚠️ Show last-generated insights with staleness label |
| AI conversation | ⚠️ Show: "AI is temporarily unavailable. Your financial data is still accessible." |

Never make the product unusable because AI is unavailable.

---

## 14. AI Failure Taxonomy

| Failure | Response |
|---------|----------|
| Wrong arithmetic | Use deterministic tool, block unsupported answer |
| Missing data | State limitation, ask for needed source |
| Wrong classification | Show confidence, allow correction |
| Unsupported claim | Evidence validator blocks |
| Tool failure | Graceful fallback |
| Prompt injection | Ignore + log security event |
| High-risk request | Policy response |
| Model unavailable | Core finance continues |
| Cost limit hit | Smaller model or graceful limit message |
| Timeout | Return deterministic result if available |
