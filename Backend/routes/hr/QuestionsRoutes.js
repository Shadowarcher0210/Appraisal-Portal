const express = require('express');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../../controllers/hr/QuestionController');
const router=express.Router();
router.post("/createQuestion",createQuestion);
router.get('/questions/:category', getAllQuestions); 
router.get('/questions/:id', getQuestionById); 
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion); 

module.exports=router