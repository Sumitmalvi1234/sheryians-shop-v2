const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);
      
      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email & explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
