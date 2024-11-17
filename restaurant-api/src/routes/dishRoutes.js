const express = require('express');
const router = express.Router({ mergeParams: true });
const dishController = require('../controllers/dishController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('RESTAURANT'), dishController.createDish);
router.delete('/:id', authenticate, authorize('RESTAURANT'), dishController.deleteDish);
router.get('/', authenticate, dishController.getDishes);
router.get('/:id', authenticate, authorize('USER'), dishController.getDish);
module.exports = router;