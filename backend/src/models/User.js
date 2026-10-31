const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['user', 'hospital', 'admin'], default: 'user' },
  requestedRole: { type: String, enum: ['hospital'], default: undefined },
  approvalStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  bloodGroup: { type: String, enum: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], default: undefined },
  city: { type: String, trim: true, maxlength: 120, default: '' },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
}, { timestamps: true, toJSON: { transform(_doc, ret) { delete ret.password; delete ret.__v; return ret; } } });

userSchema.pre('validate', function setLegacyHospitalApproval() {
  // Existing hospital accounts from before approval workflow remain usable.
  if (this.role === 'hospital' && this.approvalStatus === 'none') this.approvalStatus = 'approved';
});

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
