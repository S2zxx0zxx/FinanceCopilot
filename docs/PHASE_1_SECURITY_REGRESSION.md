# PHASE 1 SECURITY REGRESSION

## Authentication Strictness
- `requireAuth` strictly denies requests missing a Bearer token or with a malformed token.
- Expired sessions correctly throw an Unauthorized error in `SessionService`.
- There is NO universal mock identity or bypass in the production code path.

## Authorization Strictness
- `requireOwnership` acts as an absolute wall. Cross-tenant access attempts immediately yield a 403 Forbidden.
- User A can only access User A's data.

## Consent Strictness
- The system enforces a fail-closed policy. If a valid, non-revoked consent matching the required version is not found, protected processing is denied.
- IP addresses captured during consent grants are cryptographically hashed using `CONSENT_HASH_SALT`.

## PostgreSQL Security
- `.env` enforces `sslmode=require&uselibpqcompat=true`, securing the connection to Neon Postgres and eliminating the libpq-ssl downgrade warning.
- The `pg` Pool is configured strictly. If the DB is unavailable, the server fails closed (`process.exit(1)`) rather than running in a compromised state.

## Secrets Management
- All secrets are routed through `config/env.js`.
- Missing critical secrets (`DATABASE_URL`, Firebase keys) immediately halt the server boot process.
- No secrets or sensitive financial keys are hardcoded in the codebase.

## Evidence
- Security behaviors have been validated via execution of `tests/phase1.test.js`.

**STATUS: PASS**
