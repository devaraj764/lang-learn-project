// routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Test = require('../models/Test');


// Route to get the list of languages (protected route)
router.get('/languages', async (req, res) => {
  try {
    const languages = await Question.distinct('language');
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve languages.' });
  }
});


// Route to get language details including totalscore, numberofquestions, and totaltestsrecorded for a specific language
router.get('/language-details/:lang', async (req, res) => {
  try {
    const { lang } = req.params; // Extract the 'lang' route parameter

    // Calculate the total score for the specified language
    const totalScore = await Question.aggregate([
      {
        $match: { language: lang },
      },
      {
        $group: {
          _id: null,
          totalScore: { $sum: '$score' },
        },
      },
    ]);

    // Calculate the number of questions for the specified language
    const numberOfQuestions = await Question.countDocuments({ language: lang });

    // Calculate the total tests recorded for the specified language
    const totalTestsRecorded = await Test.countDocuments({ lang: lang });

    // Retrieve test results for the specified language, populate user names and IDs, and sort by score (DESC) and completionTime (ASC)
    const testResults = await Test.find({ lang: lang, status: 'completed' })
      .populate('user', 'name email _id')
      .sort({ score: -1, completionTime: -1 });

    res.json({
      language: lang,
      totalScore: totalScore[0]?.totalScore || 0,
      numberOfQuestions,
      totalTestsRecorded,
      testResults
    });
  } catch (error) {
    console.error('Error retrieving language details:', error);
    res.status(500).json({ error: 'Unable to retrieve language details.' });
  }
});

// Route to get questions by lang and testId
router.get('/get-questions/:lang/:testId', async (req, res) => {
  try {
    const { lang, testId } = req.params;

    // Find questions by lang
    const questions = await Question.find({ language: lang }, {
      _id: 1,
      question: 1,
      options: 1,
      score: 1,
      correct_answer: testId === 'undefined' ? 1 : -1
    }).sort({
      createdAt: testId === 'undefined' ? -1 : 1
    });

    if (testId !== 'undefined') {
      // Find answers for the specified testId
      const answers = await Answer.find({ test: testId });

      // Append answers to questions if available
      const questionsWithAnswers = questions.map((question) => {
        const matchingAnswer = answers.find((answer) =>
          answer.question.toString() === question._id.toString()
        );

        return {
          _id: question._id,
          question: question.question,
          options: question.options,
          correct_option: question.correct_option,
          score: question.score,
          language: question.language,
          answer: matchingAnswer ? matchingAnswer.answer : null,
        };
      });
      return res.json(questionsWithAnswers)
    }

    // if no testId
    res.json(questions);
  } catch (error) {
    console.error('Error retrieving questions with answers:', error);
    res.status(500).json({ error: 'Unable to retrieve questions with answers.' });
  }
});

// Route to create or update a question by questionId
router.post('/update/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { question, options, correct_answer, score, language } = req.body;

    let updatedQuestion;

    if (questionId) {
      // Update an existing question by questionId
      updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        req.body,
        { new: true }
      ).select({
        _id: 1,
        question: 1,
        options: 1,
        score: 1,
        correct_answer: 1
      });
    } else {
      // Create a new question
      updatedQuestion = await Question.create({ question, options, correct_answer, score, language }).select({
        _id: 1,
        question: 1,
        options: 1,
        score: 1,
        correct_answer: 1
      });
    }

    res.json({ message: 'Question updated or created successfully', updatedQuestion });
  } catch (error) {
    console.error('Error updating or creating question:', error);
    res.status(500).json({ error: 'Unable to update or create question.' });
  }
});

module.exports = router;


module.exports = router;
