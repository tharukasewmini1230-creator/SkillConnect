const User = require('../models/User');
const Session = require('../models/Session');
const Review = require('../models/Review');

// @desc    Get achievements for logged-in user
// @route   GET /api/achievements
const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user
    const user = await User.findById(userId);

    // Count only skills user can TEACH (skillsOffered)
    const skillsCount = user?.skillsOffered?.length || 0;

    // Count completed sessions
    const sessionsAsRequester = await Session.countDocuments({
      requester: userId,
      status: 'Completed'
    });
    const sessionsAsMentor = await Session.countDocuments({
      mentor: userId,
      status: 'Completed'
    });
    const totalSessions = sessionsAsRequester + sessionsAsMentor;
    const reviewsReceived = await Review.countDocuments({ reviewee: userId });

    // Define all achievements
    const allAchievements = [
      {
        key: 'first_skill',
        icon: '🌱',
        title: 'First Skill',
        description: 'Add your first skill to your profile',
        color: '#10B981',
        unlocked: skillsCount >= 1,
        progress: Math.min(skillsCount, 1),
        goal: 1
      },
      {
        key: 'skill_master',
        icon: '🎓',
        title: 'Skill Master',
        description: 'Add 5 skills to your profile',
        color: '#3B82F6',
        unlocked: skillsCount >= 5,
        progress: Math.min(skillsCount, 5),
        goal: 5
      },
      {
        key: 'first_session',
        icon: '🎯',
        title: 'First Session',
        description: 'Complete your first learning session',
        color: '#A855F7',
        unlocked: totalSessions >= 1,
        progress: Math.min(totalSessions, 1),
        goal: 1
      },
      {
        key: 'ten_sessions',
        icon: '🏆',
        title: '10 Sessions',
        description: 'Complete 10 learning sessions as a learner',
        color: '#F59E0B',
        unlocked: sessionsAsRequester >= 10,
        progress: Math.min(sessionsAsRequester, 10),
        goal: 10
      },
      {
        key: 'top_mentor',
        icon: '⭐',
        title: 'Top Mentor',
        description: 'Complete 5 sessions as a mentor',
        color: '#EF4444',
        unlocked: sessionsAsMentor >= 5,
        progress: Math.min(sessionsAsMentor, 5),
        goal: 5
      },
      {
        key: 'community_helper',
        icon: '🤝',
        title: 'Community Helper',
        description: 'Receive 3 reviews from other students',
        color: '#EC4899',
        unlocked: reviewsReceived >= 3,
        progress: Math.min(reviewsReceived, 3),
        goal: 3
      }
    ];

    const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
    const totalCount = allAchievements.length;
    const completionPercent = Math.round((unlockedCount / totalCount) * 100);

    res.status(200).json({
      achievements: allAchievements,
      unlockedCount,
      totalCount,
      completionPercent,
      stats: {
        skillsCount,
        sessionsAsRequester,
        sessionsAsMentor,
        totalSessions,
        reviewsReceived
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get achievements for a specific user (public)
// @route   GET /api/achievements/user/:userId
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count only skills user can TEACH (skillsOffered)
    const skillsCount = user?.skillsOffered?.length || 0;

    const sessionsAsRequester = await Session.countDocuments({
      requester: userId,
      status: 'Completed'
    });
    const sessionsAsMentor = await Session.countDocuments({
      mentor: userId,
      status: 'Completed'
    });
    const totalSessions = sessionsAsRequester + sessionsAsMentor;
    const reviewsReceived = await Review.countDocuments({ reviewee: userId });

    const allAchievements = [
      { key: 'first_skill', icon: '🌱', title: 'First Skill', description: 'Add first skill', color: '#10B981', unlocked: skillsCount >= 1 },
      { key: 'skill_master', icon: '🎓', title: 'Skill Master', description: 'Add 5 skills', color: '#3B82F6', unlocked: skillsCount >= 5 },
      { key: 'first_session', icon: '🎯', title: 'First Session', description: 'Complete first session', color: '#A855F7', unlocked: totalSessions >= 1 },
      { key: 'ten_sessions', icon: '🏆', title: '10 Sessions', description: 'Complete 10 learning sessions as a learner', color: '#F59E0B', unlocked: sessionsAsRequester >= 10 },
      { key: 'top_mentor', icon: '⭐', title: 'Top Mentor', description: '5 sessions as mentor', color: '#EF4444', unlocked: sessionsAsMentor >= 5 },
      { key: 'community_helper', icon: '🤝', title: 'Community Helper', description: 'Receive 3 reviews', color: '#EC4899', unlocked: reviewsReceived >= 3 }
    ];

    const unlockedCount = allAchievements.filter((a) => a.unlocked).length;

    res.status(200).json({
      achievements: allAchievements,
      unlockedCount,
      totalCount: allAchievements.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAchievements,
  getUserAchievements
};