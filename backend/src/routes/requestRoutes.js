const express = require('express');
const router = express.Router();
const { createBloodRequest, getAllRequests, getMyRequests, updateMyRequest, cancelMyRequest } = require('../controllers/requestController');
const { protect, preventAdminAction } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getAllRequests)
  .post(protect, preventAdminAction, createBloodRequest);
router.get('/mine', protect, getMyRequests);
router.patch('/:id', protect, updateMyRequest);
router.delete('/:id', protect, cancelMyRequest);

module.exports = router;
