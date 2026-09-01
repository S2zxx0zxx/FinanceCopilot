# Runbook Index

**Version:** 1.0  
**Status:** Phase 0 — Index Created, Runbooks Pending  
**PRD Reference:** Section 60  
**Last Updated:** 2026-08-22

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `PENDING` | Runbook not yet written |
| `DRAFT` | Written, not yet validated |
| `VALIDATED` | Tested in drill or staging |
| `ACTIVE` | Approved for production use |

---

## Required Runbooks (Production)

| ID | Incident Type | Status | File |
|----|---------------|--------|------|
| RB-001 | API outage | PENDING | docs/runbooks/RB-001-api-outage.md |
| RB-002 | Database saturation | PENDING | docs/runbooks/RB-002-db-saturation.md |
| RB-003 | Import queue backlog | PENDING | docs/runbooks/RB-003-queue-backlog.md |
| RB-004 | AI provider outage | PENDING | docs/runbooks/RB-004-ai-provider-outage.md |
| RB-005 | OmniRouter routing failure | PENDING | docs/runbooks/RB-005-omnirouter-failure.md |
| RB-006 | Cloudflare edge failure | PENDING | docs/runbooks/RB-006-cloudflare-failure.md |
| RB-007 | Firebase provider outage | PENDING | docs/runbooks/RB-007-firebase-outage.md |
| RB-008 | Bad deployment rollback | PENDING | docs/runbooks/RB-008-bad-deployment.md |
| RB-009 | Migration failure | PENDING | docs/runbooks/RB-009-migration-failure.md |
| RB-010 | Duplicate import incident | PENDING | docs/runbooks/RB-010-duplicate-import.md |
| RB-011 | Reconciliation regression | PENDING | docs/runbooks/RB-011-reconciliation-regression.md |
| RB-012 | Unexpected AI cost spike | PENDING | docs/runbooks/RB-012-ai-cost-spike.md |
| RB-013 | Prompt injection incident | PENDING | docs/runbooks/RB-013-prompt-injection.md |
| RB-014 | Credential compromise | PENDING | docs/runbooks/RB-014-credential-compromise.md |
| RB-015 | Data export/deletion incident | PENDING | docs/runbooks/RB-015-export-deletion-incident.md |

---

## Runbook Template

```markdown
# RB-XXX — [Incident Type]

**Severity:** P0 / P1 / P2 / P3
**Last Validated:** YYYY-MM-DD
**Owner:** [Team/Role]

## Symptoms

[What does this incident look like?]
[What alerts fire?]
[What do users experience?]

## Immediate Response (< 5 minutes)

1. [First action]
2. [Second action]
3. [Notify: who]

## Diagnosis

[How to determine root cause]
[Commands to run]
[Dashboards to check]

## Mitigation

[Steps to stop the bleeding]

## Root Cause Analysis

[How to find the root cause]

## Resolution

[Steps to fully resolve]

## Rollback (if applicable)

[Steps to rollback the change]

## Prevention

[What should prevent recurrence]

## Post-Incident

- [ ] Incident report written
- [ ] 20_RISK_REGISTER.md updated
- [ ] Prevention tasks added to 15_TASK_BOARD.md
```

---

## Runbook Creation Schedule

Runbooks must be written before the feature they cover goes to production:

| Phase | Runbooks Required |
|-------|-----------------|
| Phase 1 | RB-009 (Migration failure) |
| Phase 2 | RB-003 (Queue backlog), RB-010 (Duplicate import) |
| Phase 5 | RB-011 (Reconciliation regression) |
| Phase 9 | RB-004 (AI outage), RB-012 (AI cost spike), RB-013 (Prompt injection) |
| Phase 12 | All remaining runbooks |
