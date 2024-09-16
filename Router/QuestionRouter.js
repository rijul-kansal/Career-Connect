const express = require('express');
const QuestionController = require('./../Controller/QuestionsController');
const AuthController = require('./../Controller/AuthController');
const router = express.Router();
router.use(AuthController.protect);
router.route('/:type').get(QuestionController.displayQuestions);
router.route('/').get(QuestionController.showTypesOfQuestions);
router.route('/').post(QuestionController.addDataToUserDb);
module.exports = router;
