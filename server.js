#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the backend from the backend directory
const backendPath = join(__dirname, 'backend');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const proc = spawn(npm, ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

proc.on('exit', (code) => {
  process.exit(code);
});
