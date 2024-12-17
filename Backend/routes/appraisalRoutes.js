const express = require('express');
const { saveAppraisalDetails, getAppraisals, updateAppraisalStatus, getAppraisalAnswers, getEmployeeAppraisal, createAppraisalForm, sendExpiringAppraisalNotification, getApplicationNotification, getApplicationNotificationStarts, notifyManagersOfSubmittedAppraisals, deleteAppraisalForm, notifyGoalsAssaigned, notifyEmployeeWhenUnderReview, notifyHRForUnderReviewAppraisals, getUserDetailsFromAppraisal,} = require('../controllers/appraisalController');
const {authenticateUser} = require('../middleware/authenticateUser')

const router = express.Router()

router.put('/status/:employeeId/:startDate/:endDate', updateAppraisalStatus)
router.put('/saveDetails/:employeeId/:startDate/:endDate', saveAppraisalDetails)
router.post('/createAppraisal', createAppraisalForm);
router.delete('/deleteAppraisal',deleteAppraisalForm)
router.get('/display/:employeeId', getAppraisals);
router.get('/displayAnswers/:employeeId/:startDate/:endDate', getAppraisalAnswers);
router.get('/performance/:employeeId', getEmployeeAppraisal)
router.get('/expiry/:employeeId/:startDate',sendExpiringAppraisalNotification );
router.get('/getNotification/:employeeId/:startDate',getApplicationNotification );
router.get('/getNotiStarts/:employeeId',getApplicationNotificationStarts);
router.get('/notify/:managerName',notifyManagersOfSubmittedAppraisals);
router.get('/notifyGoals/:employeeId/:managerName',notifyGoalsAssaigned);
router.get('/notifyHR/:empType',notifyHRForUnderReviewAppraisals);
router.get('/userDetailsAppraisal/:employeeId/:startDate/:endDate',getUserDetailsFromAppraisal)




module.exports = router;