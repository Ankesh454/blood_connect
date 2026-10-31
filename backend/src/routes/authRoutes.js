const express = require('express');
const router = express.Router();
const { registerUser, authUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const rateLimit = require('../middlewares/rateLimitMiddleware');
router.post('/register', rateLimit({ max: 10 }), registerUser);
router.post('/login', rateLimit({ max: 10 }), authUser);
router.get('/me', protect, getCurrentUser);
module.exports = router;
