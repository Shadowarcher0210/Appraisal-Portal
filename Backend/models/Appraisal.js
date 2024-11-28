
const mongoose = require('mongoose');

const pageDataSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            default: ""
        },
        weights: {
            type: Number,
            default: " "
        },
        managerEvaluation: {
            type: Number,
            default: null
        }
    },
  
);

const appraisalSchema = new mongoose.Schema({
    employeeId: {
        type: "string",
        ref: 'User',
        required: true
    },
    empName: {
        type: 'string',
        required: true
    },
    designation: {
        type: 'string',
        required: true
    },
    department: {
        type: 'string',
        required: true
    },
    empScore: {
        type: 'string',
    },
    band: {
        type: 'string',
        required: true
    },

    timePeriod: {
        type: [Date],
        validate: {
            validator: function (v) {
                return v.length === 2;
            },
            message: 'Time period must contain exactly two dates (start and end).'
        }
    },
    initiatedOn: {
        type: Date,
        required: true
    },
    managerName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Submitted", "Under Review", "Under HR Review"],
        default: "To Do",
        required: true
    },
    pageData: {
        type: [pageDataSchema],
        default: []
    },
    submittedDate: {
        type: Date,
        default: null
    },
    overallScore: {
        type: Number,
        default: null
    },
});

module.exports = mongoose.model('Appraisal', appraisalSchema);