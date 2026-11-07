const express = require('express');
const requestController = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, requestController.create);
router.get('/', authMiddleware, requestController.getAll);
router.get('/:id', authMiddleware, requestController.getById);
router.put('/:id/status', authMiddleware, requestController.updateStatus);
router.get('/user/my-requests', authMiddleware, requestController.getUserRequests);

module.exports = router;
