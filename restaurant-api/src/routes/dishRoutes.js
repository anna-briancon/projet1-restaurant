const express = require('express');
const router = express.Router({ mergeParams: true });
const dishController = require('../controllers/dishController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticate, authorize('RESTAURANT'), upload.single('photo'), dishController.createDish);

router.delete('/:id', authenticate, authorize('RESTAURANT'), dishController.deleteDish);
router.get('/', authenticate, dishController.getDishes);
router.get('/:id', authenticate, authorize('USER'), dishController.getDish);
module.exports = router;