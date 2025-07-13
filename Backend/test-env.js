const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('=== Environment Variables Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

console.log('\n=== File System Test ===');
const fs = require('fs');
const frontendPath = path.join(__dirname, '../frontend/public');
console.log('Frontend path exists:', fs.existsSync(frontendPath));
console.log('Frontend path:', frontendPath);

if (fs.existsSync(frontendPath)) {
  const files = fs.readdirSync(frontendPath);
  console.log('Frontend files:', files.slice(0, 5)); // Show first 5 files
}

console.log('\n=== Current Directory ===');
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.dirname(__dirname)); 