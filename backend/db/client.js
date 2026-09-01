import pg from 'pg';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

/**
 * PostgreSQL Database Client
 * 
 * Establishes a secure connection pool to the database.
 * No Fake Success: If it can't connect, it will crash the app.
 */

class DatabaseClient {
    constructor() {
        if (!config.db.url) {
            throw new Error('DATABASE_URL is strictly required.');
        }

        this.pool = new Pool({
            connectionString: config.db.url,
            ssl: { rejectUnauthorized: false }
        });

        // Error handling on idle clients
        this.pool.on('error', (err, _client) => {
            logger.error('Unexpected error on idle database client', err);
            process.exit(-1);
        });
    }

    async connect() {
        try {
            const client = await this.pool.connect();
            logger.info('[DB] Secure connection established to PostgreSQL.');
            client.release();
            return true;
        } catch (error) {
            logger.error('[DB] CRITICAL: Failed to connect to PostgreSQL.', error);
            process.exit(1);
        }
    }

    async query(text, params) {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        logger.info(`[DB] Executed Query`, { text, duration, rows: res.rowCount });
        return res;
    }
}

export const dbClient = new DatabaseClient();
