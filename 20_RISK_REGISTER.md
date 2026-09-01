# Risk Register — AI Financial Life Manager

**Version:** 1.0  
**Last Updated:** 2026-08-22  
**PRD Reference:** Section 35, Section 91

---

## Risk Status Legend

| Status | Meaning |
|--------|---------|
| `OPEN` | Risk identified, mitigation pending |
| `MITIGATING` | Mitigation in progress |
| `MITIGATED` | Mitigation implemented and verified |
| `ACCEPTED` | Risk accepted with rationale |
| `CLOSED` | Risk no longer applicable |

## Severity Legend

| Severity | Description |
|----------|-------------|
| `CRITICAL` | Project/product-threatening; blocks release |
| `HIGH` | Significant impact; must address before phase exit |
| `MEDIUM` | Notable impact; address before V1 beta |
| `LOW` | Minor impact; address when feasible |

---

## Financial Correctness Risks

### RISK-FC-001 — Floating Point Money Arithmetic
**Severity:** CRITICAL  
**Status:** MITIGATING (ADR-003 written, implementation pending)  
**Description:** If monetary amounts are stored or calculated using floating-point arithmetic, rounding errors accumulate over time, leading to incorrect balances and Safe-to-Spend values.  
**Impact:** Incorrect financial data displayed to users — core product failure  
**Mitigation:** ADR-003 mandates INTEGER paise storage. Schema enforces INTEGER columns. Code review checks for any float usage in money paths.  
**Owner:** Backend engineering  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

### RISK-FC-002 — Double-Counting Card Settlement
**Severity:** CRITICAL  
**Status:** MITIGATING (spec written, implementation pending)  
**Description:** If card purchases AND card settlement payments are both counted as expenses, user's spending total is inflated by 2×.  
**Impact:** Safe-to-Spend wildly incorrect; user loses trust  
**Mitigation:** Reconciliation engine Rule CS1 + settlement_group_id pattern. Finance regression fixture: `credit-card-settlement.fixture.js`  
**Phase Gate:** Must be MITIGATED before Phase 4 exit

---

### RISK-FC-003 — Own-Account Transfers Counted as Income/Expense
**Severity:** CRITICAL  
**Status:** MITIGATING  
**Description:** If a user transfers money between their own accounts (NEFT/IMPS), both legs get counted — once as expense and once as income — inflating both totals.  
**Mitigation:** Transfer detection engine (Rules T1, T2). Reconciliation invariant INV-004.  
**Phase Gate:** Must be MITIGATED before Phase 4 exit

---

### RISK-FC-004 — Duplicate Transaction Import
**Severity:** HIGH  
**Status:** MITIGATING  
**Description:** If the same bank statement is uploaded twice, transactions appear doubled in balance and spending calculations.  
**Mitigation:** Duplicate detection (Rules D1–D4), idempotency keys on import jobs, source_record dedup.  
**Phase Gate:** Must be MITIGATED before Phase 2 exit

---

### RISK-FC-005 — LLM Inventing Financial Data
**Severity:** CRITICAL  
**Status:** MITIGATING (AI Gateway spec written, implementation pending)  
**Description:** If the LLM is allowed to respond with invented balances, transactions, or totals, users receive false financial information.  
**Mitigation:** AI Gateway enforces deterministic tool calls for all financial computations. Evidence validator blocks unsupported claims.  
**Phase Gate:** Must be MITIGATED before Phase 9 exit

---

## Security Risks

### RISK-SEC-001 — Hardcoded Credentials in Repository
**Severity:** CRITICAL  
**Status:** OPEN  
**Description:** Developer commits API keys, DB passwords, or Firebase credentials to Git repository.  
**Mitigation:** .gitignore configuration, pre-commit hooks (secret scanning), CI secret scan, developer education.  
**Phase Gate:** Must be MITIGATED before Phase 1 starts

---

### RISK-SEC-002 — Missing User_ID Ownership Check
**Severity:** CRITICAL  
**Status:** OPEN (implementation not started)  
**Description:** If an API endpoint queries data by entity ID without also filtering by `user_id`, user A can access user B's financial data by guessing UUIDs.  
**Mitigation:** Authorization middleware enforces user_id check. Test suite has cross-user access tests that must return 403.  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

### RISK-SEC-003 — Prompt Injection via Imported Data
**Severity:** HIGH  
**Status:** MITIGATING (spec written)  
**Description:** Merchant names, descriptions, or OCR text in imported statements contain instructions that override AI system behavior.  
**Mitigation:** AI Gateway sanitizes all external content before LLM context. System prompt integrity enforced.  
**Phase Gate:** Must be MITIGATED before Phase 9 exit

---

### RISK-SEC-004 — Malicious File Upload
**Severity:** HIGH  
**Status:** MITIGATING (spec written)  
**Description:** User uploads PDF/Excel with embedded macros, scripts, or formula injection (=cmd() in CSV).  
**Mitigation:** File validation (type, size, encoding, no macros, formula injection check). Parsers run in isolated context.  
**Phase Gate:** Must be MITIGATED before Phase 2 exit

---

### RISK-SEC-005 — Provider Key Exposure in Client Bundle
**Severity:** CRITICAL  
**Status:** OPEN  
**Description:** Firebase/OmniRouter/AI keys bundled into frontend JavaScript, exposed to any user.  
**Mitigation:** All provider calls via backend adapters. No provider SDKs in frontend. Environment variables server-side only. CSP headers block unauthorized connections.  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

## Privacy Risks

### RISK-PRI-001 — Financial Data in Analytics Events
**Severity:** HIGH  
**Status:** OPEN  
**Description:** Raw transaction amounts, account numbers, or balance values accidentally included in product analytics events.  
**Mitigation:** Analytics event schema uses pseudonymous IDs and aggregate signals only. Code review for analytics calls.  
**Phase Gate:** Must be MITIGATED before Phase 6 exit

---

### RISK-PRI-002 — Financial Data in Logs
**Severity:** HIGH  
**Status:** OPEN (logging not yet implemented)  
**Description:** Structured logs contain raw balances, transaction descriptions, or account numbers.  
**Mitigation:** Logging policy enforced. Log review in CI. No raw financial values in any log statement.  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

## Architecture Risks

### RISK-ARCH-001 — Provider Coupling
**Severity:** HIGH  
**Status:** MITIGATING (adapter pattern specified)  
**Description:** Domain code directly calls Firebase/OmniRouter APIs. If provider changes pricing or APIs, large rewrites required.  
**Mitigation:** Adapter interfaces defined (ADR-004). All provider access via adapters. Domain never imports provider SDK directly.  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

### RISK-ARCH-002 — Schema Migration Destroys Data
**Severity:** CRITICAL  
**Status:** MITIGATING (ADR-011 written)  
**Description:** A poorly designed migration drops a column or table with real user data.  
**Mitigation:** Expand/contract migration pattern. Rollback must be tested before every migration deployment. Backup before migration.  
**Phase Gate:** Must be MITIGATED before each phase that introduces migrations

---

### RISK-ARCH-003 — Financial Logic in Frontend
**Severity:** CRITICAL  
**Status:** OPEN (not implemented yet)  
**Description:** Financial calculations (Safe-to-Spend, balance, totals) are performed in browser JavaScript, making them manipulable and incorrect.  
**Mitigation:** Architecture rule: UI never performs authoritative financial calculations. ESLint rule to detect violations.  
**Phase Gate:** Must be MITIGATED before Phase 5 exit

---

## Operational Risks

### RISK-OPS-001 — AI Cost Spike
**Severity:** HIGH  
**Status:** MITIGATING (cost governor specified)  
**Description:** AI requests consume excessive tokens, leading to unexpected cost spike.  
**Mitigation:** Cost governor with per-user/per-feature/daily limits. Hard spend stops. Anomaly detection.  
**Phase Gate:** Must be MITIGATED before Phase 9 exit

---

### RISK-OPS-002 — Import Job Queue Backlog
**Severity:** MEDIUM  
**Status:** OPEN  
**Description:** High volume of import jobs causes queue backlog, users see long processing times.  
**Mitigation:** Priority queues (HIGH/MEDIUM/LOW). Dead-letter queue. User-visible status updates. Runbook for backlog.  
**Phase Gate:** Must be MITIGATED before Phase 2 exit

---

### RISK-OPS-003 — No Backup/Restore Process
**Severity:** CRITICAL  
**Status:** OPEN  
**Description:** Database failure with no tested restore process results in permanent data loss.  
**Mitigation:** Database backups configured. Restore process documented and tested monthly.  
**Phase Gate:** Must be MITIGATED before Phase 1 exit

---

## Risk Summary Dashboard

| Category | CRITICAL | HIGH | MEDIUM | LOW |
|----------|----------|------|--------|-----|
| Financial Correctness | 3 | 2 | 0 | 0 |
| Security | 3 | 2 | 0 | 0 |
| Privacy | 0 | 2 | 0 | 0 |
| Architecture | 2 | 1 | 0 | 0 |
| Operational | 1 | 1 | 1 | 0 |
| **Total** | **9** | **8** | **1** | **0** |
