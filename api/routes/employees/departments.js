const express = require('express');
const router = express.Router();

const departmentController = require('../../controllers/employee/departmentController');

router.get('/', departmentController.index);
router.get('/:id', departmentController.show);

module.exports = router;