# Roadmap — AI Financial Life Manager

**Version:** 1.0  
**Status:** Phase 0 Active  
**PRD Reference:** Section 71  
**Last Updated:** 2026-08-22

---

## Phase Overview

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 0 | Discovery / Control Plane | All docs, schemas, control state | 🔄 IN PROGRESS |
| 1 | Foundation | Auth, DB, Security, API baseline | ❌ NOT STARTED |
| 2 | Import | File upload, parsing, raw storage | ❌ NOT STARTED |
| 3 | Normalization | Canonical model, merchant, category | ❌ NOT STARTED |
| 4 | Reconciliation | Dedup, transfer, settlement, corrections | ❌ NOT STARTED |
| 5 | Ledger / Financial State | Balances, Safe-to-Spend, snapshots | ❌ NOT STARTED |
| 6 | Home + Money | Core daily workflow screens | ❌ NOT STARTED |
| 7 | Recurring + Plan | Planning workflow | ❌ NOT STARTED |
| 8 | Forecast | Forecast engine + UI | ❌ NOT STARTED |
| 9 | AI Gateway | Intent, tools, policy, routing | ❌ NOT STARTED |
| 10 | AI UX | Conversation, insights, simulators | ❌ NOT STARTED |
| 11 | Trust / Operations | Notifications, privacy, export, delete | ❌ NOT STARTED |
| 12 | Hardening | Observability, performance, chaos | ❌ NOT STARTED |
| 13 | Beta | Real-user testing, gap analysis | ❌ NOT STARTED |
| 14 | Expansion | AA, broader integrations (post-evidence) | ❌ FUTURE |

---

## Phase 0 — Discovery / Control Plane

**Goal:** Build the complete control and documentation plane before any product code.

**Exit Gate:**
- [ ] All 27 human-readable docs created
- [ ] All 19 machine-readable control state files created  
- [ ] All 12 required ADRs drafted
- [ ] No unresolved critical architecture ambiguity
- [ ] Task board populated with Phase 1 tasks
- [ ] Risk register populated

---

## Phase 1 — Foundation

**Goal:** Secure, authenticated, observable backend that can accept requests.

**Deliverables:**
- [ ] PostgreSQL schema (all 21 entities, migration 001)
- [ ] Firebase auth adapter
- [ ] Session management (httpOnly cookies, short-lived)
- [ ] API/BFF skeleton (Express or CF Worker)
- [ ] Auth middleware
- [ ] Authorization middleware (user_id ownership checks)
- [ ] Rate limiting middleware
- [ ] Request ID + trace ID middleware
- [ ] Error normalization middleware
- [ ] Structured logging (no sensitive data)
- [ ] Consent recording (privacy policy v1)
- [ ] Audit event foundation
- [ ] Health endpoint
- [ ] Environment config (dev/staging/prod separation)
- [ ] CI pipeline (lint, unit tests)
- [ ] Screens: SCR-00 (Splash), SCR-01 (Welcome), SCR-02 (Trust & Privacy), SCR-36 (Profile), SCR-40 (Security)

**Exit Gate:**
- Security baseline tests pass
- Auth flow end-to-end works
- Consent recording verified
- No hardcoded secrets
- No financial data in logs

---

## Phase 2 — Import

**Goal:** Accept file uploads, validate safely, store immutably, begin processing.

**Deliverables:**
- [ ] File upload endpoint (multipart, validation)
- [ ] File type/size/encoding/content validation
- [ ] Formula injection prevention (CSV/Excel)
- [ ] Object storage adapter (R2)
- [ ] Raw file storage
- [ ] source_records table population
- [ ] Import job queue setup
- [ ] Import worker (process queue)
- [ ] PDF parser
- [ ] CSV parser
- [ ] Excel parser
- [ ] Receipt/image OCR path
- [ ] Manual entry endpoint
- [ ] Import job status tracking
- [ ] Retry / dead-letter queue
- [ ] Screens: SCR-04 (Data Connection), SCR-05 (Connection Flow), SCR-06 (First Sync), SCR-42 (Connection Error), SCR-43 (Incomplete Data)

**Exit Gate:**
- Source data preserved and replayable
- Malicious file tests pass
- Idempotency tests pass

---

## Phase 3 — Normalization

**Goal:** Convert immutable source records into canonical transaction records.

**Deliverables:**
- [ ] Canonical transaction creation from source_records
- [ ] Merchant resolver (alias table, fuzzy match)
- [ ] Category taxonomy (system categories)
- [ ] Category classification (rule-based first, AI-assist second)
- [ ] Account/instrument mapping
- [ ] Confidence scoring per field
- [ ] Normalization version tracking
- [ ] Normalization worker

**Exit Gate:**
- Deterministic canonical records
- Re-run produces same output (idempotency)

---

## Phase 4 — Reconciliation

**Goal:** Apply all reconciliation rules to produce financially-correct canonical view.

**Deliverables:**
- [ ] Duplicate detection engine (Rules D1–D4)
- [ ] Transfer detection engine (Rules T1–T2)
- [ ] Card settlement matching engine (Rules CS1–CS2)
- [ ] Pending → Posted resolution
- [ ] Refund / reversal handling
- [ ] Review queue population
- [ ] User correction system (corrections table)
- [ ] All 10 reconciliation invariants enforced
- [ ] Finance regression fixture suite (all 22 scenarios)
- [ ] Reconciliation worker

**Exit Gate:**
- Finance regression suite: 100% pass
- All reconciliation invariants verified by property tests

---

## Phase 5 — Ledger / Financial State

**Goal:** Deterministic, auditable financial state computation.

**Deliverables:**
- [ ] Account balance computation (deterministic)
- [ ] Spending total computation (period-based)
- [ ] Income total computation (period-based)
- [ ] Commitments computation
- [ ] Safe-to-Spend engine (v1.0.0)
- [ ] Safe-to-Spend snapshot storage
- [ ] Freshness tracking
- [ ] Coverage computation
- [ ] Data gap identification
- [ ] Financial state API endpoints
- [ ] Screen: SCR-07 (First Value)

**Exit Gate:**
- Zero critical financial correctness defects
- Safe-to-Spend determinism test (same input → same output always)
- All snapshot fields stored

---

## Phase 6 — Home + Money

**Goal:** Core daily-use screens working with real data.

**Deliverables:**
- [ ] SCR-08 Home (all states: loading, skeleton, partial, stale, offline, error)
- [ ] SCR-10 Money Overview
- [ ] SCR-11 Accounts
- [ ] SCR-12 Account Detail
- [ ] SCR-13 Transactions (with pagination, filter)
- [ ] SCR-14 Transaction Detail (with correction UI)
- [ ] SCR-15 Smart Search
- [ ] SCR-16 Filter Sheet
- [ ] SCR-17 Spending Story
- [ ] SCR-18 Category Detail
- [ ] SCR-33 Income
- [ ] SCR-34 Credit & Liabilities
- [ ] SCR-44 Empty State component
- [ ] SCR-45 Global Search
- [ ] SCR-46 Global Action Sheet
- [ ] All design tokens implemented
- [ ] All reusable components built
- [ ] Mobile-first responsive

**Exit Gate:**
- Core daily workflow works with real imported data
- All screen states (loading, skeleton, empty, partial, stale, offline, error) handled
- No fake data anywhere

---

## Phase 7 — Recurring + Plan

**Exit Gate:** Future planning workflow works with real data.

## Phase 8 — Forecast

**Exit Gate:** Forecast evaluation meets evidence-defined accuracy threshold.

## Phase 9 — AI Gateway

**Exit Gate:** All AI evaluation release gates pass. No direct provider calls from client.

## Phase 10 — AI UX

**Exit Gate:** AI eval suite passes. All AI responses have evidence.

## Phase 11 — Trust / Operations

**Exit Gate:** Security, privacy, export, and deletion checks pass.

## Phase 12 — Hardening

**Exit Gate:** Release readiness scorecard passes.

## Phase 13 — Beta

**Exit Gate:** Real-user trust gaps addressed before expansion.

---

## Key Principles

1. Each phase has a hard exit gate — code existing ≠ phase complete
2. Never skip to UI polishing before data pipeline is correct
3. Financial correctness > UI polish always
4. Security baseline must pass before user data is accepted
5. No feature expansion until current phase exit gate is proven
