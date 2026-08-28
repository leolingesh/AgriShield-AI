const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const { connectDB } = require('./config/db');

// Import routes
const locationRoutes = require('./routes/locationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const riskRoutes = require('./routes/riskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cropRoutes = require('./routes/cropRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AgriShield AI - Early Crop Pest Detection & Prevention Platform',
    version: '1.0.0',
    sihMode: 'Active',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/location', locationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/analyze', aiRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
async function startServer() {
  await connectDB();
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌾 AgriShield AI Server is running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   SIH Demo Mode: Active & Ready`);
    console.log(`====================================================`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
