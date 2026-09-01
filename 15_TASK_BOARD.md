# Task Board — AI Financial Life Manager

> **GENERATED VIEW** — canonical source is `control/tasks.yaml`. Do not edit statuses here directly.

**Version:** 2.0  
**Last Updated:** 2026-08-23

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `BACKLOG` | Defined, not ready to start |
| `READY` | Dependencies met, can start |
| `IN_PROGRESS` | Being worked on |
| `BLOCKED` | Waiting on dependency/approval |
| `REVIEW` | Implementation done, needs verification |
| `VERIFIED` | Tests pass, evidence collected |
| `DONE` | All acceptance criteria met, docs synced |

---

## Phase 0 Tasks

### TASK-0001 — Repository Audit
**Status:** DONE  
**PRD Requirement:** Section 4, Section 92  
**Goal:** Inspect repository, detect gaps, produce audit report  
**Evidence:** REPOSITORY_AUDIT.md created. Greenfield confirmed.

---

### TASK-0002 — Human-Readable Control Plane Docs
**Status:** VERIFIED  
**PRD Requirement:** Section 5  
**Goal:** Create all 27 human-readable documents  
**Files:**
- [x] 00_MASTER_PRD.md
- [x] 01_PROJECT_CHARTER.md
- [x] 02_SCOPE_V1.md
- [x] 03_SCREEN_INVENTORY.md
- [x] 04_DESIGN_SYSTEM.md
- [x] 05_ARCHITECTURE.md
- [x] 06_DOMAIN_MODEL.md
- [x] 07_LEDGER_RECONCILIATION_SPEC.md
- [x] 08_API_CONTRACTS.md
- [x] 09_AI_GATEWAY_SPEC.md
- [x] 10_FORECAST_SPEC.md
- [x] 11_SECURITY_PRIVACY.md
- [x] 12_NOTIFICATION_SPEC.md
- [x] 13_QA_TEST_PLAN.md
- [x] 14_ROADMAP.md
- [x] 15_TASK_BOARD.md
- [ ] 16_ADR_INDEX.md
- [ ] 17_CHANGELOG.md
- [ ] 18_AGENT_RULES.md
- [ ] 19_DEFINITION_OF_DONE.md
- [ ] 20_RISK_REGISTER.md
- [ ] 21_RUNBOOK_INDEX.md
- [ ] 22_OBSERVABILITY.md
- [ ] 23_COST_CONTROL.md
- [ ] 24_DATA_LIFECYCLE.md
- [ ] 25_RELEASE_POLICY.md
- [ ] 26_COMPETITIVE_RESEARCH_NOTES.md
- [ ] 27_DECISION_LOG.md

---

### TASK-0003 — Machine-Readable Control State
**Status:** VERIFIED  
**PRD Requirement:** Section 5  
**Goal:** Create all 19 machine-readable YAML/JSONL files in control/  
**Files:** All pending

---

### TASK-0004 — ADR Documents
**Status:** VERIFIED  
**PRD Requirement:** Section 46  
**Goal:** Draft all 12 required ADRs  
**Files:** All pending

---

### TASK-0005 — Repository Configuration
**Status:** VERIFIED  
**Goal:** .gitignore, package.json, README.md update  
**Dependencies:** None

---

## Phase 1 Tasks (BACKLOG — pending Phase 0 completion)

### TASK-1001 — PostgreSQL Initial Schema Migration
**Status:** READY  
**PRD Requirement:** Section 17, Section 58  
**Domain:** database  
**Files:** backend/db/migrations/001_initial_schema.sql  
**Dependencies:** TASK-0002, TASK-0003 (domain model finalized)  
**Risk:** HIGH — schema defines financial data structure  
**Acceptance Criteria:**
- All 21 entities created
- Money stored as INTEGER (paise) — no FLOAT
- All timestamps TIMESTAMPTZ
- All foreign keys correct
- Migration is idempotent
- Rollback tested

### TASK-1002 — Firebase Auth Adapter
**Status:** BACKLOG  
**Domain:** identity, adapters/auth  
**Dependencies:** TASK-1001  
**Risk:** MEDIUM

### TASK-1003 — Session Management
**Status:** BACKLOG  
**Domain:** identity  
**Dependencies:** TASK-1002  
**Risk:** HIGH — security critical

### TASK-1004 — API/BFF Skeleton
**Status:** BACKLOG  
**Domain:** api  
**Dependencies:** TASK-1001  
**Risk:** MEDIUM

### TASK-1005 — Security Middleware Stack
**Status:** BACKLOG  
**Files:** backend/middleware/  
**Dependencies:** TASK-1004  
**Risk:** HIGH — all auth/authz

### TASK-1006 — Consent Recording
**Status:** BACKLOG  
**Domain:** consent  
**Dependencies:** TASK-1002, TASK-1001  
**Risk:** HIGH — legal/privacy requirement

### TASK-1007 — Audit Event Foundation
**Status:** BACKLOG  
**Domain:** audit  
**Dependencies:** TASK-1001  
**Risk:** HIGH — security/compliance

### TASK-1008 — Onboarding Screens (Phase 1 subset)
**Status:** BACKLOG  
**Screens:** SCR-00, SCR-01, SCR-02, SCR-36  
**Dependencies:** TASK-1005, TASK-1006  
**Risk:** MEDIUM

---

## Blocked Tasks

None currently. Phase 0 is unblocked.

---

## Task Template

```yaml
task_id: TASK-XXXX
title: [Task title]
status: BACKLOG
phase: 0
prd_requirement: [Section X]
screen_ids: []
domain_ids: []
goal: [What this task achieves]
non_goals: [What this task does NOT do]
dependencies: []
risk: LOW | MEDIUM | HIGH | CRITICAL
files_expected: []
api_impact: []
db_impact: []
security_impact: []
ai_impact: []
acceptance_criteria: []
test_plan: []
evidence: []
rollback: [How to undo if needed]
reviewer: []
adr: []
post_completion_doc_updates: []
```
