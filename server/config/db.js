const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const os = require('os');
const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel ? path.join(os.tmpdir(), 'agrishield_data') : path.join(__dirname, '..', 'data_store');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (e) {
  console.warn('Using in-memory fallback store on serverless environment');
}

let isMongoConnected = false;

// Simple file-backed fallback store for seamless zero-setup operation
const fallbackStore = {
  users: [],
  analyses: [],
  crops: [],
  cropMonitoring: [],
  alerts: []
};

// Load existing fallback data if present
const fallbackFile = path.join(dataDir, 'local_db.json');
if (fs.existsSync(fallbackFile)) {
  try {
    const raw = fs.readFileSync(fallbackFile, 'utf8');
    const parsed = JSON.parse(raw);
    Object.assign(fallbackStore, parsed);
  } catch (e) {
    console.warn('Failed to parse local_db.json, starting fresh fallback store');
  }
}

function persistFallback() {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local_db.json fallback:', err.message);
  }
}

async function connectDB() {
  try {
    // Attempt Mongoose connection with a short timeout
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully to:', config.MONGODB_URI);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using high-performance Local Resilient Data Store for SIH demo.`);
  }
}

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  fallbackStore,
  persistFallback
};
