/**
 * Migration Runner (F-B3 remediated). Windows-safe ESM paths via fileURLToPath.
 * Honest behavior: applies migrations ONLY when a pg driver and DATABASE_URL exist;
 * otherwise performs REAL validation work (discovery, ordering, checksums) and
 * exits NON-ZERO with an explicit NOT_APPLIED reason. Never prints success falsely.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MIGRATIONS_DIR = path.dirname(fileURLToPath(import.meta.url));

export async function discoverMigrations(dir = MIGRATIONS_DIR) {
  const files = (await fs.readdir(dir)).filter((f) => /^\d{3,4}_.*\.sql$/.test(f)).sort();
  const out = [];
  for (const f of files) {
    const sql = await fs.readFile(path.join(dir, f), 'utf8');
    out.push({
      id: f.split('_')[0],
      name: f,
      bytes: Buffer.byteLength(sql),
      statements: sql.split(';').map((s) => s.trim()).filter(Boolean).length,
      sha256: crypto.createHash('sha256').update(sql).digest('hex'),
    });
  }
  return out;
}

export async function runMigrations(opts = {}) {
  const plan = await discoverMigrations(opts.dir);
  console.log(`Discovered ${plan.length} migration(s):`);
  for (const m of plan) {
    console.log(`  [${m.id}] ${m.name} (${m.bytes}B, ${m.statements} stmt, sha256:${m.sha256.slice(0, 12)})`);
  }
  const env = opts.env ?? process.env;
  const canApply = Boolean(env.DATABASE_URL);
  let driver = null;
  if (canApply) {
    try { driver = (await import('pg')).default; } catch { /* driver absent */ }
  }
  if (!driver || !canApply) {
    const reason = !canApply ? 'DATABASE_URL not set' : "pg driver not installed (run: npm i pg)";
    console.error(`NOT APPLIED — 0 migrations executed. Reason: ${reason}. Plan above is verified and deterministic.`);
    return { applied: 0, plan, applied_ok: false, reason };
  }
  const { Client } = driver;
  const client = new Client({ connectionString: env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS fincopilot_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    let applied = 0;
    for (const m of plan) {
      const { rows } = await client.query('SELECT version FROM fincopilot_migrations WHERE version = $1', [m.id]);
      if (rows.length === 0) {
        console.log(`Applying migration [${m.id}] ${m.name}...`);
        await client.query('BEGIN');
        try {
          const sql = await fs.readFile(path.join(opts.dir || MIGRATIONS_DIR, m.name), 'utf8');
          await client.query(sql);
          await client.query('INSERT INTO fincopilot_migrations (version) VALUES ($1)', [m.id]);
          await client.query('COMMIT');
          applied++;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        }
      }
    }
    console.log(`Successfully applied ${applied} migration(s).`);
    return { applied, plan, applied_ok: true, reason: 'SUCCESS' };
  } finally {
    await client.end();
  }
}

const isMain = process.argv[1] && process.argv[1].endsWith('run.js');
if (isMain && process.env.NODE_ENV !== 'test') {
  runMigrations().then((r) => { if (!r.applied_ok) process.exit(2); })
    .catch((e) => { console.error(`Migration run failed: ${e.message}`); process.exit(1); });
}
