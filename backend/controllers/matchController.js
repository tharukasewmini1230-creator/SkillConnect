const User = require('../models/User');

// @desc    Find skill exchange matches for the logged-in user
// @route   GET /api/match
const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allUsers = await User.find({ _id: { $ne: currentUser._id } });

    const matches = allUsers
      .map((otherUser) => {
        const myOffered = (currentUser.skillsOffered || []).map((s) => s.toLowerCase().trim());
        const myWanted = (currentUser.skillsWanted || []).map((s) => s.toLowerCase().trim());
        const theirOffered = (otherUser.skillsOffered || []).map((s) => s.toLowerCase().trim());
        const theirWanted = (otherUser.skillsWanted || []).map((s) => s.toLowerCase().trim());

        const theyCanTeachMe = theirOffered.filter((skill) => myWanted.includes(skill));
        const iCanTeachThem = myOffered.filter((skill) => theirWanted.includes(skill));

        const isPerfectMatch = theyCanTeachMe.length > 0 && iCanTeachThem.length > 0;
        const totalMatchedSkills = theyCanTeachMe.length + iCanTeachThem.length;

        let matchScore = 0;
        if (isPerfectMatch) {
          matchScore = Math.min(100, 60 + totalMatchedSkills * 15);
        } else if (totalMatchedSkills > 0) {
          matchScore = Math.min(50, totalMatchedSkills * 20);
        }

        return {
          user: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
            university: otherUser.university,
            skillsOffered: otherUser.skillsOffered,
            skillsWanted: otherUser.skillsWanted
          },
          theyCanTeachMe,
          iCanTeachThem,
          isPerfectMatch,
          matchScore,
          totalMatchedSkills
        };
      })
      .filter((match) => match.totalMatchedSkills > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches };