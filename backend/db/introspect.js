import { dbClient } from './client.js';

async function introspect() {
    try {
        await dbClient.connect();

        const tablesRes = await dbClient.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log("=== TABLES ===");
        for (let row of tablesRes.rows) {
            console.log(`- ${row.table_name}`);
        }

        const colsRes = await dbClient.query(`
            SELECT table_name, column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, ordinal_position;
        `);

        console.log("\n=== COLUMNS ===");
        for (let row of colsRes.rows) {
            console.log(`${row.table_name}.${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
        }

        const indexesRes = await dbClient.query(`
            SELECT tablename, indexname, indexdef 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            ORDER BY tablename, indexname;
        `);

        console.log("\n=== INDEXES ===");
        for (let row of indexesRes.rows) {
            console.log(`${row.tablename}: ${row.indexname}`);
        }

        const migrationsRes = await dbClient.query(`
            SELECT id, filename, applied_at 
            FROM schema_migrations 
            ORDER BY id;
        `);

        console.log("\n=== MIGRATIONS APPLIED ===");
        for (let row of migrationsRes.rows) {
            console.log(`[${row.id}] ${row.filename} applied at ${row.applied_at}`);
        }

        process.exit(0);
    } catch (e) {
        console.error("Introspection failed:", e);
        process.exit(1);
    }
}

introspect();
