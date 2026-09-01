# PHASE 1 CONSENT VERIFICATION

## Implementation Status
- The Consent Service is fully integrated with the PostgreSQL `consents` table.
- Mocks have been entirely removed.

## Behavior Verification

| Scenario | Expected | Actual Evidence | Status |
| :--- | :--- | :--- | :--- |
| **No Consent** | Protected operation denied | `consentSvc.hasConsent` returns `false` when no record exists. | PASS |
| **Valid Consent** | Protected operation allowed | `recordConsent` writes to DB; `hasConsent` returns `true`. | PASS |
| **Revoked Consent** | Future operation denied | `revokeConsent` updates `revoked_at`; `hasConsent` returns `false`. | PASS |
| **Invalid Policy Version** | Denial of processing | Policy '2025-01-01' against grant '2024-01-01' returns `false`. | PASS |

## Persistence Verification
- `user_id`, `consent_type`, `version`, `ip_hash` (hashed with salt), `granted_at`, and `revoked_at` are physically stored in the database.
- A unique constraint `idx_user_consent_type` guarantees idempotency.

## Audit Verification
- `CONSENT_GRANTED` (action: grant) and `CONSENT_REVOKED` (action: revoke) are successfully emitted to the Audit Sink and stored in `audit_events`.

## Evidence
- `phase1.test.js` Subtest 5 ("Consent & Audit Real Implementation") executes real DB inserts and queries.

**STATUS: PASS**
