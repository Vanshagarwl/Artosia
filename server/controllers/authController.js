const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { username, name, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, name, mobile, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: { username, name, mobile, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
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