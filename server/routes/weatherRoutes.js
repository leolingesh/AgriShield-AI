const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../services/weatherService');

// GET /api/weather?lat=...&lng=...
router.get('/', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 11.6643;
    const lng = req.query.lng ? parseFloat(req.query.lng) : 78.1460;

    const weather = await getWeatherData(lat, lng);
    res.json({ success: true, weather });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Weather service temporarily unavailable', error: err.message });
  }
});

module.exports = router;
