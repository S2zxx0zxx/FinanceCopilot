# ADR-005 — Agent Autonomy and Tool Permissions

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Sections 30, 37, 38  

---

## Decision

### Agent Autonomy Levels

| Level | Description | Can Do |
|-------|-------------|--------|
| L0 | Observe | Read repo, docs, telemetry |
| L1 | Plan | Create plans, risk analysis |
| L2 | Implement | Write code in approved areas |
| L3 | Verify | Run tests (cannot self-certify critical) |
| L4 | Staging | Deploy to staging |
| L5 | Release Prep | Prepare production artifacts |
| L6 | Low-risk Prod | Pre-approved operational actions |
| L7 | Critical | Requires explicit human approval |

### L7 Actions (Always Require Human Approval)
- Financial logic changes
- Security boundary changes
- Deletion / destructive migration
- Production policy changes
- Enabling side-effecting tools
- Major architecture changes

### V1 Tool Classes

| Class | Status |
|-------|--------|
| READ_ONLY | ENABLED |
| DETERMINISTIC_COMPUTE | ENABLED |
| DRAFT | ENABLED |
| USER_CONFIRMED_MUTATION | ENABLED (corrections only) |
| EXTERNAL_SIDE_EFFECT | **DISABLED** |
| ENGINEERING_ADMIN | **DISABLED** (L7 only) |

### Tool Permission Rule
A model request alone is NEVER sufficient permission to call a tool. Every tool call requires:
1. User is authenticated
2. User owns the data being accessed
3. Tool is enabled for the current environment
4. Tool risk level is within approved policy
5. Audit event is written

---

## Compliance

- `tool.registry.js` is the authoritative source of tool permissions
- `EXTERNAL_SIDE_EFFECT` tools cannot be enabled without L7 approval + ADR
- All tool invocations logged to `tool_invocations` table
