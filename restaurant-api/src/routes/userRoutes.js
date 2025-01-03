const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/profile', authenticate, authorize('USER'), userController.getUserProfile);
router.put('/profile', authenticate, authorize('USER'), userController.updateUserProfile);

module.exports = router;
