const Session = require('../models/Session');
const { addPointsToUser } = require('./pointsController');
const { createNotification } = require('./notificationController');

// @desc    Create a new session request
// @route   POST /api/sessions
const createSession = async (req, res) => {
  try {
    const { mentor, skill, message, date, time, mode } = req.body;

    if (!mentor || !skill || !date || !time) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (mentor === req.user.id) {
      return res.status(400).json({ message: 'You cannot book a session with yourself' });
    }

    const session = await Session.create({
      requester: req.user.id,
      mentor,
      skill,
      message,
      date,
      time,
      mode
    });

    const populatedSession = await Session.findById(session._id)
      .populate('requester', 'name email university')
      .populate('mentor', 'name email university');

    // Notify the mentor about the new session request
    await createNotification({
      recipient: mentor,
      sender: req.user.id,
      type: 'session_request',
      title: '📅 New Session Request',
      message: `${req.user.name} requested a session for "${skill}"`,
      link: '/sessions'
    });

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ requester: req.user.id }, { mentor: req.user.id }]
    })
      .populate('requester', 'name email university')
      .populate('mentor', 'name email university')
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id
const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isMentor = session.mentor.toString() === req.user.id;
    const isRequester = session.requester.toString() === req.user.id;

    if (!isMentor && !isRequester) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    session.status = status;
    // Create notification based on status change
    if (status === 'Accepted') {
      const notifyUser = session.requester.toString() === req.user.id ? session.mentor : session.requester;
      await createNotification({
        recipient: notifyUser,
        sender: req.user.id,
        type: 'session_accepted',
        title: '✅ Session Accepted',
        message: `Your session for "${session.skill}" has been accepted!`,
        link: '/sessions'
      });
    } else if (status === 'Rejected') {
      const notifyUser = session.requester.toString() === req.user.id ? session.mentor : session.requester;
      await createNotification({
        recipient: notifyUser,
        sender: req.user.id,
        type: 'session_rejected',
        title: '❌ Session Rejected',
        message: `Your session for "${session.skill}" was rejected`,
        link: '/sessions'
      });
    } else if (status === 'Completed') {
      const notifyUser = session.requester.toString() === req.user.id ? session.mentor : session.requester;
      await createNotification({
        recipient: notifyUser,
        sender: req.user.id,
        type: 'session_completed',
        title: '🎉 Session Completed',
        message: `Session for "${session.skill}" has been completed!`,
        link: '/sessions'
      });
    }
    await session.save();

    // Add points when session is completed
    if (status === 'Completed') {
      // Both users get +10 points for completing a session
      await addPointsToUser(session.requester, 10);
      await addPointsToUser(session.mentor, 10);
    }

    const updatedSession = await Session.findById(session._id)
      .populate('requester', 'name email university')
      .populate('mentor', 'name email university');

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isRequester = session.requester.toString() === req.user.id;
    if (!isRequester) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await session.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Session removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  getMySessions,
  updateSessionStatus,
  deleteSession
};