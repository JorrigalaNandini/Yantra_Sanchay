const express = require('express');
const poolingController = require('../controllers/poolingController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, poolingController.create);
router.get('/', poolingController.getAll);
router.get('/:id', poolingController.getById);
router.post('/:id/join', authMiddleware, poolingController.joinPooling);
router.put('/:id/status', authMiddleware, poolingController.updateStatus);
router.get('/user/my-pooling', authMiddleware, poolingController.getUserPooling);

module.exports = router;
