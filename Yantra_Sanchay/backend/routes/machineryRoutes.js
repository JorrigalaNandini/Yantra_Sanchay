const express = require('express');
const machineryController = require('../controllers/machineryController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', machineryController.getAll);
router.get('/search', machineryController.search);
router.get('/:id', machineryController.getById);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['machinery_provider']), machineryController.create);
router.put('/:id', authMiddleware, machineryController.update);
router.delete('/:id', authMiddleware, machineryController.delete);
router.get('/user/my-machinery', authMiddleware, machineryController.getUserMachinery);

module.exports = router;
