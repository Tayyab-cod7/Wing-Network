const fs = require('fs');
const path = require('path');

console.log('=== File Path Test ===');

const testPaths = [
  path.join(__dirname, '../frontend/public'),
  path.join(__dirname, '../Frontend/public'),
  path.join(__dirname, 'public'),
  path.join(__dirname, '../public'),
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'public/index.html')
];

console.log('Current directory:', __dirname);
console.log('Parent directory:', path.dirname(__dirname));

console.log('\n=== Testing Paths ===');
for (const testPath of testPaths) {
  const exists = fs.existsSync(testPath);
  console.log(`${exists ? '✓' : '✗'} ${testPath}`);
  
  if (exists && fs.statSync(testPath).isDirectory()) {
    try {
      const files = fs.readdirSync(testPath);
      console.log(`  Files in directory: ${files.length} files`);
      if (files.length > 0) {
        console.log(`  Sample files: ${files.slice(0, 3).join(', ')}`);
      }
    } catch (error) {
      console.log(`  Error reading directory: ${error.message}`);
    }
  }
}

console.log('\n=== Environment ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('Working directory:', process.cwd()); 