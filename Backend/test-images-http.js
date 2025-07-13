const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Test endpoint
app.get('/test', (req, res) => {
  const imagesPath = path.join(__dirname, 'public/images');
  const images = fs.existsSync(imagesPath) ? fs.readdirSync(imagesPath) : [];
  
  res.json({
    message: 'Image test server',
    imagesPath: imagesPath,
    availableImages: images,
    testUrls: [
      `http://localhost:${PORT}/images/Dream.jpg`,
      `http://localhost:${PORT}/images/Favicon.jpg`
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`Image test: http://localhost:${PORT}/images/Dream.jpg`);
}); 