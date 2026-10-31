const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  address: { type: String, required: true, trim: true, maxlength: 300 },
  city: { type: String, required: true, trim: true, maxlength: 120, index: true },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  email: { type: String, lowercase: true, trim: true, maxlength: 254, default: '' },
  verified: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
hospitalSchema.index({ name: 'text', address: 'text', city: 'text' });
module.exports = mongoose.model('Hospital', hospitalSchema);
