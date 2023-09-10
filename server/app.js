// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3001;
const verifyToken = require('./middleware/auth');
require('./db');

app.use(cors({
  origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Import and use the routes
const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');
const testsRoutes = require('./routes/tests');
const answersRoutes = require('./routes/answers');

app.use('/auth', authRoutes);
app.use('/questions', questionsRoutes);
app.use('/tests', verifyToken, testsRoutes);
app.use('/answers', answersRoutes);

app.get('/test', (req, res) => {
  res.send("API is working...!")
})

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
