# ADR-011 — Migration and Rollback Policy

**Date:** 2026-08-22  
**Status:** ACCEPTED  
**PRD Reference:** Section 58  

---

## Decision

### Migration Strategy: Expand/Contract

For all database schema changes:

```
Phase 1 — EXPAND
  Add new columns/tables (backward compatible)
  Old code still works

Phase 2 — DEPLOY COMPATIBLE CODE
  Code handles both old and new schema

Phase 3 — BACKFILL
  Populate new columns from old data

Phase 4 — VERIFY
  Confirm backfill correct, data integrity intact

Phase 5 — SWITCH
  Switch reads/writes to new schema

Phase 6 — CONTRACT (later)
  Remove old columns/tables in a future migration
```

### Migration Rules

1. Never drop a column in the same migration that adds its replacement
2. Never rename a column — add new, backfill, delete old (two separate deployments)
3. All migrations are numbered sequentially: `001_`, `002_`, etc.
4. Every migration must have a tested rollback script
5. Never destroy source truth to simplify migration
6. Migrations run automatically in CI (never manually in production)
7. Database backup before any migration in production

### Rollback

Every migration file must include a commented rollback:
```sql
-- Migration 002: Add merchant_verified column
ALTER TABLE merchants ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- ROLLBACK:
-- ALTER TABLE merchants DROP COLUMN is_verified;
```

Before any high-risk migration: rollback script must be tested in staging.

### Risky Migration Definition
- Adding NOT NULL column to existing table with data
- Removing any column
- Changing column type
- Adding unique constraint to existing data
- Large backfills (> 10K rows)

These require: L7 approval + backup + staging validation + rollback ready.

---

## Compliance

- All migrations in `backend/db/migrations/` numbered sequentially
- Rollback scripts documented in each migration file
- Staging test required before any risky migration
