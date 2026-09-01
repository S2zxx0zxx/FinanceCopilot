# ADR-006 — Data Retention and Deletion

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Sections 63, 24_DATA_LIFECYCLE  

---

## Decision

### Retention Periods
- Financial core data: Indefinite while active; 30-day grace + hard delete after account deletion
- Consent records: 7 years (legal compliance) — anonymized but retained
- Audit events: 2 years — anonymized but retained
- AI interactions: 12 months
- Raw uploaded files: 90 days post-reconciliation, then deleted
- Export files: 24 hours, then auto-deleted

### Deletion Process
1. Soft delete: account deactivated, sessions invalidated
2. 30-day grace period (user can cancel)
3. Hard deletion: financial data deleted, identity anonymized
4. Audit event written (no sensitive content)

### Immutability Exceptions
Source records (`source_records.raw_data`) are immutable during active use. They are deleted according to retention policy on account deletion, not sooner.

### Correction vs Deletion
Users correct transactions — they do not delete them. Deletion is an account-level operation with a full workflow. Single transaction "deletion" is implemented as a correction marking the transaction as deleted (`is_deleted = TRUE`) with an audit trail.

---

## Compliance

- No raw financial content in audit events after deletion
- Export must be available before deletion is confirmed
- Grace period must be enforced (30-day minimum)
- Legal review required before production launch for DPDP compliance
