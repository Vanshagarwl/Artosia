const User = require('../models/User');

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