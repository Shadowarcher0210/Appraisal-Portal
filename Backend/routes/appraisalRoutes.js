const express = require('express');
const { saveAppraisalDetails, getAppraisals, updateAppraisalStatus, getAppraisalAnswers, getEmployeeAppraisal, createAppraisalForm, sendExpiringAppraisalNotification} = require('../controllers/appraisalController');
const {authenticateUser} = require('../middleware/authenticateUser')

const router = express.Router()

router.put('/status/:employeeId/:startDate/:endDate', updateAppraisalStatus)
router.put('/saveDetails/:employeeId/:startDate/:endDate',saveAppraisalDetails)
router.post('/createAppraisal',createAppraisalForm);
router.get('/display/:employeeId', getAppraisals);
router.get('/displayAnswers/:employeeId/:startDate/:endDate', getAppraisalAnswers);
router.get('/performance/:employeeId', getEmployeeAppraisal)
router.get('/expiry/:employeeId/:startDate',sendExpiringAppraisalNotification );

module.exports = router;