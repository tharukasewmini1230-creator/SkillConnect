const express = require('express');
const router = express.Router();
const {
  createSession,
  getMySessions,
  updateSessionStatus,
  deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET  /api/sessions
// @route   POST /api/sessions
router
  .route('/')
  .get(protect, getMySessions)
  .post(protect, createSession);

// @route   PUT    /api/sessions/:id
// @route   DELETE /api/sessions/:id
router
  .route('/:id')
  .put(protect, updateSessionStatus)
  .delete(protect, deleteSession);

module.exports = router;