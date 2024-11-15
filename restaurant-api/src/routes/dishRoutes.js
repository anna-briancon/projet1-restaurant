const express = require('express');
const router = express.Router({ mergeParams: true });
const dishController = require('../controllers/dishController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('RESTAURANT'), dishController.createDish);
router.get('/', dishController.getDishes);
router.delete('/:id', authenticate, authorize('RESTAURANT'), dishController.deleteDish);

module.exports = router;