const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const { isMongoConnected, fallbackStore, persistFallback } = require('../config/db');

// Seed default analysis in fallback store if empty
if (fallbackStore.analyses.length === 0) {
  const sihDemoData = require('../data/sihDemoData.json');
  sihDemoData.demoCases.forEach(demo => {
    fallbackStore.analyses.push({
      _id: 'seed-' + demo.id,
      id: 'seed-' + demo.id,
      userId: 'guest-farmer',
      cropId: demo.cropId,
      cropName: demo.crop,
      imageUrl: demo.image,
      growthStage: demo.growthStage,
      farmerObservations: demo.farmerObservations,
      location: demo.location,
      weatherSnapshot: demo.weather,
      aiAnalysis: demo.aiAnalysis,
      riskAssessment: demo.riskAssessment,
      recommendations: demo.recommendations,
      isDemoMode: true,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 2)
    });
  });
}

// GET /api/analyses - Get analysis history
router.get('/', async (req, res) => {
  try {
    const { crop, riskLevel, limit = 20 } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (crop) query.cropName = new RegExp(crop, 'i');
      if (riskLevel) query['riskAssessment.riskLevel'] = riskLevel.toUpperCase();

      const analyses = await Analysis.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit));
      return res.json({ success: true, count: analyses.length, analyses });
    }

    // Fallback store search & filter
    let results = [...fallbackStore.analyses];
    if (crop) {
      results = results.filter(a => a.cropName && a.cropName.toLowerCase().includes(crop.toLowerCase()));
    }
    if (riskLevel) {
      results = results.filter(a => a.riskAssessment?.riskLevel === riskLevel.toUpperCase());
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: results.length, analyses: results.slice(0, Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analyses/:id - Get single analysis details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const analysis = await Analysis.findById(id);
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Analysis record not found' });
      }
      return res.json({ success: true, analysis });
    }

    const item = fallbackStore.analyses.find(a => a._id === id || a.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Analysis record not found' });
    }
    res.json({ success: true, analysis: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/analyses/:id - Delete analysis
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Analysis.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Analysis deleted' });
    }

    fallbackStore.analyses = fallbackStore.analyses.filter(a => a._id !== id && a.id !== id);
    persistFallback();
    res.json({ success: true, message: 'Analysis removed from store' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
