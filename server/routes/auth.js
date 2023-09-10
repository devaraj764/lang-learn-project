require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

const secretKey = process.env.SECRET_KEY;

// User Sign-up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const isUser = await User.findOne({ email: email });
    if (isUser) return res.status(409).send({ error: 'User already exists' });
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error signing up user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User with email address not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Please Check your password and try again.' });
    }

    const token = jwt.sign({ id: user._id }, secretKey, {
      expiresIn: '30d',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
});

// Forgot Password (send email with token for password reset)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = jwt.sign({ id: user._id }, secretKey);

    // Send password reset email with the token here
    // Example: Use Nodemailer to send the email

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

// Protected Route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select('name email _id role')
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

module.exports = router;
