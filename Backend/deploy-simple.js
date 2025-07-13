const fs = require('fs');
const path = require('path');

console.log('=== Simple Deployment Script ===');

// Step 1: Copy frontend files
console.log('\n1. Copying frontend files...');
const sourceDir = path.join(__dirname, '../Frontend/public');
const targetDir = path.join(__dirname, 'public');
const imagesSourceDir = path.join(__dirname, '../Frontend/images');
const imagesTargetDir = path.join(__dirname, 'public/images');

// Create directories
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(imagesTargetDir)) {
  fs.mkdirSync(imagesTargetDir, { recursive: true });
}

// Copy files
function copyFiles(source, target) {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      copyFiles(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  Copied: ${file}`);
    }
  });
}

copyFiles(sourceDir, targetDir);
console.log('✅ Frontend files copied');

// Copy images
if (fs.existsSync(imagesSourceDir)) {
  copyFiles(imagesSourceDir, imagesTargetDir);
  console.log('✅ Images copied');
}

// Step 2: Fix image paths
console.log('\n2. Fixing image paths...');
const htmlFiles = fs.readdirSync(targetDir).filter(file => file.endsWith('.html'));
htmlFiles.forEach(file => {
  const filePath = path.join(targetDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/src="images\//g, 'src="/images/');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Fixed: ${file}`);
});
console.log('✅ Image paths fixed');

// Step 3: Verify everything
console.log('\n3. Verifying deployment...');
console.log(`- Public directory: ${fs.existsSync(targetDir) ? '✅' : '❌'}`);
console.log(`- Images directory: ${fs.existsSync(imagesTargetDir) ? '✅' : '❌'}`);

if (fs.existsSync(imagesTargetDir)) {
  const images = fs.readdirSync(imagesTargetDir);
  console.log(`- Available images: ${images.join(', ')}`);
}

console.log('\n=== Deployment Complete ===');
console.log('Ready to start server...'); 