# Infrastructure Deployment Readiness

This document confirms the deployment promotion strategy and readiness of the Cloudflare/Firebase infrastructure.

## Environments
- **Local**: `localhost:3001` - Monolithic backend running natively.
- **Staging**: `fincopilot-edge-staging` (Worker) -> `api-staging` (Node origin).
- **Production**: `fincopilot-edge-production` (Worker) -> `api` (Node origin).

## Deployment Model (CI/CD)
The project mandates a strict promotion model:
```text
LOCAL -> CI -> PREVIEW/STAGING -> SMOKE TEST -> SECURITY TEST -> PRODUCTION -> POST-DEPLOY VERIFICATION
```

## Secrets
All backend environment variables are injected natively in the server environment (e.g. Neon, Cloudflare Secrets). NEVER committed to version control.

## Database Migrations
Handled exclusively in the backend deployment step (via `backend/db/migrations/run.js`). The edge worker does not perform migrations.

## Current Readiness Status
- STAGING = **READY** (Requires API_ORIGIN target configuration)
- PRODUCTION = **DEFERRED** (Pending explicit Release Policy approval)
