const express = require('express');
const { sendConfirmationEmails, sendCompletedEmails } = require('../controllers/mailController');


const router = express.Router();

router.post('/email',sendConfirmationEmails);
router.post('/completedEmail',sendCompletedEmails);

module.exports = router;