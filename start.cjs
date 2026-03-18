const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ChatGPT Interface...');

// Check if build directory exists
const buildDir = path.join(__dirname, 'dist');
const buildExists = fs.existsSync(buildDir) && 
                   fs.existsSync(path.join(buildDir, 'index.html'));

if (!buildExists) {
  console.log('📦 Build directory not found. Building React app...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

console.log('🌐 Starting server...');
try {
  // Start the server
  require('./server.cjs');
} catch (error) {
  console.error('❌ Server failed to start:', error.message);
  process.exit(1);
}
