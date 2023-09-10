// models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // Reference to the Question model
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
