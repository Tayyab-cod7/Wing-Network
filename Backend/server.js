const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./src/routes/authRoutes');
const rechargeRoutes = require('./src/routes/rechargeRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const withdrawalRoutes = require('./src/routes/withdrawalRoutes');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf('*') !== -1) {
      return callback(null, true);
    }
    console.log('Origin blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  
  // Add detailed logging for login endpoint
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    console.log('Login request body:', JSON.stringify(req.body));
  }
  
  // Capture original send method
  const originalSend = res.send;
  res.send = function(body) {
    if (req.path === '/api/auth/login') {
      console.log('Login response:', body);
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MongoDB URI not found in environment variables');
      throw new Error('MongoDB URI not configured');
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process, let the server start without DB for now
    console.log('Server will start without database connection');
  }
};

connectDB();

// API health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Additional health check for Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes - must come before static files
app.use('/api/auth', authRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/earnings', require('./src/routes/earningRoutes'));
app.use('/api/contact', contactRoutes);
app.use('/api/withdrawal', withdrawalRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const receiptsDir = path.join(uploadsDir, 'receipts');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory:', uploadsDir);
}
if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
    console.log('Created receipts directory:', receiptsDir);
}

// Serve static files from uploads directory - with detailed logging
app.use('/uploads', (req, res, next) => {
    console.log('Static file request for uploads:', req.url);
    console.log('Full path:', path.join(__dirname, 'uploads', req.url));
    // Check if file exists
    const filePath = path.join(__dirname, 'uploads', req.url);
    if (fs.existsSync(filePath)) {
        console.log('File exists at path:', filePath);
    } else {
        console.log('File NOT found at path:', filePath);
    }
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Log all static file requests
app.use((req, res, next) => {
    if (req.url.startsWith('/uploads')) {
        console.log('Uploads access:', req.url);
    }
    next();
});

// Static files
const frontendPath = path.join(__dirname, '../frontend/public');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log('Serving static files from:', frontendPath);
} else {
  console.error('Frontend directory not found:', frontendPath);
}

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Serve index.html for non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend files not found'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Add more detailed error logging
  if (req.path === '/api/auth/login') {
    console.error('Login error details:', {
      message: err.message,
      name: err.name,
      code: err.code
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
});