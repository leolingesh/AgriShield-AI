require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrishield_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'agrishield_ai_sih_secret_2026_super_secure',
  
  // AI Service Config
  AI_PROVIDER: process.env.AI_PROVIDER || 'demo',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_API_URL: process.env.AI_API_URL || '',
  AI_MODEL: process.env.AI_MODEL || 'qwen-vl-max',

  // Weather Service Config
  WEATHER_PROVIDER: process.env.WEATHER_PROVIDER || 'open-meteo',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',

  // Client URL for CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Agronomic Risk Thresholds (Configurable)
  RISK_THRESHOLDS: {
    LOW_MAX: 30,
    MEDIUM_MAX: 60,
    HIGH_MAX: 80,
    CRITICAL_MAX: 100
  },

  // Cache duration in milliseconds (15 mins for weather)
  WEATHER_CACHE_TTL_MS: 15 * 60 * 1000
};
