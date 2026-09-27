const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

module.exports = router;