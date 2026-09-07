import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbClient } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedMigrations() {
    await dbClient.connect();
    try {
        console.log("Seeding schema_migrations with existing files...");
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = await fs.readdir(migrationsDir);
        
        // Filter and sort SQL files
        const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
        
        // Ensure table exists just in case
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                checksum VARCHAR(64)
            );
        `);

        for (const file of sqlFiles) {
            // We'll just insert a dummy checksum so the migration runner skips it
            await dbClient.query(`
                INSERT INTO schema_migrations (filename, checksum) 
                VALUES ($1, $2) 
                ON CONFLICT (filename) DO UPDATE SET checksum = EXCLUDED.checksum
            `, [file, 'seeded_by_script']);
            console.log(`Marked as applied: ${file}`);
        }
        
        console.log("Done seeding! You can now run migrations safely.");
    } catch (err) {
        console.error("Error seeding:", err);
    } finally {
        process.exit(0);
    }
}

seedMigrations();
