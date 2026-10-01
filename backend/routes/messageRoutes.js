const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/messages
router.post('/', protect, sendMessage);

// @route   GET /api/messages/conversations
router.get('/conversations', protect, getConversations);

// @route   GET /api/messages/unread-count
router.get('/unread-count', protect, getUnreadCount);

// @route   GET /api/messages/conversation/:userId
router.get('/conversation/:userId', protect, getConversation);

module.exports = router;