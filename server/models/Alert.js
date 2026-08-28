const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cropName: { type: String, required: true },
  cropId: { type: String, required: true },
  threatName: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'HIGH' 
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true }
  },
  triggerReason: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  validUntil: { type: Date },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
