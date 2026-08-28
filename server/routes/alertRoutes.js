const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { isMongoConnected, fallbackStore, persistFallback } = require('../config/db');

// Seed sample alerts in fallback store if empty
if (fallbackStore.alerts.length === 0) {
  fallbackStore.alerts = [
    {
      _id: 'alt-1',
      id: 'alt-1',
      title: '⚠️ HIGH PEST RISK: Tomato (Septoria Leaf Spot)',
      cropName: 'Tomato',
      cropId: 'tomato',
      threatName: 'Septoria Leaf Spot',
      severity: 'HIGH',
      location: { state: 'Tamil Nadu', district: 'Salem' },
      triggerReason: 'Persistent 84% humidity and 14.2 mm rainfall in Salem creates high risk of lower leaf defoliation.',
      recommendedAction: 'Inspect bottom foliage within 24-48 hours. Prune diseased leaves and avoid sprinkler irrigation.',
      isRead: false,
      createdAt: new Date()
    },
    {
      _id: 'alt-2',
      id: 'alt-2',
      title: '🚨 CRITICAL ADVISORY: Rice (Rice Blast Warning)',
      cropName: 'Rice (Paddy)',
      cropId: 'rice',
      threatName: 'Rice Blast',
      severity: 'CRITICAL',
      location: { state: 'Tamil Nadu', district: 'Thanjavur' },
      triggerReason: 'Heavy cloud cover and 91% relative humidity creates critical leaf and neck blast epidemic conditions.',
      recommendedAction: 'Withhold excess urea top dressing. Apply prophylactic bio-agent Pseudomonas fluorescens.',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000)
    }
  ];
}

// GET /api/alerts - Get active advisory alerts
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, count: alerts.length, alerts });
    }

    res.json({ success: true, count: fallbackStore.alerts.length, alerts: fallbackStore.alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/alerts/:id/read - Mark alert as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const updated = await Alert.findByIdAndUpdate(id, { isRead: true }, { new: true });
      return res.json({ success: true, alert: updated });
    }

    const alert = fallbackStore.alerts.find(a => a._id === id || a.id === id);
    if (alert) alert.isRead = true;
    persistFallback();
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
