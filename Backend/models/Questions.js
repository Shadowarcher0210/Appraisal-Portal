const mongoose = require('mongoose');

// Define the schema for a question
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['AdditionalAreas', 'SelfAssesment', 'Literature'],
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };
