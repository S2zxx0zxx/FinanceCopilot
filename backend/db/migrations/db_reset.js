import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function resetDB() {
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
    } finally {
        await client.end();
    }
}

resetDB();
