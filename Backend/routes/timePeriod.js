const express = require('express');
const { getAppraisalsByDateRange } = require('../controllers/timePeriodController');
const router = express.Router();
router.get('/getTime/:startDate/:endDate', getAppraisalsByDateRange);

module.exports = router;