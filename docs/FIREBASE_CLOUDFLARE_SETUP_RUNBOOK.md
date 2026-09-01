# Firebase + Cloudflare Setup Runbook

## Prerequisites
1. Cloudflare Account with R2 and Workers enabled.
2. Firebase Project with Authentication enabled (Email/Password).
3. Neon Serverless Postgres Account.

## 1. Firebase Project Setup
- Go to Firebase Console -> Add Project.
- Enable Authentication (Email/Password).
- Create a Service Account for the backend. Download the JSON key.
- Assign the JSON key to `FIREBASE_PRIVATE_KEY` / `GOOGLE_APPLICATION_CREDENTIALS` in backend `.env`.

## 2. Cloudflare R2 Setup
- Go to Cloudflare Dashboard -> R2 -> Create bucket.
- Name bucket deterministically: `fincopilot-{env}-documents`.
- Settings -> Ensure bucket is completely private.
- Generate R2 API Tokens with object read/write access.
- Add credentials to `.env`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.

## 3. Cloudflare Worker Edge Setup
- Install Wrangler: `npm install -g wrangler`.
- Authenticate: `wrangler login`.
- Deploy Worker: 
  ```bash
  cd worker
  wrangler deploy --env staging
  ```
- Configure CORS origin mappings in the Cloudflare Dashboard.

## 4. Rollback
- Rollback Edge logic using Wrangler: `wrangler rollback [version]`.
- Database schema rollbacks are manual via `backend/db/migrations/down/`.
