const Inventory = require('../models/Inventory');

// Get all inventory
const getInventory = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const filter = {};
    if (req.query.city) filter.city = { $regex: String(req.query.city).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    const inventory = await Inventory.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add inventory stock
const addInventoryStock = async (req, res) => {
  try {
    const { bloodGroup, units, city, contactPhone, batchNumber, expiryDate } = req.body;

    if (!bloodGroup || !Number.isInteger(Number(units)) || Number(units) < 1 || !city || !expiryDate) {
      return res.status(400).json({ message: 'Please fill all required fields including expiry date' });
    }

    const stock = await Inventory.create({
      hospital: req.user._id,
      hospitalName: req.user.name,
      bloodGroup,
      units,
      city,
      contactPhone,
      batchNumber: batchNumber || 'BATCH-' + Math.floor(Math.random() * 10000),
      expiryDate
    });

    res.status(201).json(stock);
  } catch (error) {
    console.error('INVENTORY ADD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update inventory stock (Owner only)
const updateInventoryStock = async (req, res) => {
  try {
    const stock = await Inventory.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Check ownership
    if (stock.hospital.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this stock' });
    }

    const allowed = ['units', 'bloodGroup', 'city', 'contactPhone', 'batchNumber', 'expiryDate'];
    const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
    const updatedStock = await Inventory.findOneAndUpdate({ _id: req.params.id, hospital: req.user._id }, updates, { new: true, runValidators: true });
    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inventory stock (Owner only)
const deleteInventoryStock = async (req, res) => {
  try {
    const stock = await Inventory.findOne({ _id: req.params.id, hospital: req.user._id });

    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Check ownership
    await stock.deleteOne();
    res.json({ message: 'Stock removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventory,
  addInventoryStock,
  updateInventoryStock,
  deleteInventoryStock
};
