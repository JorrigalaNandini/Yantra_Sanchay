const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require auth and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/statistics', adminController.getStatistics);
router.get('/users', adminController.getAllUsers);
router.get('/machinery', adminController.getAllMachinery);
router.get('/requests', adminController.getAllRequests);
router.get('/pooling', adminController.getAllPooling);

router.put('/machinery/:id/verify', adminController.verifyMachinery);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);

module.exports = router;
