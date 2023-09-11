// routes/answers.js
const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// Route to create or update an answer for a specific testId and questionId
router.post('/post-answer', async (req, res) => {
  try {
    const { testId, questionId, answer } = req.body;

    // Check if an answer already exists for the given testId and questionId
    let existingAnswer = await Answer.findOne({ test: testId, question: questionId });

    if (!existingAnswer) {
      // If no answer exists, create a new one
      existingAnswer = new Answer({
        test: testId,
        question: questionId,
        answer,
      });
    } else {
      // If an answer exists, update it
      existingAnswer.answer = answer;
    }

    await existingAnswer.save();
    const question = await Question.findOne({ _id: questionId, correct_answer: answer });
    const answersCount = await Answer.count({ test: testId });

    console.log(question)

    res.status(200).json({ answersCount, updatedData: existingAnswer, isCorrect: question ? true : false });
  } catch (error) {
    console.error('Error creating or updating answer:', error);
    res.status(500).json({ error: 'Unable to create or update answer.' });
  }
});

router.get('/get-answers/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    // Find answers by lang
    const answers = await Answer.find({ test: testId }, {
      answer: 1,
      question: 1
    });

    res.json(answers);
  } catch (error) {
    console.error('Error retrieving answers:', error);
    res.status(500).json({ error: 'Unable to retrieve answers.' });
  }
});

module.exports = router;
