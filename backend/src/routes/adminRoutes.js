const express = require('express');
const { adminLogin, getDashboard, updateRecord, deleteRecord, approveHospitalApplication, rejectHospitalApplication } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/auth/login', adminLogin);
router.use(protect, requireAdmin);
router.get('/dashboard', getDashboard);
router.post('/users/:id/approve-hospital', approveHospitalApplication);
router.post('/users/:id/reject-hospital', rejectHospitalApplication);
router.patch('/records/:collection/:id', updateRecord);
router.delete('/records/:collection/:id', deleteRecord);

module.exports = router;
