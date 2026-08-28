const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const FASTAPI_URL = process.env.FASTAPI_AI_URL || 'http://127.0.0.1:8000';

/**
 * Calls local Python FastAPI inference service for crop disease classification.
 * 
 * @param {string|Buffer} imageInput - Path to image file or Buffer
 * @param {string} filename - Original image filename
 * @param {string} expectedCrop - Expected crop identifier ('tomato', 'rice', 'wheat')
 * @returns {Promise<Object>} Structured classification prediction
 */
async function classifyImage(imageInput, filename = 'leaf.jpg', expectedCrop = 'tomato') {
  try {
    const form = new FormData();
    
    if (typeof imageInput === 'string' && fs.existsSync(imageInput)) {
      form.append('image', fs.createReadStream(imageInput), { filename });
    } else if (Buffer.isBuffer(imageInput)) {
      form.append('image', imageInput, { filename });
    } else {
      throw new Error('Invalid image input format');
    }

    if (expectedCrop) {
      form.append('expectedCrop', expectedCrop.toLowerCase());
    }

    const response = await axios.post(`${FASTAPI_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 10000
    });

    return response.data;
  } catch (err) {
    console.warn('[DiseaseClassifierClient] Local PyTorch FastAPI service call failed or unavailable:', err.message);
    return {
      supported: false,
      crop: expectedCrop || 'unknown',
      condition: 'service_offline',
      conditionType: 'unknown',
      confidence: 0.0,
      message: 'Local PyTorch AI service is initializing or unreachable.'
    };
  }
}

/**
 * Fetches current model manifest telemetry from Python FastAPI AI service.
 */
async function getModelTelemetry() {
  try {
    const res = await axios.get(`${FASTAPI_URL}/model-status`, { timeout: 3000 });
    return res.data;
  } catch (err) {
    return {
      name: 'AgriShield Vision v1.0',
      status: 'offline',
      supportedCrops: ['tomato', 'rice', 'wheat'],
      testAccuracy: 0.8333
    };
  }
}

module.exports = {
  classifyImage,
  getModelTelemetry
};
