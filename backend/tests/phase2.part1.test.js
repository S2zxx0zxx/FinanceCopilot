import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionService } from '../domains/ingestion/ingestion.service.js';

// Mock adapters - avoid requiring real env vars in tests
class MockStorageAdapter {
    async getSignedUploadUrl(_bucket, key, _type, _exp) { return `https://mock-r2/${key}?X-Amz-Signature=mock`; }
    async downloadFile(_bucket, _key) { return Buffer.from(''); }
}
class MockQueueAdapter {
    constructor() { this.jobs = []; }
    async enqueue(queueName, payload) { this.jobs.push({ queueName, payload }); return `mock_job_123`; }
}

describe('PHASE 2.1 - INGESTION UPLOAD INTENT & FOUNDATION', async () => {

    it('1. Database should have source_records table (Immutable Truth)', async () => {
        const res = await dbClient.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'source_records';
        `);
        
        const columns = res.rows.map(row => row.column_name);
        assert.ok(columns.includes('source_record_id'), 'Missing source_record_id');
        assert.ok(columns.includes('raw_amount_text'), 'Missing raw_amount_text');
        assert.ok(columns.includes('import_job_id'), 'Missing import_job_id');
        assert.ok(columns.includes('provenance_metadata'), 'Missing provenance_metadata');
    });

    it('2. IngestionService should validate file types strictly', async () => {
        const storageAdapter = new MockStorageAdapter();
        const queueAdapter = new MockQueueAdapter();
        const ingestionService = new IngestionService(storageAdapter, queueAdapter, IngestionRepo);

        assert.throws(() => {
            ingestionService.validateFileType('image/jpeg', 'receipt.jpg');
        }, /Invalid file type/);

        assert.doesNotThrow(() => {
            ingestionService.validateFileType('application/pdf', 'statement.pdf');
        });
    });

    it('3. IngestionService should issue Presigned URL and create PENDING import job', async () => {
        const storageAdapter = new MockStorageAdapter();
        const queueAdapter = new MockQueueAdapter();
        const ingestionService = new IngestionService(storageAdapter, queueAdapter, IngestionRepo);

        // Pre-create user to satisfy FK
        const userRes = await dbClient.query(`INSERT INTO users (email, firebase_uid) VALUES ('test_p2_${Date.now()}@fincopilot.local', 'fake-firebase-uid-${Date.now()}') ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const intent = await ingestionService.initiateUpload(userId, 'my_statement.pdf', 'application/pdf');

        assert.ok(intent.job_id, 'Job ID should be returned');
        assert.ok(intent.upload_url.includes('X-Amz-Signature'), 'Should return a valid S3 Presigned URL');
        assert.ok(intent.storage_key.includes(userId), 'Storage key should isolate by user');

        // Verify DB State
        const jobRes = await dbClient.query(`SELECT * FROM import_jobs WHERE job_id = $1`, [intent.job_id]);
        assert.strictEqual(jobRes.rows[0].status, 'received');
        assert.strictEqual(jobRes.rows[0].job_type, 'pdf');

        // Confirm Upload
        const confirmResult = await ingestionService.confirmUpload(userId, intent.job_id, intent.storage_key);
        assert.strictEqual(confirmResult.status, 'queued');
        assert.strictEqual(queueAdapter.jobs.length, 1, 'Job should be enqueued to worker');
        
        // Cleanup
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    });

});
