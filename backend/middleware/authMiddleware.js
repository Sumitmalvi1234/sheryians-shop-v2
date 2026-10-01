const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split the "Bearer <token>" string to extract only the token part
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token using your secret key
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Fetch the user details from the database using the token ID and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to the controller function safely
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed verification' });
    }
  }

  // If no token is provided in headers
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token found' });
  }
};
