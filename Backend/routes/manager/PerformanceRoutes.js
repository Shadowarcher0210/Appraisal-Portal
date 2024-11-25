const express = require('express');
const { getEmployeeAppraisals, saveAdditionalDetails, getAdditionalDetails} = require('../../controllers/manager/Performance');
const router = express.Router()

router.get('/allAppraisals/:managerName/:startDate/:endDate', getEmployeeAppraisals)
router.put('/saveAdditionalDetails/:employeeId/:startDate/:endDate', saveAdditionalDetails);
router.get('/getAdditionalDetails/:employeeId/:startDate/:endDate',getAdditionalDetails)
module.exports = router;