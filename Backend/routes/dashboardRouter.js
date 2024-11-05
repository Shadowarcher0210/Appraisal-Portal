const express = require('express');
const { getEmployees, getEmpDetails } = require('../controllers/dashboardController');

const router = express.Router()

router.get('/emp', getEmployees)
router.get('/details/:employeeId', getEmpDetails)

module.exports = router;