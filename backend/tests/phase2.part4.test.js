import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionWorker } from '../workers/ingestion.worker.js';

class MockStorage {
    async downloadFile(_bucket, fileRef) {
        if (fileRef === 'test.csv') return Buffer.from('date,description,amount\n2023-10-01,AMAZON,500.00\n');
        if (fileRef === 'data.csv') return Buffer.from('date,description,amount\n2023-10-01,AMAZON,500.00\n');
        throw new Error(`Unknown file: ${fileRef}`);
    }
}

describe('PHASE 2.4 - STRICT CONTRACT REMEDIATION (REPLAY & METADATA)', async () => {

    it('1. Upload Intent should capture exact file metadata and set status to received', async () => {
        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('part4-test-1') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `part4_upload_1_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 's3_path.pdf',
            original_filename: 'My Statement.pdf',
            content_type: 'application/pdf'
        });

        const checkJob = await dbClient.query(`SELECT * FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        
        // Assert Conceptual State Support
        assert.strictEqual(checkJob.rows[0].status, 'received');
        assert.strictEqual(checkJob.rows[0].original_filename, 'My Statement.pdf');
        assert.strictEqual(checkJob.rows[0].content_type, 'application/pdf');
    });

    it('2. CSV Parser should strictly record row_number provenance', async () => {
        const worker = new IngestionWorker(new MockStorage());

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('part4-test-2') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `part4_upload_2_${Date.now()}`,
            job_type: 'csv',
            file_ref: 'test.csv', // Mock triggers worker test buffer
            original_filename: 'data.csv',
            content_type: 'text/csv'
        });

        // Push to queued so worker can claim it
        await dbClient.query(`UPDATE import_jobs SET status = 'queued' WHERE job_id = $1`, [job.job_id]);
        await worker.pollOnce(job.job_id);

        const records = await dbClient.query(`SELECT row_number FROM source_records WHERE import_job_id = $1`, [job.job_id]);
        assert.strictEqual(records.rows.length, 1);
        
        // Provenance Section 6 rule verified
        assert.strictEqual(records.rows[0].row_number, 1);
    });

    it('3. DLQ items can be requested for REPLAY successfully', async () => {
        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('part4-test-3') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: `part4_upload_3_${Date.now()}`,
            job_type: 'pdf',
            file_ref: 's3_path.pdf'
        });

        // Simulate Exhaustion (DLQ)
        await dbClient.query(`
            UPDATE import_jobs 
            SET status = 'dead_letter', attempt = 3, last_error = 'Timeout' 
            WHERE job_id = $1`, [job.job_id]);

        // Trigger Replay Endpoint logic
        await IngestionRepo.requestJobReplay(job.job_id);

        const checkJob = await dbClient.query(`SELECT status, attempt, last_error FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        
        // Assert Replay state resets correctly
        assert.strictEqual(checkJob.rows[0].status, 'queued');
        assert.strictEqual(checkJob.rows[0].attempt, 0);
        assert.strictEqual(checkJob.rows[0].last_error, null);

        // Cleanup
        await dbClient.query(`DELETE FROM source_records WHERE import_job_id IN (SELECT job_id FROM import_jobs WHERE user_id IN (SELECT user_id FROM users WHERE firebase_uid LIKE 'part4-test-%'))`);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id IN (SELECT user_id FROM users WHERE firebase_uid LIKE 'part4-test-%')`);
        await dbClient.query(`DELETE FROM users WHERE firebase_uid LIKE 'part4-test-%'`);
    });

});
