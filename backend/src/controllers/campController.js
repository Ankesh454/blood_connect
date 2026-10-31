const Camp = require('../models/Camp');

// Get all donation camps
const getCamps = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const filter = {};
    if (req.query.city) filter.city = { $regex: String(req.query.city).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const camps = await Camp.find(filter).sort({ date: 1 }).skip((page - 1) * limit).limit(limit).lean();
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authenticated Users and approved Hospitals may organize camps.
const createCamp = async (req, res) => {
  try {
    const { title, venue, city, date, startTime, endTime, contactPhone, description } = req.body;

    if (!title || !venue || !city || !date || !startTime || !endTime || !contactPhone) {
      return res.status(400).json({ message: 'Please fill all required camp details' });
    }

    const camp = await Camp.create({
      hospital: req.user._id,
      hospitalName: req.user.name,
      title,
      venue,
      city,
      date,
      startTime,
      endTime,
      contactPhone,
      description: description || ''
    });

    res.status(201).json(camp);
  } catch (error) {
    console.error('CAMP CREATE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete camp (Owner only)
const deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.hospital.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this camp' });
    }

    await camp.deleteOne();
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCamps,
  createCamp,
  deleteCamp
};
