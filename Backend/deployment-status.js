const fs = require('fs');
const path = require('path');

console.log('=== Deployment Status Check ===');

// Check environment
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Check file structure
console.log('\nFile Structure:');
const currentDir = __dirname;
console.log('- Current directory:', currentDir);
console.log('- Backend directory exists:', fs.existsSync(currentDir));
console.log('- server.js exists:', fs.existsSync(path.join(currentDir, 'server.js')));
console.log('- package.json exists:', fs.existsSync(path.join(currentDir, 'package.json')));

// Check frontend files
const frontendPaths = [
  path.join(currentDir, '../frontend/public'),
  path.join(currentDir, '../Frontend/public'),
  path.join(currentDir, 'public'),
  path.join(currentDir, '../public')
];

console.log('\nFrontend Paths:');
for (const testPath of frontendPaths) {
  const exists = fs.existsSync(testPath);
  console.log(`- ${testPath}: ${exists ? '✓' : '✗'}`);
  if (exists) {
    try {
      const files = fs.readdirSync(testPath);
      console.log(`  Files: ${files.length}`);
      if (files.includes('index.html')) {
        console.log('  ✓ index.html found');
      }
    } catch (error) {
      console.log(`  Error reading: ${error.message}`);
    }
  }
}

// Check dependencies
console.log('\nDependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'));
  console.log('- Dependencies count:', Object.keys(packageJson.dependencies || {}).length);
  console.log('- Dev dependencies count:', Object.keys(packageJson.devDependencies || {}).length);
} catch (error) {
  console.log('- Error reading package.json:', error.message);
}

console.log('\n=== Status Check Complete ==='); 