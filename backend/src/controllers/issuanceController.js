const PatientIssuance = require('../models/PatientIssuance');
const Inventory = require('../models/Inventory');

// Get all issuance logs for logged-in hospital
const getIssuanceLogs = async (req, res) => {
  try {
    const logs = await PatientIssuance.find({ hospital: req.user._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log a new patient issuance and automatically deduct from inventory stock
const createIssuanceLog = async (req, res) => {
  const decremented = [];
  try {
    const { patientName, patientAge, gender, bloodGroup, unitsIssued, doctorName, reason } = req.body;

    if (!patientName || !patientAge || !gender || !bloodGroup || !unitsIssued || !doctorName || !reason) {
      return res.status(400).json({ message: 'Please complete all required fields for issuance log' });
    }

    const units = Number(unitsIssued);

    // Check available stock in hospital inventory for this blood group
    const inventoryItems = await Inventory.find({ hospital: req.user._id, bloodGroup, expiryDate: { $gt: new Date() }, units: { $gt: 0 } }).sort({ expiryDate: 1 });
    let totalStock = inventoryItems.reduce((acc, item) => acc + item.units, 0);

    if (totalStock < units) {
      return res.status(400).json({ 
        message: `Insufficient blood stock for ${bloodGroup}. Available: ${units} units required, but only ${totalStock} units in stock.` 
      });
    }

    // Use atomic decrements. If a concurrent issuance changes available stock,
    // restore prior decrements before returning a conflict.
    let remainingToDeduct = units;
    for (const item of inventoryItems) {
      if (remainingToDeduct <= 0) break;
      const take = Math.min(item.units, remainingToDeduct);
      const result = await Inventory.updateOne({ _id: item._id, hospital: req.user._id, units: { $gte: take } }, { $inc: { units: -take } });
      if (result.modifiedCount !== 1) {
        await Promise.all(decremented.map(({ _id, amount }) => Inventory.updateOne({ _id }, { $inc: { units: amount } })));
        return res.status(409).json({ message: 'Stock changed during issuance. Please retry.' });
      }
      decremented.push({ _id: item._id, amount: take });
      remainingToDeduct -= take;
    }
    const log = await PatientIssuance.create({
      hospital: req.user._id,
      hospitalName: req.user.name,
      patientName,
      patientAge,
      gender,
      bloodGroup,
      unitsIssued: units,
      doctorName,
      reason
    });
    decremented.length = 0;

    await Inventory.deleteMany({ hospital: req.user._id, units: 0 });

    res.status(201).json(log);
  } catch (error) {
    if (decremented.length) {
      await Promise.all(decremented.map(({ _id, amount }) => Inventory.updateOne({ _id }, { $inc: { units: amount } })));
    }
    console.error('ISSUANCE LOG ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIssuanceLogs,
  createIssuanceLog
};
