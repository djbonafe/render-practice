const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Create token (expires in 1 hour here)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send back userId, token, and expiration
  res.json({
    userId: user._id,
    token,
    expiration: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
  });
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    name,
    email,
    passwordHash,
  });

  try {
    const savedUser = await newUser.save();

    // Optionally, generate a token on signup too
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      userId: savedUser._id,
      token,
      expiration: new Date(Date.now() + 3600000).toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Signing up failed. Please try again later.' });
  }
};
