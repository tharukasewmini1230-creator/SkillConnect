const express = require('express');
const router = express.Router();
const {
  getMyPoints,
  getLeaderboard
} = require('../controllers/pointsController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/points/me
router.get('/me', protect, getMyPoints);

// @route   GET /api/points/leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;