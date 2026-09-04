import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function test() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query('INSERT INTO users (clerk_uid, firebase_uid) VALUES ($1, $1) RETURNING user_id', ['test_clerk_id_123']);
    console.log("Success:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.query("DELETE FROM users WHERE clerk_uid = 'test_clerk_id_123'");
    await client.end();
  }
}
test();
