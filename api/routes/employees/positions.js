const express = require('express');
const router = express.Router();

const positionController = require('../../controllers/employee/positionController');

router.get('/', positionController.index);
router.get('/:id', positionController.show);

module.exports = router;