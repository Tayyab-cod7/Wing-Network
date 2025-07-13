const express = require('express');
const app = express();

console.log('=== Startup Test ===');
console.log('Express version:', require('express/package.json').version);
console.log('Node version:', process.version);
console.log('Port:', process.env.PORT || 5000);
console.log('Environment:', process.env.NODE_ENV);

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Startup test successful!',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
  console.log(`✅ Health endpoint: http://localhost:${PORT}/health`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
}); 