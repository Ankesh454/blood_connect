const express = require('express');
const router = express.Router();
const controller = require('../controllers/sosController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
router.get('/', controller.getSOSAlerts);
router.post('/', protect, requireRole('hospital'), controller.createSOSAlert);
router.put('/:id/resolve', protect, requireRole('hospital'), controller.resolveSOSAlert);
module.exports = router;
