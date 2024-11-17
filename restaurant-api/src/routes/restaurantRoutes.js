const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('USER'), restaurantController.getRestaurants);
router.get('/info', authenticate, authorize('RESTAURANT'), restaurantController.getRestaurantInfo);
router.put('/', authenticate, authorize('RESTAURANT'), restaurantController.updateRestaurant);
router.get('/:id', authenticate, authorize('USER'), restaurantController.getRestaurantInfoUser);
router.get('/:id/dishes', authenticate, authorize('USER'), restaurantController.getDishes);

module.exports = router;