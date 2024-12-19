const express = require('express');
const { sendConfirmationEmails, sendCompletedEmails, sendGoalsAddedEmails, sendFinalHREmails, createAppraisalEmail } = require('../controllers/mailController');


const router = express.Router();

router.post('/email',sendConfirmationEmails);
router.post('/managerSubmitEmail',sendCompletedEmails);
router.post('/goalSubmitEmail',sendGoalsAddedEmails);
router.post('/HRSubmitEmail',sendFinalHREmails);
router.post('/createAppraisalEmail',createAppraisalEmail);


module.exports = router;