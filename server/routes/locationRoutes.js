const express = require('express');
const router = express.Router();
const { getStatesAndDistricts, reverseGeocode } = require('../services/locationService');

// GET /api/location/states - Get all Indian states & districts
router.get('/states', (req, res) => {
  try {
    const states = getStatesAndDistricts();
    res.json({ success: true, count: states.length, states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/location/reverse-geocode - Reverse geocode GPS coordinates
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
    }

    const location = await reverseGeocode(lat, lng);
    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
