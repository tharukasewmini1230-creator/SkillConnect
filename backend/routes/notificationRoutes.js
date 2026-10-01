const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/notifications
router.get('/', protect, getMyNotifications);

// @route   GET /api/notifications/unread-count
router.get('/unread-count', protect, getUnreadCount);

// @route   PUT /api/notifications/read-all
router.put('/read-all', protect, markAllAsRead);

// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, markAsRead);

// @route   DELETE /api/notifications/:id
router.delete('/:id', protect, deleteNotification);

module.exports = router;