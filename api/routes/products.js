const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const productController = require('../controllers/productController');
const upload = require('../../helpers/uploadFile');

router.get('/', productController.index);
router.get('/:id', productController.show);
router.post('/', checkAuth, upload.single('image'), productController.store);
router.put('/:id', checkAuth, productController.update);
router.delete('/:id', checkAuth, productController.destroy);

module.exports = router;