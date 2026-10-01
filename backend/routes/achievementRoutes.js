const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getUserAchievements
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/achievements
router.get('/', protect, getAchievements);

// @route   GET /api/achievements/user/:userId
router.get('/user/:userId', getUserAchievements);

module.exports = router;