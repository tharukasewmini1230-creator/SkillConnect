const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware - Login වෙච්ච users ලට විතරක් access දෙනවා
const protect = async (req, res, next) => {
  let token;

  // Header එකේ "Bearer <token>" කියලා token එකක් තියෙනවද බලනවා
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token එක වෙන් කරලා ගන්නවා ("Bearer " කොටස අයින් කරලා)
      token = req.headers.authorization.split(' ')[1];

      // Token එක verify කරනවා
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token එකේ id එකෙන් user ව database එකෙන් හොයනවා (password එක හැර)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };