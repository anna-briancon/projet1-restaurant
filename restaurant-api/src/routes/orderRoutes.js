const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/restaurant', authenticate, authorize('RESTAURANT'), orderController.getRestaurantOrders);
router.delete('/:id', authenticate, authorize('RESTAURANT'), orderController.deleteOrder);

module.exports = router;