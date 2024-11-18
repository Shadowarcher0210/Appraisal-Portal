const express = require('express');
const { getEmployeeAppraisals, saveAdditionalDetails} = require('../../controllers/manager/Performance');
const router = express.Router()

router.get('/allAppraisals/:managerName/:startDate/:endDate', getEmployeeAppraisals)
router.put('/saveAdditionalDetails/:employeeId/:startDate/:endDate', saveAdditionalDetails);
module.exports = router;