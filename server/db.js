require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Question = require('./models/Question');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Get a list of JSON files in the seeds folder
  const seedsFolderPath = path.join(__dirname, 'seeds');
  const seedFiles = await fs.readdir(seedsFolderPath);

  // Extract unique languages from the file names
  const languages = [...new Set(seedFiles.map((file) => path.parse(file).name))];

  // Seed the questions collection for each language
  for (const language of languages) {
    const count = await Question.countDocuments({ language });
    if (count === 0) {
      // If no records exist, seed the collection
      await seedQuestions(language);
    }
  }
  await seedAdmin();
});

async function seedAdmin(language) {
  try {
    // Check if an answer already exists for the given testId and questionId
    let existingUser = await User.findOne({ email: 'admin@admin.com' });
    if (!existingUser) {
      // If no answer exists, create a new one
      existingUser = new User({
        name: 'Admin',
        email: 'admin@admin.com',
        password: '1234567890',
        role: 'admin'
      });
      await existingUser.save();
      console.log('Seeded admin')
    }

  } catch (err) {
    console.log(err);
  }
}

// Function to seed the questions collection
async function seedQuestions(language) {
  try {
    const filePath = path.join(__dirname, 'seeds', `${language}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    const questions = JSON.parse(data);

    // Iterate through questions and insert if not already in the collection
    for (const questionData of questions) {
      const existingQuestion = await Question.findOne({
        language,
        question: questionData.question,
      });

      if (!existingQuestion) {
        // Update the field name to correct_answer in each question
        const questionToSeed = {
          question: questionData.question,
          options: questionData.options,
          correct_answer: questionData.correct_answer, // Update field name here
          score: questionData.score,
          language,
        };

        await Question.create(questionToSeed);
      }
    }

    console.log(`Seeded ${language} questions.`);
  } catch (error) {
    console.error(`Error seeding ${language} questions:`, error);
  }
}

module.exports = db;
