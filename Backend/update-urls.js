const fs = require('fs');
const path = require('path');

console.log('=== Updating URLs for Railway Deployment ===');

const frontendPath = path.join(__dirname, '../Frontend/public');
const htmlFiles = fs.readdirSync(frontendPath).filter(file => file.endsWith('.html'));

let updatedFiles = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(frontendPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Update localhost:5000 references to dynamic URLs
    const patterns = [
        {
            from: /http:\/\/localhost:5000/g,
            to: 'https://wing-network-production.up.railway.app'
        },
        {
            from: /content="http:\/\/localhost:5000/g,
            to: 'content="https://wing-network-production.up.railway.app'
        },
        {
            from: /href="http:\/\/localhost:5000/g,
            to: 'href="https://wing-network-production.up.railway.app'
        }
    ];

    patterns.forEach(pattern => {
        if (pattern.from.test(content)) {
            content = content.replace(pattern.from, pattern.to);
            hasChanges = true;
        }
    });

    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
        updatedFiles++;
    }
});

console.log(`\n=== URL Update Complete ===`);
console.log(`Updated ${updatedFiles} files`);
console.log('All localhost:5000 references have been updated for Railway deployment'); 