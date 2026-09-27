const User = require('../models/User');

// @desc    Get current user's points
// @route   GET /api/points/me
const getMyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      points: user.points,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard (top users by points)
// @route   GET /api/points/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name university points')
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to add points to a user
// This is not exposed as an API, it's used internally by other controllers
const addPointsToUser = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.points = (user.points || 0) + points;
    await user.save();
    return user.points;
  } catch (error) {
    console.error('Error adding points:', error);
    return null;
  }
};

module.exports = {
  getMyPoints,
  getLeaderboard,
  addPointsToUser
};