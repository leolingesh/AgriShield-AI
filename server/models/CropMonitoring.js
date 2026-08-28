const mongoose = require('mongoose');

const CropMonitoringSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest-farmer' },
  cropName: { type: String, required: true },
  cropId: { type: String, required: true },
  plotName: { type: String, default: 'Plot A' },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  sowingDate: { type: Date, default: Date.now },
  growthStage: { 
    type: String, 
    enum: ['Seedling', 'Nursery', 'Vegetative', 'Tillering', 'Flowering', 'Fruiting', 'Boll Development', 'Ripening', 'Maturity'],
    default: 'Vegetative' 
  },
  acres: { type: Number, default: 1.0 },
  currentRiskScore: { type: Number, default: 25 },
  currentRiskLevel: { type: String, default: 'LOW' },
  healthStatus: { type: String, default: 'Healthy' },
  latestThreat: { type: String, default: 'None reported' },
  lastAnalysisDate: { type: Date, default: Date.now },
  historyLogs: [{
    date: { type: Date, default: Date.now },
    riskScore: { type: Number },
    riskLevel: { type: String },
    notes: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CropMonitoring || mongoose.model('CropMonitoring', CropMonitoringSchema);
