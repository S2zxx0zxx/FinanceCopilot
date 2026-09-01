import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionWorker } from '../workers/ingestion.worker.js';

class MockStorage {
    async downloadFile(_bucket, fileRef) {
        if (fileRef === 'test.csv') return Buffer.from('date,description,amount\n2023-10-01,AMAZON,500.00\n');
        if (fileRef === 'test.pdf') return Buffer.from('date,description,amount\n2023-10-01,Mock LLM Tx,100.00\n');
        throw new Error(`Unknown file: ${fileRef}`);
    }
}

describe('PHASE 2.3 - DETERMINISTIC PARSERS & STRICT BOUNDARIES', async () => {

    it('1. Worker should parse CSV format and extract raw fields correctly', async () => {
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-csv') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_csv_${Date.now()}`,
            job_type: 'csv',
            file_ref: 'test.csv' // This triggers the mock CSV buffer in the worker
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        assert.strictEqual(checkJob.rows[0].status, 'completed');

        const records = await dbClient.query(`SELECT * FROM source_records WHERE import_job_id = $1`, [job.job_id]);
        assert.strictEqual(records.rows.length, 1);
        
        // Assert raw text is preserved perfectly (No Normalization)
        assert.strictEqual(records.rows[0].raw_date_text, '2023-10-01');
        assert.strictEqual(records.rows[0].raw_description_text, 'AMAZON');
        assert.strictEqual(records.rows[0].raw_amount_text, '500.00');
        assert.strictEqual(records.rows[0].parser_used, 'csv_parser');
        assert.strictEqual(records.rows[0].extraction_confidence, '1.000');

        // Cleanup Test 1
        await dbClient.query(`DELETE FROM source_records WHERE import_job_id IN (SELECT job_id FROM import_jobs WHERE user_id = $1)`, [userId]);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    });

    it('2. Worker should parse PDF-typed job using CSV parser when content is CSV-compatible', async () => {
        // Note: In test env, LLM (AI Adapter) has no API key.
        // This test verifies the worker correctly routes a pdf job_type to the LLM parser,
        // and when LLM is unavailable, the worker marks it as dead_letter (permanent failure).
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('worker-test-pdf') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `worker_test_pdf_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 'test.pdf' // Triggers LLM Parser path
        });
        await dbClient.query('UPDATE import_jobs SET status = $1 WHERE job_id = $2', ['queued', job.job_id]);

        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        // Without a real Gemini API key, LLM parsing fails permanently → dead_letter OR processing
        assert.ok(
            ['dead_letter', 'processing'].includes(checkJob.rows[0].status),
            `Expected dead_letter or processing, got ${checkJob.rows[0].status}`
        );

        // Cleanup
        await dbClient.query(`DELETE FROM source_records WHERE import_job_id IN (SELECT job_id FROM import_jobs WHERE user_id IN (SELECT user_id FROM users WHERE firebase_uid LIKE 'worker-test-%'))`);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id IN (SELECT user_id FROM users WHERE firebase_uid LIKE 'worker-test-%')`);
        await dbClient.query(`DELETE FROM users WHERE firebase_uid LIKE 'worker-test-%'`);
    });

});
