const express = require('express');
const router = express.Router();
const restaurateurController = require('../controllers/restaurateurController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), restaurateurController.createRestaurateur);
router.get('/', authenticate, authorize('ADMIN'), restaurateurController.getAllRestaurateurs);
router.delete('/:id', authenticate, authorize('ADMIN'), restaurateurController.deleteRestaurateur);

module.exports = router;