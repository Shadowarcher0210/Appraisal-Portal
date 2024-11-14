const express = require('express');
const { getEmployeeAppraisals, managerEvaluation } = require('../../controllers/manager/Performance');
const router = express.Router()

router.get('/allAppraisals/:managerName/:startDate/:endDate', getEmployeeAppraisals)
// router.post('/evaluation', managerEvaluation)

module.exports = router;