const express = require('express');
const { uploadAppraisalLetter } = require('../controllers/uploadController');
const { authenticateUser } = require('../middleware/authenticateUser')
const router = express.Router()
router.put('/upload', authenticateUser, uploadAppraisalLetter)
module.exports = router;