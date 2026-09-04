import pg from 'pg';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function resetDB() {
    // Production guard — refuse to wipe any non-dev/staging DB. Prevents catastrophic accidents.
    if (process.env.NODE_ENV === 'production') {
        console.error('REFUSING to reset database in production (NODE_ENV=production). Aborting.');
        process.exit(1);
    }
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not set in .env!");
        process.exit(1);
    }
    
    console.log("Connecting to database...");
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    
    try {
        await client.connect();
        console.log("Dropping all existing tables in public schema...");
        await client.query('DROP SCHEMA public CASCADE;');
        await client.query('CREATE SCHEMA public;');
        console.log("✅ Database reset complete. Clean slate ready for migrations.");
    } catch (e) {
        console.error("Error resetting database:", e.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

resetDB();
