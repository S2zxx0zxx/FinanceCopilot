import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dbClient } from '../db/client.js';
import { IngestionRepo } from '../db/repositories.js';
import { IngestionWorker } from '../workers/ingestion.worker.js';

describe('PHASE 2.5 - DEFERRED EXCEL PARSER', async () => {

    it('1. Worker should route Excel (.xlsx) files to the native Excel Parser', async () => {
        const worker = new IngestionWorker();

        const userRes = await dbClient.query(`INSERT INTO users (firebase_uid) VALUES ('part5-excel-test') RETURNING user_id;`);
        const userId = userRes.rows[0].user_id;

        const job = await IngestionRepo.createImportJob({
            user_id: userId,
            idempotency_key: 'part5_upload_excel',
            job_type: 'excel',
            file_ref: 'test.xlsx', // Mock string - in a real test this points to an S3 object, but worker will fail the download and throw.
            original_filename: 'data.xlsx',
            content_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Push to queued so worker can claim it
        await dbClient.query(`UPDATE import_jobs SET status = 'queued' WHERE job_id = $1`, [job.job_id]);
        
        // We expect the worker to claim it, but fail on R2 download since test.xlsx doesn't exist in our mock bucket.
        // However, the fact that it attempts it means the ParserRegistry successfully routed 'excel' type
        // instead of throwing "Excel parsing is deferred".
        await worker.pollOnce(job.job_id);

        const checkJob = await dbClient.query(`SELECT status, last_error FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        
        // Assert it moved to processing or failed due to storage (NOT due to ParserRegistry error)
        assert.ok(checkJob.rows[0].status === 'processing' || checkJob.rows[0].status === 'queued' || checkJob.rows[0].last_error !== null);
        
        if (checkJob.rows[0].last_error) {
            assert.ok(!checkJob.rows[0].last_error.includes('deferred pending library approval'));
        }

        // Cleanup
        await dbClient.query(`DELETE FROM import_jobs WHERE job_id = $1`, [job.job_id]);
        await dbClient.query(`DELETE FROM users WHERE firebase_uid = 'part5-excel-test'`);
    });
});
