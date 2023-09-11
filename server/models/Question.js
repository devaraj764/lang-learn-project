// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true
  },
  options: {
    type: [String],
    required: true,
  },
  correct_answer: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
}, {
  collection: 'questions',
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
