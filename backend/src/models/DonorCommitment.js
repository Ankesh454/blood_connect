const mongoose = require('mongoose');

const donorCommitmentSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  donorPhone: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalName: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  referenceLabel: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Accepted', 'On the Way', 'Donated', 'Cancelled'], 
    default: 'Accepted' 
  },
  referenceType: { type: String, enum: ['SOS', 'Camp', 'General'], default: 'SOS' },
  onTheWayAt: { type: Date, default: null },
  donatedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
}, { timestamps: true });

donorCommitmentSchema.index({ donor: 1, referenceType: 1, referenceId: 1 }, { unique: true, partialFilterExpression: { referenceId: { $type: 'objectId' } } });

const DonorCommitment = mongoose.model('DonorCommitment', donorCommitmentSchema);
module.exports = DonorCommitment;
