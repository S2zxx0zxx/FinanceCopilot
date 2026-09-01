import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionService } from '../domains/ingestion/ingestion.service.js';


import { IngestionWorker } from '../workers/ingestion.worker.js';

describe('PHASE 2.6 - OBSERVABILITY, AUDIT & CHECKSUM QA', async () => {
    
    // Mock adapters - avoid requiring real env vars
    class MockStorageAdapter {
        async getSignedUploadUrl(_bucket, key, _type, _exp) { return `https://mock-r2/${key}`; }
        async downloadFile(_bucketName, _fileKey) {
            return Buffer.from('date,description,amount\n2023-10-01,AMAZON,500.00\n');
        }
    }
    class MockQueueAdapter {
        async enqueue(_job) { return true; }
    }
    
    const service = new IngestionService(new MockStorageAdapter(), new MockQueueAdapter(), IngestionRepo);
    const worker = new IngestionWorker(new MockStorageAdapter(), undefined);

    it('1. MUST LOG AUDIT EVENTS AND PRESERVE TRACEABILITY (Checksum + Correlation ID)', async () => {
        // Setup User
        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('qa-obs-user-1') ON CONFLICT (firebase_uid) DO UPDATE SET firebase_uid = EXCLUDED.firebase_uid RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const CORRELATION_ID = 'trace-xyz-123';
        const CHECKSUM = 'md5-abc-999';

        // 1. Initiate Upload (Should log UPLOAD_INITIATED)
        const intent = await service.initiateUpload(userId, 'obs-test.csv', 'text/csv', CORRELATION_ID);
        
        assert.ok(intent.job_id);

        // Verify DB recorded correlation_id
        const checkJob1 = await IngestionRepo.getImportJob(intent.job_id);
        assert.strictEqual(checkJob1.correlation_id, CORRELATION_ID);

        // 2. Confirm Upload (Should log UPLOAD_CONFIRMED and save checksum)
        await service.confirmUpload(userId, intent.job_id, intent.storage_key, CHECKSUM);

        // Verify DB recorded checksum
        const checkJob2 = await IngestionRepo.getImportJob(intent.job_id);
        assert.strictEqual(checkJob2.file_checksum, CHECKSUM);
        assert.strictEqual(checkJob2.status, 'queued');

        // 3. Worker Process (Should log INGESTION_SUCCESS)
        await worker.pollOnce(intent.job_id); // It will pick up the 'queued' job

        const checkJob3 = await IngestionRepo.getImportJob(intent.job_id);
        assert.strictEqual(checkJob3.status, 'completed');

        // 4. Traceability Audit! Check the `audit_events` table
        const auditRes = await dbClient.query(`
            SELECT event_type, metadata 
            FROM audit_events 
            WHERE entity_id = $1 
            ORDER BY timestamp ASC
        `, [intent.job_id]);

        const events = auditRes.rows;
        
        // We expect 3 events: INITIATED -> CONFIRMED -> SUCCESS
        assert.strictEqual(events.length, 3, 'Should have exactly 3 audit events for the lifecycle');
        
        assert.strictEqual(events[0].event_type, 'UPLOAD_INITIATED');
        assert.strictEqual(events[0].metadata.correlation_id, CORRELATION_ID);
        
        assert.strictEqual(events[1].event_type, 'UPLOAD_CONFIRMED');
        assert.strictEqual(events[1].metadata.correlation_id, CORRELATION_ID);
        assert.strictEqual(events[1].metadata.checksum, CHECKSUM);
        
        assert.strictEqual(events[2].event_type, 'INGESTION_SUCCESS');

        // Cleanup
        await dbClient.query(`DELETE FROM audit_events WHERE entity_id = $1`, [intent.job_id]);
        await dbClient.query(`DELETE FROM source_records WHERE import_job_id IN (SELECT job_id FROM import_jobs WHERE user_id = $1)`, [userId]);
        await dbClient.query(`DELETE FROM import_jobs WHERE user_id = $1`, [userId]);
        await dbClient.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    });
});
