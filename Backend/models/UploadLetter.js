const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    bucketName: { type: String, required: true },
    metadata: {
        employeeId: { 
            type: String,
            required: true 
        },
        originalName: {
             type: String, 
             required: true 
            },
        uploadedAt: { 
            type: Date,
            required: true 
        },
    },
    gridFsFileId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;