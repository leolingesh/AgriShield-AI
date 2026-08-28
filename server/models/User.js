const mongoose = require('mongoose');

const FarmLocationSchema = new mongoose.Schema({
  name: { type: String, default: 'Main Farm' },
  state: { type: String, required: true },
  district: { type: String, required: true },
  village: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number },
  sizeAcres: { type: Number, default: 2.5 }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  email: { type: String, lowercase: true, trim: true },
  password: { type: String },
  preferredLanguage: { type: String, default: 'en' },
  farmLocations: [FarmLocationSchema],
  activeCrops: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
