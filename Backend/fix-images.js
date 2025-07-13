const fs = require('fs');
const path = require('path');

console.log('=== Fixing Image References ===');

const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created images directory:', imagesDir);
}

// List of required images based on HTML references
const requiredImages = [
  'Favicon.jpg',
  'Dream.jpg',
  'wing-system-og.jpg',
  'wing-system-withdrawal-og.jpg',
  'wing-system-withdraw-og.jpg',
  'wing-system-referral-og.jpg',
  'wing-system-recharge-og.jpg',
  'wing-system-profile-og.jpg',
  'wing-system-pro-og.jpg',
  'wing-system-premium-og.jpg',
  'wing-system-earn-og.jpg',
  'wing-system-contact-og.jpg',
  'wing-system-contact-admin-og.jpg',
  'wing-system-basic-og.jpg',
  'wing-system-admin-og.jpg',
  'wing-system-about-og.jpg',
  'logo.png',
  'favicon-16x16.png',
  'apple-touch-icon.png'
];

console.log('Required images:', requiredImages);

// Check which images exist
const existingImages = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
console.log('Existing images:', existingImages);

// Copy existing images from Frontend/images if they exist
const frontendImagesDir = path.join(__dirname, '../Frontend/images');
if (fs.existsSync(frontendImagesDir)) {
  const frontendImages = fs.readdirSync(frontendImagesDir);
  console.log('Frontend images found:', frontendImages);
  
  frontendImages.forEach(image => {
    const sourcePath = path.join(frontendImagesDir, image);
    const targetPath = path.join(imagesDir, image);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied: ${image}`);
  });
}

// Create a simple HTML file to show missing images
let missingImages = [];
requiredImages.forEach(image => {
  const imagePath = path.join(imagesDir, image);
  if (!fs.existsSync(imagePath)) {
    missingImages.push(image);
  }
});

if (missingImages.length > 0) {
  console.log('\n⚠️ Missing images:');
  missingImages.forEach(image => {
    console.log(`  - ${image}`);
  });
  
  // Create a simple placeholder for missing images
  console.log('\nCreating placeholder images...');
  missingImages.forEach(image => {
    const imagePath = path.join(imagesDir, image);
    
    // For now, just copy existing images as placeholders
    if (image.endsWith('.jpg') && fs.existsSync(path.join(imagesDir, 'Dream.jpg'))) {
      fs.copyFileSync(path.join(imagesDir, 'Dream.jpg'), imagePath);
      console.log(`✅ Created placeholder: ${image}`);
    } else if (image.endsWith('.png') && fs.existsSync(path.join(imagesDir, 'Favicon.jpg'))) {
      // For PNG files, we'll just note they're missing
      console.log(`⚠️ PNG placeholder needed: ${image}`);
    }
  });
}

console.log('\n=== Image Fix Complete ===');
console.log('Images directory:', imagesDir);
console.log('Available images:', fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : 'None'); 