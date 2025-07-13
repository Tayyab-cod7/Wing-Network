const fs = require('fs');
const path = require('path');

console.log('=== Copying Frontend Files ===');

const sourceDir = path.join(__dirname, '../Frontend/public');
const targetDir = path.join(__dirname, 'public');
const imagesSourceDir = path.join(__dirname, '../Frontend/images');
const imagesTargetDir = path.join(__dirname, 'public/images');

console.log('Source directory:', sourceDir);
console.log('Target directory:', targetDir);
console.log('Images source:', imagesSourceDir);
console.log('Images target:', imagesTargetDir);

// Check if source exists
if (!fs.existsSync(sourceDir)) {
  console.error('Source directory does not exist:', sourceDir);
  process.exit(1);
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created target directory:', targetDir);
}

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesTargetDir)) {
  fs.mkdirSync(imagesTargetDir, { recursive: true });
  console.log('Created images directory:', imagesTargetDir);
}

// Function to copy directory recursively
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log('Copied:', file);
    }
  }
}

try {
  // Copy main frontend files
  copyDirectory(sourceDir, targetDir);
  console.log('Frontend files copied successfully!');
  
  // Copy images if they exist
  if (fs.existsSync(imagesSourceDir)) {
    copyDirectory(imagesSourceDir, imagesTargetDir);
    console.log('Images copied successfully!');
  } else {
    console.log('Images directory not found, skipping...');
  }
  
  // Fix image paths in HTML files
  console.log('Fixing image paths in HTML files...');
  const htmlFiles = fs.readdirSync(targetDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix relative image paths to absolute paths
    content = content.replace(/src="images\//g, 'src="/images/');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed image paths in: ${file}`);
  });
  
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
} 