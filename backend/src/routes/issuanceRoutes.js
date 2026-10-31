const express = require('express');
const router = express.Router();
const controller = require('../controllers/issuanceController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
router.use(protect, requireRole('hospital'));
router.get('/', controller.getIssuanceLogs);
router.post('/', controller.createIssuanceLog);
module.exports = router;
