const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('user', 'name email university')
      .sort({ createdAt: -1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name email university');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new skill post
// @route   POST /api/skills
const createSkill = async (req, res) => {
  try {
    const { title, description, category, type } = req.body;

    if (!title || !description || !category || !type) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const skill = await Skill.create({
      user: req.user.id,
      title,
      description,
      category,
      type
    });

    const populatedSkill = await Skill.findById(skill._id)
      .populate('user', 'name email university');

    res.status(201).json(populatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a skill post
// @route   PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // මේ skill post එක හදපු user මද කියලා බලනවා
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email university');

    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a skill post
// @route   DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // මේ skill post එක හදපු user මද කියලා බලනවා
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await skill.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
};