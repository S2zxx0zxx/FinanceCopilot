# ADR Index — Architecture Decision Records

**Status:** Phase 0 — All required ADRs must be drafted before V1  
**PRD Reference:** Section 46  
**Last Updated:** 2026-08-22

---

## ADR Status Legend

| Status | Meaning |
|--------|---------|
| `PROPOSED` | Draft created, under review |
| `ACCEPTED` | Approved and active |
| `SUPERSEDED` | Replaced by newer ADR |
| `DEPRECATED` | No longer relevant |

---

## Required ADRs Before V1

| ADR | Title | Status | File |
|-----|-------|--------|------|
| ADR-001 | Canonical Financial Ledger Model | ACCEPTED | docs/adrs/ADR-001-canonical-financial-ledger-model.md |
| ADR-002 | Reconciliation Invariants | ACCEPTED | docs/adrs/ADR-002-reconciliation-invariants.md |
| ADR-003 | Money Precision and Currency Handling | ACCEPTED | docs/adrs/ADR-003-money-precision-currency-handling.md |
| ADR-004 | AI Gateway and Provider Abstraction | ACCEPTED | docs/adrs/ADR-004-ai-gateway-provider-abstraction.md |
| ADR-005 | Agent Autonomy and Tool Permissions | ACCEPTED | docs/adrs/ADR-005-agent-autonomy-tool-permissions.md |
| ADR-006 | Data Retention and Deletion | ACCEPTED | docs/adrs/ADR-006-data-retention-deletion.md |
| ADR-007 | Account/Consent Integration Strategy | ACCEPTED | docs/adrs/ADR-007-account-consent-integration-strategy.md |
| ADR-008 | Forecast Model Versioning | ACCEPTED | docs/adrs/ADR-008-forecast-model-versioning.md |
| ADR-009 | Observability and SLO Policy | ACCEPTED | docs/adrs/ADR-009-observability-slo-policy.md |
| ADR-010 | Modular Monolith vs Service Boundaries | ACCEPTED | docs/adrs/ADR-010-modular-monolith-service-boundaries.md |
| ADR-011 | Migration and Rollback Policy | ACCEPTED | docs/adrs/ADR-011-migration-rollback-policy.md |
| ADR-012 | Production Release Approval Matrix | ACCEPTED | docs/adrs/ADR-012-production-release-approval-matrix.md |

---

## ADR Template

```markdown
# ADR-XXX — Title

**Date:** YYYY-MM-DD  
**Status:** PROPOSED | ACCEPTED | SUPERSEDED | DEPRECATED  
**Deciders:** [User / Agent / Both]  
**Supersedes:** [ADR-YYY if applicable]  
**PRD Reference:** [Section X]

## Context

[What is the problem? Why does this decision need to be made?]

## Decision

[What was decided?]

## Consequences

### Positive
- [Benefit 1]

### Negative / Trade-offs
- [Trade-off 1]

### Risks
- [Risk 1]

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| [Alt 1] | [Reason] |

## Compliance

[What must be true in the implementation for this ADR to be followed?]
```

---

## Future ADRs (Post-V1, as needed)

These will be created when evidence requires them:

- ADR-013 — Account Aggregator Integration
- ADR-014 — ML Forecast Model Introduction
- ADR-015 — Service Extraction (if monolith splitting warranted)
- ADR-016 — Family Finance Feature
- ADR-017 — Investment Analytics Enable
- ADR-018 — SMS Integration
