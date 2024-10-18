const mongoose = require('mongoose')

const appraisalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        timePeriod: {
            type: [Date], // Array of dates
            validate: {
                validator: function(v) {
                    return v.length === 2; // For displaying two dates
                },
                message: 'Time period must contain exactly two dates (start and end).'
            },
        },
        initiatedOn: {
            type: Date,
            required: true
        },
        managerName:{
            type: String,
            required: true
        },
        empScore:{
            type: Number,
            required: true
        },
        status:{
            type: String,
            enum:["To Do","In Progress","Submitted","Under Review","Completed"],
            default: "To Do",
            required: true
        },
    }
)

module.exports = mongoose.model('appraisal',appraisalSchema)
