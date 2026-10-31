const Hospital = require('../models/Hospital');
const mongoose = require('mongoose');

const listHospitals = async (req, res) => {
  try {
    const { city = '', q = '', page = 1, limit = 20 } = req.query;
    const filters = [];
    if (city.trim()) filters.push({ city: new RegExp(city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
    if (q.trim()) filters.push({ $or: ['name', 'address', 'city'].map((field) => ({ [field]: new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })) });
    const filter = filters.length ? { $and: filters } : {};
    const pageNo = Math.max(1, Number.parseInt(page, 10) || 1);
    const size = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [items, total] = await Promise.all([Hospital.find(filter).select('name address city phone email verified').sort({ name: 1 }).skip((pageNo - 1) * size).limit(size).lean(), Hospital.countDocuments(filter)]);
    return res.json({ items, page: pageNo, limit: size, total });
  } catch (_error) { return res.status(500).json({ message: 'Unable to load hospitals' }); }
};
const getHospital = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid hospital identifier' });
  const hospital = await Hospital.findById(req.params.id).select('name address city phone email verified').lean();
  return hospital ? res.json(hospital) : res.status(404).json({ message: 'Hospital not found' });
};
const createHospital = async (req, res) => {
  const { name, address, city, phone, email } = req.body || {};
  if (!name?.trim() || !address?.trim() || !city?.trim()) return res.status(400).json({ message: 'Name, address and city are required' });
  const hospital = await Hospital.create({ name, address, city, phone, email, createdBy: req.admin ? null : req.user._id, verified: false });
  return res.status(201).json(hospital);
};
const updateHospital = async (req, res) => {
  const fields = ['name', 'address', 'city', 'phone', 'email', 'verified'];
  const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => fields.includes(key)));
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No editable fields provided' });
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  return hospital ? res.json(hospital) : res.status(404).json({ message: 'Hospital not found' });
};
const deleteHospital = async (req, res) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  return hospital ? res.json({ message: 'Hospital deleted' }) : res.status(404).json({ message: 'Hospital not found' });
};
module.exports = { listHospitals, getHospital, createHospital, updateHospital, deleteHospital };
