// routes/tests.js
const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

// Route to create a new test record
router.post('/create', async (req, res) => {
  try {
    const { lang } = await req.body;
    const userId = req.userId;

    // Check if a test with the same user and language already exists
    const existingTest = await Test.findOne({ user: userId, lang });

    if (existingTest) {
      return res.status(400).json({ error: 'You have already taken the test.' });
    }

    // Create a new test record
    const newTest = new Test({
      user: userId,
      lang,
    });

    await newTest.save();

    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating test record:', error);
    res.status(500).json({ error: 'Unable to create test record.' });
  }
});


// Route to get test details by lang and userId
router.get('/test-details/:lang', async (req, res) => {
  try {
    const { lang } = req.params;

    // Find the test record with the specified lang and userId
    const test = await Test.findOne({ lang, user: req.userId });

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    // Create a new object without the user field
    var testDetails = test.toObject();

    testDetails.user = undefined;

    res.json(testDetails);
  } catch (error) {
    console.error('Error retrieving test details:', error);
    res.status(500).json({ error: 'Unable to retrieve test details.' });
  }
});

// Route to submit test results and calculate the score
router.post('/submit-test/:testId', async (req, res) => {
  try {
    const { completionTime } = req.body;
    const { testId } = req.params;

    // Find the test by testId
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    var questions = await Question.find({ language: test.lang });
    var answers = await Answer.find({ test: testId });

    // questions = new Object(questions);
    // answers = new Object(answers);

    var score = 0;


    // Calculate the score based on provided answers
    answers.map(async (answer) => {
      const isCorrect = questions.filter((question => question._id.toString() === answer.question.toString() && question.correct_answer === answer.answer));
      return score += (isCorrect[0]?.score || 0);
    });

    // Update the test with the calculated score, completionTime, and status as needed
    test.score = score;
    test.completionTime = completionTime;
    test.status = 'completed'; // You can update the test status as needed

    await test.save();

    res.json({ message: 'Test results submitted and score calculated successfully.', score });
  } catch (error) {
    console.error('Error submitting test results:', error);
    res.status(500).json({ error: 'Unable to submit test results.' });
  }
});

// Route to retake a test, set score to 0, completionTime to 0, and status to 'pending', and delete associated answers
router.put('/retake-test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    // Find the test by testId
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    // Set score to 0, completionTime to 0, and status to 'pending'
    test.score = 0;
    test.completionTime = 0;
    test.status = 'pending';

    await test.save();

    // Delete all answers associated with the test
    await Answer.deleteMany({ test: testId });

    res.json({ message: 'Test retaken successfully.' });
  } catch (error) {
    console.error('Error retaking test:', error);
    res.status(500).json({ error: 'Unable to retake test.' });
  }
});

module.exports = router;
