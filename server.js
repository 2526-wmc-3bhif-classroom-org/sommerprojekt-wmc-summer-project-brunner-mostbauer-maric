#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');

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
