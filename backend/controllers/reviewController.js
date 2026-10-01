const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');
const { addPointsToUser } = require('./pointsController');
const { createNotification } = require('./notificationController');

// @desc    Create a review for a completed session
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating || !comment) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only review completed sessions' });
    }

    // Determine who is being reviewed
    const isRequester = session.requester.toString() === req.user.id;
    const isMentor = session.mentor.toString() === req.user.id;

    if (!isRequester && !isMentor) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const reviewee = isRequester ? session.mentor : session.requester;

    // Check if already reviewed
    const existingReview = await Review.findOne({
      session: sessionId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user.id,
      reviewee,
      rating,
      comment
    });

    // Add bonus points if 5-star review
    if (rating === 5) {
      await addPointsToUser(reviewee, 5);
    }

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name email university')
      .populate('reviewee', 'name email university');

    // Notify the reviewee about the new review
    await createNotification({
      recipient: reviewee,
      sender: req.user.id,
      type: 'new_review',
      title: `⭐ New ${rating}-Star Review`,
      message: `${req.user.name} left you a review: "${comment.substring(0, 60)}${comment.length > 60 ? '...' : ''}"`,
      link: '/profile'
    });

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a user (as reviewee)
// @route   GET /api/reviews/user/:userId
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name university')
      .populate('session', 'skill date time')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    res.status(200).json({
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user has reviewed a specific session
// @route   GET /api/reviews/check/:sessionId
const checkReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      session: req.params.sessionId,
      reviewer: req.user.id
    });

    res.status(200).json({ hasReviewed: !!review, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  checkReview
};