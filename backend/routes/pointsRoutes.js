const express = require('express');
const router = express.Router();
const {
  getMyPoints,
  getLeaderboard,
  getTopMentors
} = require('../controllers/pointsController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/points/me
router.get('/me', protect, getMyPoints);

// @route   GET /api/points/leaderboard
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/points/top-mentors
router.get('/top-mentors', getTopMentors);

module.exports = router;