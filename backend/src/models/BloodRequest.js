const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  unitsNeeded: { type: Number, required: true, min: 1, max: 50 },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
  hospitalName: { type: String, required: true },
  city: { type: String, required: true },
  contactPhone: { type: String, required: true },
  urgencyLevel: { 
    type: String, 
    enum: ['Critical', 'Urgent', 'Moderate'], 
    default: 'Critical' 
  },
  status: { type: String, enum: ['Pending', 'Fulfilled', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

bloodRequestSchema.index({ status: 1, city: 1, bloodGroup: 1, createdAt: -1 });
bloodRequestSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
