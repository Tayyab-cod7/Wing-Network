const fs = require('fs');
const path = require('path');

console.log('=== Creating Favicon ===');

const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create a simple SVG favicon
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#6366f1"/>
  <text x="16" y="20" font-family="Arial" font-size="16" fill="white" text-anchor="middle">W</text>
</svg>`;

// Create a simple HTML favicon page
const faviconHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Favicon</title>
</head>
<body>
  <h1>Wing System Favicon</h1>
  <p>This is a placeholder favicon for the Wing System.</p>
</body>
</html>`;

// Write favicon files
const faviconPath = path.join(publicDir, 'favicon.ico');
const faviconHtmlPath = path.join(publicDir, 'favicon.html');

try {
  // For now, just create a simple HTML file as favicon
  fs.writeFileSync(faviconHtmlPath, faviconHtml);
  console.log('✅ Created favicon.html');
  
  // Copy existing Favicon.jpg if it exists
  const sourceFavicon = path.join(__dirname, '../Frontend/images/Favicon.jpg');
  const targetFavicon = path.join(imagesDir, 'Favicon.jpg');
  
  if (fs.existsSync(sourceFavicon)) {
    fs.copyFileSync(sourceFavicon, targetFavicon);
    console.log('✅ Copied Favicon.jpg');
  } else {
    console.log('⚠️ Favicon.jpg not found in source');
  }
  
  // Create placeholder PNG files
  const pngFiles = ['favicon-16x16.png', 'apple-touch-icon.png', 'logo.png'];
  pngFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    if (!fs.existsSync(filePath)) {
      // Create a simple placeholder by copying existing image
      const existingImage = path.join(imagesDir, 'Favicon.jpg');
      if (fs.existsSync(existingImage)) {
        fs.copyFileSync(existingImage, filePath);
        console.log(`✅ Created placeholder: ${file}`);
      } else {
        console.log(`⚠️ Could not create placeholder: ${file}`);
      }
    }
  });
  
} catch (error) {
  console.error('Error creating favicon:', error);
}

console.log('=== Favicon Creation Complete ==='); 