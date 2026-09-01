# Environment Variable Matrix

This document acts as the canonical registry for all configuration and secrets required across Local, Staging, and Production environments.

> [!CAUTION]
> **No Secrets in Source:** This matrix lists variable names only. Never commit actual secret values, tokens, or private keys to this repository.

## Backend Secrets (.env or Secret Manager)

| Variable Name | Purpose | Classification | Local | Staging | Production | Owner |
|---|---|---|---|---|---|---|
| `NODE_ENV` | Environment context | Config | `development` | `staging` | `production` | Node.js |
| `PORT` | Backend listen port | Config | `3001` | Cloud config | Cloud config | Node.js |
| `DATABASE_URL` | PostgreSQL Connection String | DB Secret | Local Docker DB | Neon Staging | Neon Prod | PostgreSQL |
| `FIREBASE_PROJECT_ID` | Identity Project ID | Config | local-dev | staging-proj | prod-proj | Firebase |
| `FIREBASE_CLIENT_EMAIL` | Admin SDK email | Provider Cred | dev-svc-account | stg-svc-account | prd-svc-account | Firebase |
| `FIREBASE_PRIVATE_KEY` | Admin SDK private key | Provider Cred | dev-key | stg-key | prd-key | Firebase |
| `AUTH_MODE` | Auth behavior override | Config | `mock` (optional) | `production` | `production` | Backend |
| `R2_ACCOUNT_ID` | Cloudflare R2 Account | Config | dev-cf-acc | stg-cf-acc | prd-cf-acc | Cloudflare |
| `R2_ACCESS_KEY_ID` | S3-compat Access Key | Provider Cred | dev-key | stg-key | prd-key | Cloudflare |
| `R2_SECRET_ACCESS_KEY` | S3-compat Secret Key | Provider Cred | dev-secret | stg-secret | prd-secret | Cloudflare |
| `R2_BUCKET_NAME` | Target R2 Bucket | Config | fincopilot-dev-doc | fincopilot-stg-doc | fincopilot-prd-doc | Cloudflare |
| `OMNIROUTER_API_KEY` | AI Gateway Route | Provider Cred | dev-key | stg-key | prd-key | AI Gateway |

## Edge Secrets (Cloudflare Worker `wrangler.toml` / Secrets)

| Variable Name | Purpose | Classification | Local | Staging | Production |
|---|---|---|---|---|---|
| `ENVIRONMENT` | Edge context | Config | `dev` | `staging` | `production` |
| `API_ORIGIN` | Node backend proxy target | Config | `http://localhost:3001` | `api-staging.domain` | `api.domain` |
| `PRIVATE_DOCUMENTS` | R2 Bucket Binding | Config | (bound bucket) | (bound bucket) | (bound bucket) |
| `INGESTION_QUEUE` | Queue Binding | Config | (bound queue) | (bound queue) | (bound queue) |

## Frontend Public Configuration (Bundled)

*Frontend configurations are considered public and safe for exposure in the browser.*

| Variable Name | Purpose | Classification |
|---|---|---|
| `VITE_API_BASE_URL` | Target API edge | Public Config |
| `VITE_FIREBASE_API_KEY` | Web SDK Key | Public Config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Web SDK Domain | Public Config |
| `VITE_FIREBASE_PROJECT_ID` | Web SDK Project | Public Config |
