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
        
        // These are the new migrations GLM Agent created. We want to run these.
        const newMigrations = [
            '0020_beta_cohort_assignments.sql',
            '022_consent_id_ext.sql'
        ];

        for (const file of files) {
            if (!file.endsWith('.sql')) continue;
            if (newMigrations.includes(file)) continue; // skip new ones so they get executed

            const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
            const { createHash } = await import('crypto');
            const checksum = createHash('sha256').update(sql).digest('hex');

            await dbClient.query(`
                INSERT INTO schema_migrations (filename, checksum) 
                VALUES ($1, $2) 
                ON CONFLICT (filename) DO UPDATE SET checksum = EXCLUDED.checksum
            `, [file, checksum]);
            
            console.log(`Marked as applied: ${file}`);
        }
        console.log("Done seeding! You can now run migrations safely.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}

seedMigrations();
