const fs = require('fs');
const path = require('path');

console.log('=== Verifying Images ===');

const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

console.log('Public directory:', publicDir);
console.log('Images directory:', imagesDir);

// Check if directories exist
console.log('\nDirectory Status:');
console.log('- Public directory exists:', fs.existsSync(publicDir));
console.log('- Images directory exists:', fs.existsSync(imagesDir));

if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  console.log('\nAvailable images:');
  images.forEach(image => {
    const imagePath = path.join(imagesDir, image);
    const stats = fs.statSync(imagePath);
    console.log(`  - ${image} (${stats.size} bytes)`);
  });
}

// Check HTML files for image references
const htmlFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).filter(file => file.endsWith('.html')) : [];

console.log('\nImage references in HTML files:');
htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find image references
  const imageRefs = content.match(/src=["']([^"']*\.(jpg|jpeg|png|gif|svg))["']/g);
  if (imageRefs) {
    console.log(`\n${file}:`);
    imageRefs.forEach(ref => {
      console.log(`  - ${ref}`);
    });
  }
});

// Test image accessibility
console.log('\nTesting image accessibility:');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  images.forEach(image => {
    const imagePath = path.join(imagesDir, image);
    const webPath = `/images/${image}`;
    console.log(`  - ${webPath} -> ${fs.existsSync(imagePath) ? '✅' : '❌'}`);
  });
}

console.log('\n=== Image Verification Complete ==='); 