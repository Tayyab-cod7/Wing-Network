const fs = require('fs');
const path = require('path');

console.log('=== Copying Frontend Files ===');

const sourceDir = path.join(__dirname, '../Frontend/public');
const targetDir = path.join(__dirname, 'public');

console.log('Source directory:', sourceDir);
console.log('Target directory:', targetDir);

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
  copyDirectory(sourceDir, targetDir);
  console.log('Frontend files copied successfully!');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
} 