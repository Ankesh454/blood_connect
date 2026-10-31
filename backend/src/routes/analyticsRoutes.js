const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, requireRole('hospital'), getDashboardAnalytics);

module.exports = router;
