const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware(['farmer']), userController.getDashboard);
router.get('/', authMiddleware, adminMiddleware, userController.getAll);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateById);
router.delete('/:id', authMiddleware, adminMiddleware, userController.delete);

module.exports = router;
