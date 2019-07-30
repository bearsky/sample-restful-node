const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const userController = require('../controllers/userController');

router.get('/', userController.index);
router.get('/:id', userController.show);
router.put('/:id', checkAuth, userController.update);
router.delete('/:id', checkAuth, userController.delete);

module.exports = router;