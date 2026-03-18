// Script to start the application with Convex
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🚀 Starting Icon Messages with Convex...');

// Start the Convex development server
const convexProcess = spawn('npx', ['convex', 'dev'], {
  stdio: 'pipe',
  shell: true,
});

// Log Convex output
convexProcess.stdout.on('data', (data) => {
  console.log(`Convex: ${data.toString().trim()}`);
});

convexProcess.stderr.on('data', (data) => {
  console.error(`Convex Error: ${data.toString().trim()}`);
});

// Give Convex a moment to start up
setTimeout(() => {
  console.log('🌐 Starting web server...');
  
  // Start the React development server
  const serverProcess = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
    },
  });

  // Handle server process exit
  serverProcess.on('close', (code) => {
    console.log(`Web server exited with code ${code}`);
    // Kill the Convex process when the server exits
    convexProcess.kill();
    process.exit(code);
  });
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  convexProcess.kill();
  process.exit(0);
});
