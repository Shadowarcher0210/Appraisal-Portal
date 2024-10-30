const Appraisal = require('../models/Appraisal');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',  
        filename: (req, file, cb) => {
            const originalName = file.originalname;
            cb(null, originalName);
        }
    })
}).single('appraisalLetter');  // Single file upload named 'appraisalLetter'

const uploadAppraisalLetter = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: 'File upload failed: ' + err.message });
        }

        const employeeId = req.employeeId;
        console.log("employeeId",employeeId)
        if (!employeeId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        try {
            const user = await User.findById(employeeId, 'empName');
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            const appraisalUpdate = await Appraisal.updateOne(
                { employeeId },  // Find the appraisal record by employeeId
                { appraisalLetter: req.file ? req.file.path : null }  
            );

            if (appraisalUpdate.matchedCount === 0) {
                return res.status(404).send({ error: 'No appraisal record found for this user.' });
            }

            res.status(201).send({ message: 'Appraisal letter uploaded successfully!' });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
};

module.exports = { uploadAppraisalLetter };
