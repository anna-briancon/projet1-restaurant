const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/details', authenticate, authorize('RESTAURANT'), restaurantController.getRestaurantDetails);
router.put('/', authenticate, authorize('RESTAURANT'), restaurantController.updateRestaurant);

module.exports = router;