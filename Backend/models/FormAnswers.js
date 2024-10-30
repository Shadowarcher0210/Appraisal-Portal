const mongoose = require('mongoose')

const formAnswerSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        pageData: [{
            questionId: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true,
            },
            _id: false
        }],
        timePeriod: {
            type: [String], 
            validate: {
                validator: function(v) {
                    return v.length === 2; // For displaying two dates
                },
                message: 'Time period must contain exactly two dates (start and end).'
            },
        },

    }
)

module.exports = mongoose.model('form',formAnswerSchema)
