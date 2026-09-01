import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionWorker } from '../workers/ingestion.worker.js';

// Mock storage that returns deterministic content based on file_ref
class MockStorage {
    async downloadFile(_bucket, fileRef) {
        if (fileRef === 'test_file.pdf') return Buffer.from('date,description,amount\n2023-01-01,AMAZON,"1,234.56"\n');
        if (fileRef === 'test.csv') return Buffer.from('date,description,amount\n2023-10-01,AMAZON,500.00\n');
        if (fileRef === 'fail_me.pdf') throw new Error('Transient network error');
        if (fileRef === 'fail_me_twice.pdf') throw new Error('Transient network error again');
        if (fileRef === 'malformed.xyz') { const e = new Error('Unsupported format: .xyz'); e.isPermanentFailure = true; throw e; }
        throw new Error(`Unknown file: ${fileRef}`);
    }
}

describe('PHASE 2.2 - ASYNC INFRASTRUCTURE & WORKER', async () => {

    it('1. Worker should successfully process a valid job and create source record', async () => {
        const worker = new IngestionWorker(new MockStorage());

        // Pre-create user and job
        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-1') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;
        await dbClient.query(`DELETE FROM source_records WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_1_${Date.now()}`,
            job_type: 'csv',
            file_ref: 'test_file.pdf'
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        // Worker poll
        await worker.pollOnce(job.job_id);

        // Verify Job State
        const checkJob = await dbClient.query(`SELECT status FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        assert.strictEqual(checkJob.rows[0].status, 'completed');

        // Verify Source Record created
        const checkRecord = await dbClient.query(`SELECT * FROM source_records WHERE import_job_id = $1`, [job.job_id]);
        assert.strictEqual(checkRecord.rows.length, 1);
    });

    it('2. Worker should increment attempt and set backoff on transient failure', async () => {
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-2') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_2_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 'fail_me.pdf'
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status, attempt, next_retry_at FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        // After transient failure, status may be 'processing' with backoff or 'queued', attempt > 0
        assert.ok(['processing', 'queued'].includes(checkJob.rows[0].status), 'Should be in retry state');
        assert.ok(checkJob.rows[0].attempt >= 1, 'Should have incremented attempt');
    });

    it('3. Worker should route permanent failures straight to DLQ (Dead Letter Queue)', async () => {
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-3') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_3_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 'malformed.xyz'
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status, attempt, last_error FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        assert.strictEqual(checkJob.rows[0].status, 'dead_letter');
        assert.ok(checkJob.rows[0].last_error.includes('Unsupported format'), 'Error reason captured');
    });

    it('4. Worker should route to DLQ after Max Retries exhausted', async () => {
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-4') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_4_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 'fail_me_twice.pdf'
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        // Fast-forward attempt count to Max - 1 (2 attempts)
        await dbClient.query(`UPDATE import_jobs SET attempt = 2, status = 'queued' WHERE job_id = $1`, [job.job_id]);

        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status, attempt FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        assert.strictEqual(checkJob.rows[0].status, 'dead_letter');
        assert.ok(checkJob.rows[0].attempt >= 3, 'Reached max retries');
    });

});

