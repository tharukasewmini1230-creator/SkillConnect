const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  checkReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/reviews
router.post('/', protect, createReview);

// @route   GET /api/reviews/user/:userId
router.get('/user/:userId', getUserReviews);

// @route   GET /api/reviews/check/:sessionId
router.get('/check/:sessionId', protect, checkReview);

module.exports = router;