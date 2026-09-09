import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dbClient } from './client.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration Runner Script
 * 
 * Strictly tracks and applies migrations. Executes REAL SQL.
 */
export async function runMigrations(database = dbClient) {
    logger.info('[MIGRATION] Starting migration process...');
    
    const client = await database.connect();
    let locked = false;

    try {
        await client.query('SELECT pg_advisory_lock($1)', [73492108]);
        locked = true;
        // Create migration tracking table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add checksum column if it doesn't exist (idempotent upgrade)
        await client.query(`
            ALTER TABLE schema_migrations 
            ADD COLUMN IF NOT EXISTS checksum VARCHAR(64);
        `);

        const migrationsDir = path.join(__dirname, 'migrations');
        const files = await fs.readdir(migrationsDir);
        
        // Strict parsing: extract canonical version prefix (e.g. "001", "006b", "0020")
        const parsedFiles = files
            .filter(f => f.endsWith('.sql'))
            .map(f => {
                const match = f.match(/^(\d+)([a-z]*)_(.+)\.sql$/);
                if (!match) throw new Error(`[MIGRATION] Invalid filename format: ${f}. Must match ^\\d+[a-z]*_.*\\.sql$`);
                return {
                    filename: f,
                    numPart: parseInt(match[1], 10),
                    alphaPart: match[2] || ''
                };
            })
            .sort((a, b) => {
                if (a.numPart !== b.numPart) return a.numPart - b.numPart;
                return a.alphaPart.localeCompare(b.alphaPart);
            });

        for (const { filename } of parsedFiles) {
            const filePath = path.join(migrationsDir, filename);
            const sql = await fs.readFile(filePath, 'utf8');
            
            // Calculate SHA-256 checksum
            const { createHash } = await import('crypto');
            const checksum = createHash('sha256').update(sql).digest('hex');

            // Check if already applied
            const { rowCount, rows } = await client.query(
                'SELECT id, checksum FROM schema_migrations WHERE filename = $1',
                [filename]
            );

            if (rowCount > 0) {
                if (rows[0].checksum && rows[0].checksum !== checksum) {
                    throw new Error(`[MIGRATION] CRITICAL: Checksum mismatch for ${filename}. Expected ${rows[0].checksum}, got ${checksum}.`);
                }
                logger.info(`[MIGRATION] Skipped (already applied): ${filename}`);
                continue;
            }

            logger.info(`[MIGRATION] Applying: ${filename} (Checksum: ${checksum.substring(0, 8)})...`);
            
            // FIX (audit P0 #13): the old code called `dbClient.query('BEGIN')`
            // then `dbClient.query(sql)` then `dbClient.query('INSERT ...')` then
            // `dbClient.query('COMMIT')`. Each `dbClient.query(...)` checks out
            // a DIFFERENT connection from the pool, so the COMMIT/ROLLBACK was
            // operating on a different connection than the BEGIN — the migration
            // SQL and the schema_migrations INSERT were NOT atomic. A crash
            // between the two would mark the migration as unapplied while the
            // schema change was already live. We now check out a single client
            // and run BEGIN / SQL / INSERT / COMMIT on it explicitly.
            try {
                await client.query('BEGIN');
                await client.query(sql);
                await client.query(
                    'INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)',
                    [filename, checksum]
                );
                await client.query('COMMIT');
                logger.info(`[MIGRATION] Successfully applied: ${filename}`);
            } catch (err) {
                try { await client.query('ROLLBACK'); } catch { /* ignore rollback failures */ }
                throw err;
            }
        }
        
        logger.info('[MIGRATION] All migrations applied successfully.');
    } catch (error) {
        logger.error('[MIGRATION] CRITICAL FAILURE:', error);
        throw error;
    } finally {
        try {
            if (locked) await client.query('SELECT pg_advisory_unlock($1)', [73492108]);
        } finally {
            client.release();
        }
    }
}

// Execute if run directly (compare normalized paths — works across ESM URL/path formats)
const invokedDirectly = (() => {
    try {
        const argvUrl = pathToFileURL(process.argv[1]).href;
        const moduleUrl = import.meta.url;
        return argvUrl === moduleUrl;
    } catch {
        return process.argv[1] === __filename;
    }
})();
if (invokedDirectly) {
    runMigrations().catch(() => { process.exitCode = 1; }).finally(() => dbClient.pool.end());
}
