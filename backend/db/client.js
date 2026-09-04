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
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false }
        });

        // Error handling on idle clients
        this.pool.on('error', (err, _client) => {
            logger.error('Unexpected error on idle database client', err);
            logger.error('[DB] Idle client error:', err);
        });
    }

    async connect() {
        const client = await this.pool.connect();
        return client;
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
