const express = require('express');
const router = express.Router();
const { calculateCropRisk } = require('../services/riskEngine');
const { getWeatherData } = require('../services/weatherService');
const { generateEarlyWarningAlert } = require('../services/notificationService');

// POST /api/risk/predict - Calculate early risk before visible damage
router.post('/predict', async (req, res) => {
  try {
    const { cropId, cropName, location, weather: inputWeather, growthStage, farmerObservations } = req.body;

    let weather = inputWeather;
    if (!weather && location?.lat && location?.lng) {
      weather = await getWeatherData(location.lat, location.lng);
    }

    const riskResult = calculateCropRisk({
      cropId,
      weather: weather || { temperature: 28, humidity: 78, rainfall: 0, windSpeed: 6 },
      location: location || { state: 'Tamil Nadu', district: 'Salem' },
      growthStage: growthStage || 'Vegetative',
      farmerObservations: farmerObservations || ''
    });

    // If risk is High/Critical, trigger early warning advisory alert
    if (riskResult.riskLevel === 'HIGH' || riskResult.riskLevel === 'CRITICAL') {
      await generateEarlyWarningAlert({
        cropName: cropName || riskResult.cropName,
        cropId: cropId || riskResult.cropId,
        threatName: riskResult.predictedThreat,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        location,
        whyRiskExists: riskResult.whyRiskExists,
        recommendedAction: riskResult.recommendations.immediateActions[0]
      });
    }

    res.json({
      success: true,
      crop: riskResult.cropName,
      cropId: riskResult.cropId,
      riskAssessment: riskResult,
      weather: weather || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Risk calculation failed', error: err.message });
  }
});

module.exports = router;
