import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startProcess(name, command, args, cwd) {
    const proc = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'pipe'
    });

    proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(l => l.trim().length > 0);
        lines.forEach(line => console.log(`[${name}] ${line}`));
    });

    proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(l => l.trim().length > 0);
        lines.forEach(line => console.error(`[${name}] ${line}`));
    });

    proc.on('close', (code) => {
        console.log(`[${name}] Exited with code ${code}`);
    });

    return proc;
}

console.log('Preparing FinCopilot local environment...');
console.log('[MIGRATIONS] Applying pending database migrations before services start.');

// Local `dev:all` must never boot application code against a stale schema.
// The migration runner is checksum-tracked, transaction-safe and guarded by a
// PostgreSQL advisory lock, so re-running it here is safe and deterministic.
const migration = spawnSync('npm', ['run', 'migrate'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
});

if (migration.error) {
    console.error('[MIGRATIONS] Failed to launch migration runner:', migration.error.message);
    process.exit(1);
}

if (migration.status !== 0) {
    console.error(`[MIGRATIONS] Migration runner exited with code ${migration.status}. Services were not started.`);
    process.exit(migration.status || 1);
}

console.log('[MIGRATIONS] Database schema is ready.');
console.log('Starting all FinCopilot services...');

// Backend
startProcess('BACKEND', 'node', ['--env-file=.env', 'backend/server.js'], __dirname);

// Frontend
startProcess('FRONTEND', 'npm', ['run', 'dev'], path.join(__dirname, 'frontend'));

// Landing
startProcess('LANDING', 'npm', ['run', 'dev'], path.join(__dirname, 'fincopilot-landing'));

process.on('SIGINT', () => {
    console.log('Shutting down all services...');
    process.exit(0);
});
