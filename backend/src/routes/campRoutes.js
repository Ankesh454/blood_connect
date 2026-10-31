const express = require('express');
const router = express.Router();
const controller = require('../controllers/campController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
router.get('/', controller.getCamps);
router.post('/', protect, requireRole('user', 'hospital'), controller.createCamp);
router.delete('/:id', protect, requireRole('user', 'hospital'), controller.deleteCamp);
module.exports = router;
