const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { username, name, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, name, mobile, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: { username, name, mobile, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      return res.status(500).json({ error: 'JWT secret or expiry is not set in environment variables.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { username: user.username, name: user.name, email: user.email, mobile: user.mobile }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};