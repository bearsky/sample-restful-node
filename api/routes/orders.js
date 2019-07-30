const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const orderController = require('../controllers/orderController');

router.get('/', orderController.index);
router.get('/:id', orderController.show);
router.post('/', checkAuth, orderController.store);
router.put('/:id', checkAuth, orderController.update);
router.delete('/:id', checkAuth, orderController.destroy);

module.exports = router;