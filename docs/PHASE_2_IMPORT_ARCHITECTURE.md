# PHASE 2 - IMPORT ARCHITECTURE & FOUNDATION

## Ingestion Flow (Part 1 - Upload Intent & Storage)

To achieve strict "Zero-Loss" and prevent large malicious payloads from hitting the Node.js API, FinCopilot uses a direct-to-cloud upload pattern via Presigned URLs.

### 1. The Intent
When a user uploads a statement, the frontend calls `POST /api/v1/import/upload-intent`.
The `IngestionController` securely validates the `mimeType` and `fileName`.

### 2. State Creation
The `IngestionService` creates a deterministic `idempotency_key` and saves an `import_jobs` record in PostgreSQL with status `queued`. This ensures no file is uploaded without DB traceability.

### 3. Presigned URL Generation
The `R2StorageAdapter` leverages `@aws-sdk/client-s3` to generate a short-lived (300 seconds) Presigned URL using `PutObjectCommand`. The server returns this URL to the client.

### 4. Direct Upload & Confirmation
The client performs a `PUT` request directly to the Cloudflare R2 bucket. Once complete, the client calls `POST /api/v1/import/confirm`. The backend then moves the Job into the asynchronous processing queue.

## Immutable Source Records
A critical requirement of Phase 2 is that **source values must never be overwritten**. 
Migration `005_source_records_schema.sql` introduces the `source_records` table.
This table explicitly isolates:
- `raw_amount_text`
- `raw_date_text`
- `raw_merchant_text`
- `provenance_metadata` (e.g. bounding boxes, cell numbers)

Any subsequent Normalization (Phase 3) will reference the `source_record_id` but will **never** mutate the raw text found in this table.
