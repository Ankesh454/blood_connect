const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  venue: { type: String, required: true, trim: true, maxlength: 300 },
  city: { type: String, required: true, trim: true, maxlength: 120 },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  contactPhone: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

campSchema.index({ city: 1, date: 1 });
campSchema.pre('validate', function validateCampTime() {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) this.invalidate('endTime', 'End time must be after start time');
});

const Camp = mongoose.model('Camp', campSchema);
module.exports = Camp;
