const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/skills  (ඔක්කොම skills බලන්න - login වෙන්න ඕන නෑ)
// @route   POST /api/skills  (අලුත් skill එකක් හදන්න - login වෙන්න ඕන)
router
  .route('/')
  .get(getSkills)
  .post(protect, createSkill);

// @route   GET /api/skills/:id  (එක skill එකක් බලන්න)
// @route   PUT /api/skills/:id  (skill එකක් update කරන්න - login වෙන්න ඕන)
// @route   DELETE /api/skills/:id  (skill එකක් delete කරන්න - login වෙන්න ඕන)
router
  .route('/:id')
  .get(getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;