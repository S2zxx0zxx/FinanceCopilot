# FinCopilot — Setu Account Aggregator Setup

This runbook is the canonical setup for FinCopilot's Setu AA Gateway integration.
It targets the current Setu AA Gateway (v2/latest), not the legacy v1 ECDH integration.

## 1. Architecture

```text
FinCopilot user
  -> POST /api/v1/aa/consent/initiate
  -> Setu AA Gateway consent URL
  -> user reviews/selects eligible accounts
  -> Setu CONSENT_STATUS_UPDATE webhook
  -> Auto-Fetch (recommended) or manual data session
  -> Setu FI_DATA_READY / SESSION_STATUS_UPDATE
  -> FinCopilot immutable source_records
  -> normalization worker
  -> canonical transactions
  -> reconciliation
  -> financial state / Safe-to-Spend / forecast / AI context
```

Setu is the consented data-connection layer. It is not FinCopilot's calculation
engine and does not replace normalization/reconciliation.

## 2. Bridge — sandbox setup

1. Log in to The Bridge.
2. Set up the FinCopilot FIU with the required legal/business details.
3. Create an **Account Aggregator Data** product.
4. Configure the consent object for FinCopilot's actual PFM use case.
   Recommended product intent:
   - FI type: `DEPOSIT` for the first release.
   - Consent types: `PROFILE`, `SUMMARY`, `TRANSACTIONS` only when each is genuinely required.
   - Purpose: spending patterns / budget reporting (`102`) for the PFM use case.
   - Account selection: multi-account if the product needs consolidated finances.
   - Data range, consent duration, data life and periodic frequency must match the
     privacy policy and actual feature requirements; do not request broader data
     simply because the API permits it.
5. Enable **Auto-Fetch** if FinCopilot should receive periodic data automatically.
6. Set the sandbox notification endpoint to:

   `https://<public-api-domain>/api/v1/aa/webhook?token=<SETU_WEBHOOK_SECRET>`

   Do not commit or publish the token. If Setu enables a supported custom header
   for your account, prefer `x-fincopilot-setu-webhook-token` over a query token.
7. Set the redirect URL to:

   `https://<app-domain>/accounts/connect/callback`

8. Under Bridge API credentials / Org settings, create an OAuth key with access
   to this AA product and record securely:
   - client ID
   - client secret
   - product instance ID / Product ID
9. Never paste the client secret into frontend env variables, source code, issue
   screenshots, analytics, or chat logs.

## 3. Backend environment

Sandbox:

```env
SETU_AA_ENABLED=true
SETU_PRODUCTION=false
SETU_BASE_URL=https://fiu-sandbox.setu.co
SETU_AUTH_URL=https://uat.setu.co/api/v2/auth/token
SETU_API_PREFIX=/v2
SETU_CLIENT_ID=<Bridge OAuth client ID>
SETU_CLIENT_SECRET=<Bridge OAuth client secret>
SETU_PRODUCT_INSTANCE_ID=<AA product instance ID>
SETU_WEBHOOK_SECRET=<long random secret>
SETU_AUTO_FETCH=true
SETU_REDIRECT_URL=https://<app-domain>/accounts/connect/callback
```

Production after Setu approval:

```env
SETU_AA_ENABLED=true
SETU_PRODUCTION=true
SETU_BASE_URL=https://fiu.setu.co
SETU_AUTH_URL=https://prod.setu.co/api/v2/auth/token
SETU_API_PREFIX=/v2
SETU_CLIENT_ID=<production OAuth client ID>
SETU_CLIENT_SECRET=<production OAuth client secret>
SETU_PRODUCT_INSTANCE_ID=<production Product ID>
SETU_WEBHOOK_SECRET=<different production secret>
SETU_AUTO_FETCH=true
SETU_REDIRECT_URL=https://<production-app-domain>/accounts/connect/callback
```

## 4. OAuth behavior

The backend obtains a bearer token from Setu using the Bridge OAuth client ID
and secret, caches it until close to expiry, and refreshes it on expiry/401.
`SETU_ACCESS_TOKEN` exists only as an optional testing/emergency override and
should normally remain unset.

## 5. User-facing flow

Frontend route:

`/accounts/connect`

The user enters the mobile number used for financial-account discovery. The
backend creates the consent and returns Setu's own `redirectUrl`; the browser
redirects to that exact URL. The frontend never manufactures an AA URL.

After the consent journey, Setu returns the user to:

`/accounts/connect/callback`

The callback page does not claim approval by itself. The authoritative state is
the Setu webhook/Get Consent API response.

## 6. Webhook contract

One server-to-server endpoint handles current Setu notification types:

`POST /api/v1/aa/webhook`

Supported types:

- `CONSENT_STATUS_UPDATE`
- `SESSION_STATUS_UPDATE`
- `FI_DATA_READY`

The webhook does **not** use Clerk auth because it is called by Setu, not the
end-user browser. It requires `SETU_WEBHOOK_SECRET`, validates the notification
type, and refuses FI data for unknown/untracked consent IDs.

Current Setu public AA notification docs do not document a cryptographic
provider-signature verification contract. If Setu enables an authenticated
webhook/signature mechanism for the FinCopilot FIU, add that verification and
prefer it over the app-controlled callback secret.

## 7. Auto-Fetch — recommended for FinCopilot

With Auto-Fetch enabled in both Bridge and FinCopilot:

1. User approves consent.
2. Setu creates/monitors the data session.
3. Setu sends `FI_DATA_READY` with decrypted FI data.
4. FinCopilot maps each supported DEPOSIT account to its own source connection
   and financial account.
5. Each Setu transaction is inserted as an immutable `source_record`.
6. The existing normalization worker produces canonical transactions.
7. Reconciliation and financial-state calculations run on canonical data.

Auto-Fetch successful fetches are billable according to the Setu commercial
arrangement. Do not enable an unnecessarily high fetch frequency.

## 8. Manual session fallback

Set `SETU_AUTO_FETCH=false` if manual sessions are required.

When consent becomes ACTIVE, FinCopilot creates a data session. Setu sends
`SESSION_STATUS_UPDATE`; for `PARTIAL`/`COMPLETED`, FinCopilot fetches the
session with `GET /sessions/:id` and feeds delivered accounts into the same
immutable ingestion path.

## 9. Sandbox validation checklist

Before production, prove all of these with Setu sandbox data:

- [ ] OAuth token generation succeeds.
- [ ] Create consent returns a real Setu `id` and `url`.
- [ ] User can open the consent UI.
- [ ] ACTIVE consent webhook reaches FinCopilot.
- [ ] REJECTED consent is stored correctly.
- [ ] REVOKED consent is stored correctly.
- [ ] PAUSED and EXPIRED statuses do not violate DB constraints.
- [ ] Auto-Fetch `FI_DATA_READY` reaches the backend.
- [ ] Setu DEPOSIT account maps to savings/current based on the returned Summary `type`.
- [ ] Unsupported/unresolved account type is skipped instead of guessed.
- [ ] Debit/credit transactions become immutable source records.
- [ ] Replayed FI payload does not duplicate transactions.
- [ ] Normalization worker creates canonical transactions.
- [ ] User A cannot query/revoke User B's consent.
- [ ] Webhook without the configured secret is rejected.
- [ ] Unknown consent ID in a webhook is rejected.
- [ ] Manual session fallback works with Auto-Fetch disabled.

For Setu FIP-2 sandbox testing, use the current OTP/testing instructions shown
in Setu's AA documentation/Bridge; do not hardcode a sandbox OTP into FinCopilot.

## 10. Production go-live

Setu's current production path requires more than changing the base URL:

1. Finish sandbox testing.
2. Fill the production callback URL in Bridge.
3. Complete KYC in Bridge.
4. Submit the product for review.
5. Complete the FIU/Sahamati onboarding steps coordinated by Setu.
6. Wait for production FIU infrastructure/credentials.
7. Store production credentials in the deployment secret store.
8. Use a production-only webhook secret.
9. Run a production smoke test with controlled accounts before enabling the
   feature for all users.

Do not advertise live bank connectivity until production FIU onboarding and a
real production end-to-end fetch have both passed.

## 11. Security / privacy invariants

- Never log bearer tokens, OAuth secrets, PAN, raw profile PII, or entire FI payloads.
- Scope every consent and account to the authenticated FinCopilot user.
- Do not send entire raw AA data to an LLM.
- AI receives only minimized, relevant financial context after deterministic processing.
- Preserve Setu consent revocation and local privacy controls.
- Do not retain raw financial data longer than the consent/data-life policy permits.
- Production secrets belong in a secret manager, not Git.

## 12. Current code files

- `backend/adapters/account-aggregator/account-aggregator.adapter.js`
- `backend/domains/ingestion/aa.service.js`
- `backend/db/setu-aa.repository.js`
- `backend/api/routes/aa.routes.js`
- `backend/db/migrations/026_setu_account_aggregator.sql`
- `frontend/src/app/accounts/connect/page.tsx`
- `frontend/src/app/accounts/connect/callback/page.tsx`
- `.env.example`
