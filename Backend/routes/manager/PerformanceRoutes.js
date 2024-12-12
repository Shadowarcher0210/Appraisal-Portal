const express = require('express');
const { getEmployeeAppraisals, saveAdditionalDetails, getAdditionalDetails, saveManagerEvaluation, getManagerEvaluation, getOverallEvaluation, postOverAllWeightage} = require('../../controllers/manager/Performance');
const router = express.Router()

router.get('/allAppraisals/:managerName/:startDate/:endDate', getEmployeeAppraisals)
router.put('/saveAdditionalDetails/:employeeId/:startDate/:endDate', saveAdditionalDetails);
router.get('/getAdditionalDetails/:employeeId/:startDate/:endDate',getAdditionalDetails);
router.put('/managerEvaluation/:employeeId/:startDate/:endDate/:managerName', saveManagerEvaluation);
router.get('/Evaluation/:employeeId/:startDate/:endDate/:managerName', getManagerEvaluation);
router.get('/overAllEvaluation/:employeeId/:startDate/:endDate',getOverallEvaluation);
router.post('/overAllWeightage/:employeeId/:startDate/:endDate',postOverAllWeightage);
module.exports = router;