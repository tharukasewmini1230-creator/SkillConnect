const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
  setPassword,
  uploadAvatar,
  deleteAvatar
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { avatarUpload } = require('../middleware/uploadMiddleware');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/google
router.post('/google', googleLogin);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

// @route   POST /api/auth/set-password
router.post('/set-password', protect, setPassword);

// @route   POST /api/auth/upload-avatar
router.post('/upload-avatar', protect, avatarUpload.single('avatar'), uploadAvatar);

// @route   DELETE /api/auth/avatar
router.delete('/avatar', protect, deleteAvatar);

module.exports = router;