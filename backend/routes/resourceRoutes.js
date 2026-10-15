const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  getMyResources,
  getPopularResources
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { resourceUpload } = require('../middleware/uploadMiddleware');

// ============================================
// PUBLIC ROUTES
// ============================================

// @route   GET /api/resources
// @desc    Get all resources (with filters)
router.get('/', getResources);

// @route   GET /api/resources/popular
// @desc    Get popular resources (top 6)
router.get('/popular', getPopularResources);

// ============================================
// PROTECTED ROUTES
// ============================================

// @route   GET /api/resources/my
// @desc    Get current user's resources
router.get('/my', protect, getMyResources);

// @route   POST /api/resources
// @desc    Upload new resource
router.post('/', protect, resourceUpload.single('file'), createResource);

// ============================================
// DYNAMIC ROUTES (must be LAST)
// ============================================

// @route   GET /api/resources/:id/download
// @desc    Download resource file
router.get('/:id/download', downloadResource);

// @route   GET /api/resources/:id
// @desc    Get single resource
router.get('/:id', getResourceById);

// @route   PUT /api/resources/:id
// @desc    Update resource
router.put('/:id', protect, updateResource);

// @route   DELETE /api/resources/:id
// @desc    Delete resource
router.delete('/:id', protect, deleteResource);

module.exports = router;