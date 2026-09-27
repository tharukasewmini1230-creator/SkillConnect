const User = require('../models/User');
const Session = require('../models/Session');

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

// @desc    Get top mentors (users with most completed sessions as mentor)
// @route   GET /api/points/top-mentors
const getTopMentors = async (req, res) => {
  try {
    // Aggregate sessions to count completed sessions per mentor
    const mentors = await Session.aggregate([
      {
        $match: { status: 'Completed' }
      },
      {
        $group: {
          _id: '$mentor',
          completedSessions: { $sum: 1 }
        }
      },
      {
        $sort: { completedSessions: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Populate user details
    const mentorDetails = await Promise.all(
      mentors.map(async (m) => {
        const user = await User.findById(m._id).select('name university points');
        if (!user) return null;
        return {
          _id: user._id,
          name: user.name,
          university: user.university,
          points: user.points,
          completedSessions: m.completedSessions
        };
      })
    );

    // Filter out null values
    const filteredMentors = mentorDetails.filter((m) => m !== null);

    res.status(200).json(filteredMentors);
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
  getTopMentors,
  addPointsToUser
};