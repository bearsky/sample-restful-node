const express = require('express');
const router = express.Router();

const skillController = require('../../controllers/employee/skillController');

router.get('/', skillController.index);
router.get('/:id', skillController.show);

module.exports = router;