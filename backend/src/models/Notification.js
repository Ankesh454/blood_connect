const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['request_match', 'donation_update', 'request_update', 'system'], required: true },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  bloodRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', default: null },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'DonorCommitment', default: null },
  readAt: { type: Date, default: null },
  dedupeKey: { type: String, default: null },
}, { timestamps: true });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, dedupeKey: 1 }, { unique: true, partialFilterExpression: { dedupeKey: { $type: 'string' } } });
module.exports = mongoose.model('Notification', notificationSchema);
