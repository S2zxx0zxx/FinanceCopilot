import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startProcess(name, command, args, cwd) {
    const proc = spawn(command, args, {
        cwd: cwd,
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

console.log("Starting all FinCopilot services...");

// Backend
startProcess('BACKEND', 'node', ['--env-file=.env', 'backend/server.js'], __dirname);

// Frontend
startProcess('FRONTEND', 'npm', ['run', 'dev'], path.join(__dirname, 'frontend'));

// Landing
startProcess('LANDING', 'npm', ['run', 'dev'], path.join(__dirname, 'fincopilot-landing'));

process.on('SIGINT', () => {
    console.log("Shutting down all services...");
    process.exit(0);
});
