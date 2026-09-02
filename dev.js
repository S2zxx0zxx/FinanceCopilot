/* global process, console */
import { spawn } from 'node:child_process';

function runProcess(name, args, cwd, color) {
  // Use current Node executable directly to avoid PATH/shell issues completely
  const child = spawn(process.execPath, args, { 
    cwd, 
    stdio: 'pipe' 
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`\x1b[${color}m[${name}]\x1b[0m ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[${color}m[${name}]\x1b[0m ${data}`);
  });

  child.on('error', (err) => {
    console.error(`\x1b[31m[${name}] Failed to start:\x1b[0m`, err);
  });

  child.on('close', (code) => {
    console.log(`\x1b[${color}m[${name}]\x1b[0m Exited with code ${code}`);
  });
}

console.log("Starting all Fincopilot servers directly via Node...");

// Start Backend
runProcess('BACKEND', ['--watch', 'server.js'], './backend', '34'); // Blue

// Start Frontend
runProcess('FRONTEND', ['./node_modules/next/dist/bin/next', 'dev', '-p', '3000'], './frontend', '32'); // Green

// Start Landing
runProcess('LANDING', ['./node_modules/next/dist/bin/next', 'dev', '-p', '3002'], './fincopilot-landing', '35'); // Magenta
