const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest-farmer' },
  cropId: { type: String, required: true },
  cropName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  growthStage: { type: String, default: 'Vegetative' },
  farmerObservations: { type: String, default: '' },
  
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number }
  },

  weatherSnapshot: {
    temperature: { type: Number },
    humidity: { type: Number },
    rainfall: { type: Number },
    windSpeed: { type: Number },
    condition: { type: String },
    timestamp: { type: Date, default: Date.now }
  },

  aiAnalysis: {
    condition: { type: String, required: true },
    classification: { type: String, default: 'unknown' },
    pathogen: { type: String, default: '' },
    confidence: { type: Number, min: 0, max: 1, default: 0.85 },
    confidenceRating: { type: String, default: 'Medium Confidence' },
    severity: { type: String, default: 'Moderate' },
    severityScore: { type: Number, default: 50 },
    affectedArea: { type: String, default: '15-20%' },
    visualSymptoms: [{ type: String }],
    possibleCauses: [{ type: String }],
    isExpertVerificationRecommended: { type: Boolean, default: false }
  },

  riskAssessment: {
    riskScore: { type: Number, min: 0, max: 100, required: true },
    riskLevel: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
      default: 'MEDIUM' 
    },
    predictedThreat: { type: String, default: '' },
    contributingFactors: [{
      factor: { type: String },
      impact: { type: String },
      weight: { type: String },
      detail: { type: String }
    }],
    whyRiskExists: { type: String, default: '' }
  },

  recommendations: {
    immediateActions: [{ type: String }],
    prevention: [{ type: String }],
    monitoringPlan: [{ type: String }],
    chemicalWarning: { type: String, default: '' }
  },

  isDemoMode: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true }
});

AnalysisSchema.index({ userId: 1, createdAt: -1 });
AnalysisSchema.index({ cropId: 1 });
AnalysisSchema.index({ 'riskAssessment.riskLevel': 1 });

module.exports = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
