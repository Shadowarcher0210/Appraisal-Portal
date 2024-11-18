const { Question } = require('../../models/Questions');


const createQuestion = async (req, res) => {
    try {
        const { questionText, category } = req.body;

       
        const validCategories = ['AdditionalAreas', 'SelfAssesment', 'Literature'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newQuestion = new Question({
            questionText,
            category
        });
  await newQuestion.save();
        return res.status(201).json({
            message: 'New question created successfully',
            data: newQuestion
        });
    } catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({ message: 'Error creating question', error: error.message });
    }
};

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json({
            message: 'Questions retrieved successfully',
            data: questions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};

//Get a single question by ID
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        return res.status(200).json({
            message: 'Question retrieved successfully',
            data: question
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        return res.status(500).json({ message: 'Error fetching question', error: error.message });
    }
};

//Update a question by ID
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionText, category } = req.body;
 const validCategories = ['AdditionalAreas', 'SelfAssesment', 'Literature'];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
  const updateData = {};
        if (questionText) {
            updateData.questionText = questionText;
        }
        if (category) {
            updateData.category = category;
        }
 if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Update the question
        const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        return res.status(200).json({
            message: 'Question updated successfully',
            data: updatedQuestion
        });
    } catch (error) {
        console.error('Error updating question:', error);
        return res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};


//Delete a question by ID
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        return res.status(200).json({
            message: 'Question deleted successfully',
            data: deletedQuestion
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        return res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Exporting the controller functions
module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};
