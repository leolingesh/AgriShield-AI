const express = require('express');
const router = express.Router();
const cropKnowledgeBase = require('../data/cropKnowledgeBase.json');
const CropMonitoring = require('../models/CropMonitoring');
const { isMongoConnected, fallbackStore, persistFallback } = require('../config/db');

// Seed default monitoring plots in fallback store if empty
if (fallbackStore.cropMonitoring.length === 0) {
  fallbackStore.cropMonitoring = [
    {
      _id: 'plot-1',
      id: 'plot-1',
      userId: 'guest-farmer',
      cropName: 'Tomato',
      cropId: 'tomato',
      plotName: 'North Field (Block 1)',
      location: { state: 'Tamil Nadu', district: 'Salem', village: 'Attur', latitude: 11.5977, longitude: 78.5986 },
      sowingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      growthStage: 'Flowering',
      acres: 2.0,
      currentRiskScore: 78,
      currentRiskLevel: 'HIGH',
      healthStatus: 'Needs Monitoring',
      latestThreat: 'Septoria Leaf Spot',
      lastAnalysisDate: new Date(),
      createdAt: new Date()
    },
    {
      _id: 'plot-2',
      id: 'plot-2',
      userId: 'guest-farmer',
      cropName: 'Rice (Paddy)',
      cropId: 'rice',
      plotName: 'Riverbed Basin (Plot B)',
      location: { state: 'Tamil Nadu', district: 'Thanjavur', village: 'Kumbakonam', latitude: 10.9602, longitude: 79.3845 },
      sowingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      growthStage: 'Tillering',
      acres: 3.5,
      currentRiskScore: 22,
      currentRiskLevel: 'LOW',
      healthStatus: 'Healthy',
      latestThreat: 'Low Risk',
      lastAnalysisDate: new Date(),
      createdAt: new Date()
    }
  ];
}

// GET /api/crops - List all crops in knowledge base
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: cropKnowledgeBase.crops.length,
      crops: cropKnowledgeBase.crops
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/crops/:id - Single crop knowledge
router.get('/:id', (req, res) => {
  try {
    const crop = cropKnowledgeBase.crops.find(c => c.id.toLowerCase() === req.params.id.toLowerCase());
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found in knowledge base' });
    }
    res.json({ success: true, crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/crops/monitoring/list - Get user's monitored farm plots
router.get('/monitoring/list', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const plots = await CropMonitoring.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: plots.length, plots });
    }
    res.json({ success: true, count: fallbackStore.cropMonitoring.length, plots: fallbackStore.cropMonitoring });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/crops/monitoring/add - Add new monitored plot
router.post('/monitoring/add', async (req, res) => {
  try {
    const { cropName, cropId, plotName, location, sowingDate, growthStage, acres } = req.body;
    const plotData = {
      userId: req.body.userId || 'guest-farmer',
      cropName: cropName || 'Tomato',
      cropId: cropId || 'tomato',
      plotName: plotName || 'New Plot',
      location: location || { state: 'Tamil Nadu', district: 'Salem' },
      sowingDate: sowingDate ? new Date(sowingDate) : new Date(),
      growthStage: growthStage || 'Vegetative',
      acres: Number(acres) || 1.0,
      currentRiskScore: 25,
      currentRiskLevel: 'LOW',
      healthStatus: 'Monitored',
      latestThreat: 'Routine Monitoring',
      lastAnalysisDate: new Date(),
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      const newPlot = new CropMonitoring(plotData);
      await newPlot.save();
      return res.json({ success: true, plot: newPlot });
    }

    const id = 'plot-' + Date.now();
    const fallbackPlot = { _id: id, id, ...plotData };
    fallbackStore.cropMonitoring.unshift(fallbackPlot);
    persistFallback();
    res.json({ success: true, plot: fallbackPlot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/crops/monitoring/:id - Remove monitored plot
router.delete('/monitoring/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await CropMonitoring.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Plot removed' });
    }

    fallbackStore.cropMonitoring = fallbackStore.cropMonitoring.filter(p => p._id !== id && p.id !== id);
    persistFallback();
    res.json({ success: true, message: 'Plot removed from store' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
