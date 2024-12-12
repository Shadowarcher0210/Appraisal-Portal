const mongoose = require('mongoose');
const Appraisal = require('../models/Appraisal');
const User = require('../models/User');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const File = require('../models/UploadLetter'); 
require('dotenv').config(); 

const storage = new GridFsStorage({
    url: process.env.CONNECTION_STRING,
    file: (req, file) => {
        if (!req.params.employeeId) {
            throw new Error('Employee ID is missing');
        }
        console.log('File being uploaded:', file);
        const fileMetadata = {
            filename: `${file.originalname}`,
            bucketName: 'uploadLetters',
            metadata: {
                employeeId: req.params.employeeId,
                originalName: file.originalname,
                uploadedAt: new Date(),
            },
        };
        console.log('File Metadata:', fileMetadata); 
        return fileMetadata;
    },
});

const upload = multer({ storage }).single('appraisalLetter');

const uploadAppraisalLetter = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: 'File upload failed: ' + err.message });
        }

        const employeeId = req.params.employeeId;

        if (!employeeId) {
            return res.status(400).send({ error: 'Employee ID is required' });
        }

        try {
            const user = await User.findOne({ employeeId: employeeId });
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            console.log('Uploaded file:', req.file); 

            const uploadedFile = req.file;
            if (!uploadedFile || !uploadedFile.id) {  
                return res.status(400).send({ error: 'File upload failed, no file ID found' });
            }

            const fileDocument = new File({
                filename: uploadedFile.filename,
                bucketName: uploadedFile.bucketName,
                metadata: uploadedFile.metadata,
                gridFsFileId: uploadedFile.id, 
            });

            await fileDocument.save();
            console.log('File metadata saved to File collection:', fileDocument);

            const appraisalUpdate = await Appraisal.updateOne(
                { employeeId: employeeId },
                { $set: { appraisalLetter: fileDocument._id } }, 
                { upsert: true }
            );

            if (appraisalUpdate.matchedCount === 0 && !appraisalUpdate.upsertedId) {
                return res.status(404).send({ error: 'No appraisal record found for this user.' });
            }

            res.status(200).send({ message: 'Appraisal letter uploaded successfully!' });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
};

module.exports = { uploadAppraisalLetter };