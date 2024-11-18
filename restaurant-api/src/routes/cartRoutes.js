const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, cartController.addToCart);
router.get('/', authenticate, cartController.getCart);
router.delete('/:id', authenticate, cartController.removeFromCart);

module.exports = router;