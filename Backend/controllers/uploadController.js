const mongoose = require('mongoose');
const Appraisal = require('../models/Appraisal');
const User = require('../models/User');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
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
            filename:` ${file.originalname}`,
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

const fetchAppraisalLetter = async (req, res) => {
    const { employeeId } = req.params;

    if (!employeeId) {
        return res.status(400).send({ error: 'Employee ID is required' });
    }

    try {
        const user = await User.findOne({ employeeId: employeeId });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const appraisal = await Appraisal.findOne({ employeeId: employeeId });

        if (!appraisal || !appraisal.appraisalLetter) {
            return res.status(404).send({ error: 'Appraisal letter not found for this user.' });
        }

        const fileDocument = await File.findById(appraisal.appraisalLetter);

        if (!fileDocument) {
            return res.status(404).send({ error: 'File metadata not found.' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploadLetters',
        });

        const downloadStream = bucket.openDownloadStream(fileDocument.gridFsFileId);

        res.set('Content-Type', 'application/pdf'); 
        res.set('Access-Control-Expose-Headers', 'Content-Disposition');
        res.set('Content-Disposition', `filename="${fileDocument.filename}"`);

        downloadStream.pipe(res);

        downloadStream.on('error', (err) => {
            return res.status(500).send({ error: 'Error streaming file: ' + err.message });
        });

    } catch (error) {
        return res.status(500).send({ error: 'Error fetching appraisal letter: ' + error.message });
    }
};

module.exports = { uploadAppraisalLetter, fetchAppraisalLetter };