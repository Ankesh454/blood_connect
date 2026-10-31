const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
router.get('/', controller.getInventory);
router.post('/', protect, requireRole('hospital'), controller.addInventoryStock);
router.put('/:id', protect, requireRole('hospital'), controller.updateInventoryStock);
router.delete('/:id', protect, requireRole('hospital'), controller.deleteInventoryStock);
module.exports = router;
