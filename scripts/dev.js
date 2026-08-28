const { spawn } = require('child_process');
const path = require('path');

console.log('🌾 Starting AgriShield AI Full-Stack Platform...');

const nodePath = process.execPath;
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// 1. Start backend server
const serverProcess = spawn(nodePath, ['server.js'], {
  cwd: path.join(__dirname, '..', 'server'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

// 2. Start frontend Vite dev server
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'client'),
  stdio: 'inherit',
  env: { ...process.env },
  shell: true
});

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
