const express = require('express');
const { uploadAppraisalLetter, fetchAppraisalLetter } = require('../controllers/uploadController');

const router = express.Router()
router.put('/upload/:employeeId', uploadAppraisalLetter)
router.get('/fetch/:employeeId', fetchAppraisalLetter)

module.exports = router;