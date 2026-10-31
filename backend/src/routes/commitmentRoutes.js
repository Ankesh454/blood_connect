const express = require('express');
const router = express.Router();
const { getCommitments, createCommitment, updateCommitmentStatus } = require('../controllers/commitmentController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

router.get('/', protect, requireRole('user', 'hospital'), getCommitments);
router.post('/', protect, requireRole('user'), createCommitment);
router.put('/:id/status', protect, requireRole('user', 'hospital'), updateCommitmentStatus);

module.exports = router;
