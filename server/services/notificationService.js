const Alert = require('../models/Alert');
const { isMongoConnected, fallbackStore, persistFallback } = require('../config/db');

/**
 * Generate Early Warning Alert when risk crosses threshold
 */
async function generateEarlyWarningAlert({
  cropName,
  cropId,
  threatName,
  riskScore,
  riskLevel,
  location,
  whyRiskExists,
  recommendedAction
}) {
  if (riskLevel !== 'HIGH' && riskLevel !== 'CRITICAL') {
    return null;
  }

  const alertData = {
    title: `⚠️ ${riskLevel} PEST RISK: ${cropName} (${threatName})`,
    cropName,
    cropId: cropId || 'crop',
    threatName,
    severity: riskLevel,
    location: {
      state: location?.state || '',
      district: location?.district || '',
      village: location?.village || '',
      latitude: location?.lat || location?.latitude,
      longitude: location?.lng || location?.longitude
    },
    triggerReason: whyRiskExists || `Elevated environmental risk (${riskScore}%) detected for ${threatName}.`,
    recommendedAction: recommendedAction || 'Inspect lower leaves immediately and apply bio-protective IPM procedure.',
    validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days validity
    createdAt: new Date(),
    isRead: false
  };

  try {
    if (isMongoConnected()) {
      const alert = new Alert(alertData);
      await alert.save();
      return alert;
    }
  } catch (err) {
    console.warn('MongoDB alert save failed, writing to fallback store:', err.message);
  }

  // Fallback store
  const id = 'alt-' + Date.now();
  const fallbackAlert = { _id: id, id, ...alertData };
  fallbackStore.alerts.unshift(fallbackAlert);
  if (fallbackStore.alerts.length > 50) fallbackStore.alerts.pop();
  persistFallback();
  return fallbackAlert;
}

module.exports = {
  generateEarlyWarningAlert
};
