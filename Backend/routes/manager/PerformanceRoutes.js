const express = require('express');
const { getEmployeeAppraisals, evaluateAppraisalForm } = require('../../controllers/manager/Performance');
const router = express.Router()
router.get('/allAppraisals/:managerName/:startDate/:endDate', getEmployeeAppraisals)
module.exports = router;