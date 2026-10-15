const Resource = require('../models/Resource');
const fs = require('fs');
const path = require('path');

// @desc    Get all resources (public feed)
// @route   GET /api/resources
const getResources = async (req, res) => {
  try {
    const { category, skill, type, search } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (skill) {
      filter.skillTags = { $in: [new RegExp(skill, 'i')] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillTags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(filter)
      .populate('user', 'name university avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user', 'name university avatar');

    if (!resource || !resource.isActive) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload new resource
// @route   POST /api/resources
const createResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, description, category, type, skillTags } = req.body;

    // Validation
    if (!title || !description || !category) {
      // Delete the uploaded file if validation fails
      if (req.file.path) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Parse skillTags (can come as string or array)
    let parsedTags = [];
    if (skillTags) {
      if (Array.isArray(skillTags)) {
        parsedTags = skillTags.filter((t) => t.trim());
      } else {
        parsedTags = skillTags.split(',').map((t) => t.trim()).filter((t) => t);
      }
    }

    const resource = await Resource.create({
      user: req.user.id,
      title,
      description,
      category,
      type: type || 'Notes',
      skillTags: parsedTags,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/resources/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

    const populatedResource = await Resource.findById(resource._id)
      .populate('user', 'name university avatar');

    res.status(201).json(populatedResource);
  } catch (error) {
    // Cleanup file if DB error
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resource metadata (owner only)
// @route   PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, category, type, skillTags } = req.body;

    if (title !== undefined) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (category !== undefined) resource.category = category;
    if (type !== undefined) resource.type = type;
    if (skillTags !== undefined) {
      if (Array.isArray(skillTags)) {
        resource.skillTags = skillTags.filter((t) => t.trim());
      } else {
        resource.skillTags = skillTags.split(',').map((t) => t.trim()).filter((t) => t);
      }
    }

    const updatedResource = await resource.save();

    const populatedResource = await Resource.findById(updatedResource._id)
      .populate('user', 'name university avatar');

    res.status(200).json(populatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resource (owner only)
// @route   DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '..', resource.file.path);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await resource.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download resource (increments counter + serves file)
// @route   GET /api/resources/:id/download
const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource || !resource.isActive) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    // Construct file path
    const filePath = path.join(__dirname, '..', resource.file.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Send file with original name
    res.download(filePath, resource.file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my resources
// @route   GET /api/resources/my
const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular resources (top 6 by downloads)
// @route   GET /api/resources/popular
const getPopularResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true })
      .populate('user', 'name university avatar')
      .sort({ downloads: -1 })
      .limit(6);

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  getMyResources,
  getPopularResources
};