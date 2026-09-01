
## Ingestion Flow (Part 2 - Async Processing & Worker)

### PostgreSQL as a Queue (Local Mode)
To keep the local development environment self-contained while mimicking Cloudflare edge workers, we use `import_jobs` as a transactional queue.
Workers use `FOR UPDATE SKIP LOCKED` to atomically claim jobs. This prevents double-processing if multiple workers are running.

### Dead-Letter Queue (DLQ) & Failure Handling
The `JobLifecycle` service enforces strict failure bounds:
1. **Transient Failures:** (e.g. Network error downloading from R2) increments the attempt count and schedules a retry with exponential backoff.
2. **Max Retries Exhausted:** After 3 attempts, the job is moved to `DEAD_LETTER` status.
3. **Permanent Failures:** (e.g. Malformed file structure) completely bypass retries and are immediately marked as `DEAD_LETTER`.

All errors and states are perfectly traceable in the `import_jobs` table.
