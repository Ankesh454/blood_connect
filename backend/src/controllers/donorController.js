const User = require('../models/User');

const getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, page = 1, limit = 20 } = req.query;
    const query = { role: 'user' };
    if (bloodGroup && bloodGroup.trim()) query.bloodGroup = bloodGroup.trim();
    if (city && city.trim()) query.city = { $regex: city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20));
    const donors = await User.find(query).select('name bloodGroup city phone').sort({ name: 1 })
      .skip((pageNumber - 1) * pageSize).limit(pageSize).lean();
    return res.json({ items: donors, page: pageNumber, limit: pageSize });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load donors' });
  }
};

module.exports = { getDonors };
