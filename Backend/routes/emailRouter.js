const express = require('express');
const { sendConfirmationEmails, sendCompletedEmails, sendGoalsAddedEmails } = require('../controllers/mailController');


const router = express.Router();

router.post('/email',sendConfirmationEmails);
router.post('/completedEmail',sendCompletedEmails);
router.post('/goalSubmitEmail',sendGoalsAddedEmails);

module.exports = router;