const mongoose = require('mongoose');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const createBloodRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, hospitalName, city, contactPhone, urgencyLevel, hospital } = req.body || {};
    if (!patientName?.trim() || !bloodGroups.includes(bloodGroup) || !hospitalName?.trim() || !city?.trim() || !contactPhone?.trim()) return res.status(400).json({ message: 'Please provide valid request details' });
    const units = Number(unitsNeeded ?? 1);
    if (!Number.isInteger(units) || units < 1 || units > 50) return res.status(400).json({ message: 'Units needed must be from 1 to 50' });
    if (urgencyLevel && !['Critical', 'Urgent', 'Moderate'].includes(urgencyLevel)) return res.status(400).json({ message: 'Invalid urgency level' });
    if (hospital && (!mongoose.isValidObjectId(hospital) || !(await mongoose.model('Hospital').exists({ _id: hospital })))) return res.status(400).json({ message: 'Invalid hospital reference' });
    const record = await BloodRequest.create({ user: req.user._id, patientName: patientName.trim(), bloodGroup, unitsNeeded: units, hospitalName: hospitalName.trim(), hospital: hospital || undefined, city: city.trim(), contactPhone: contactPhone.trim(), urgencyLevel: urgencyLevel || 'Critical' });
    const matched = await User.find({ role: 'user', bloodGroup, city: { $regex: `^${city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }, _id: { $ne: req.user._id } }).select('_id').limit(1000).lean();
    if (matched.length) await Notification.insertMany(matched.map(({ _id }) => ({ recipient: _id, type: 'request_match', message: `A ${bloodGroup} blood request is open in ${city.trim()}. Confirm your availability if you can help.`, bloodRequest: record._id, dedupeKey: `request:${record._id}:donor:${_id}` })), { ordered: false });
    return res.status(201).json(record);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Duplicate record' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Unable to create blood request' });
  }
};
const getAllRequests = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const items = await BloodRequest.find({ status: 'Pending' }).select('patientName bloodGroup unitsNeeded hospitalName city contactPhone urgencyLevel status createdAt hospital user').populate('user', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return res.json(items);
  } catch (_error) { return res.status(500).json({ message: 'Unable to load blood requests' }); }
};
const getMyRequests = async (req, res) => res.json(await BloodRequest.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean());
const updateMyRequest = async (req, res) => {
  const allowed = ['patientName', 'bloodGroup', 'unitsNeeded', 'hospitalName', 'city', 'contactPhone', 'urgencyLevel'];
  const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No editable request fields provided' });
  if (updates.bloodGroup && !bloodGroups.includes(updates.bloodGroup)) return res.status(400).json({ message: 'Invalid blood group' });
  if (updates.unitsNeeded !== undefined && (!Number.isInteger(Number(updates.unitsNeeded)) || Number(updates.unitsNeeded) < 1 || Number(updates.unitsNeeded) > 50)) return res.status(400).json({ message: 'Units needed must be from 1 to 50' });
  const request = await BloodRequest.findOneAndUpdate({ _id: req.params.id, user: req.user._id, status: 'Pending' }, updates, { new: true, runValidators: true });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  return res.json(request);
};
const cancelMyRequest = async (req, res) => {
  const request = await BloodRequest.findOneAndUpdate({ _id: req.params.id, user: req.user._id, status: 'Pending' }, { $set: { status: 'Cancelled' } }, { new: true });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  return res.json(request);
};
module.exports = { createBloodRequest, getAllRequests, getMyRequests, updateMyRequest, cancelMyRequest };
