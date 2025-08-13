const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult, query } = require('express-validator');
const Ad = require('../models/Ad');
const Category = require('../models/Category');
const Location = require('../models/Location');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/ads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// @route   GET /api/ads
// @desc    Get ads with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('location').optional().isMongoId().withMessage('Invalid location ID'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search query too long'),
  query('sortBy').optional().isIn(['createdAt', 'lastBumped', 'views', 'price']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      location,
      search,
      sortBy = 'lastBumped',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      isPremium,
      isFeatured
    } = req.query;

    const filters = {
      status: 'active',
      expiresAt: { $gt: new Date() }
    };

    // Add filters
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (isPremium === 'true') filters.isPremium = true;
    if (isFeatured === 'true') filters.isFeatured = true;

    // Price range filter
    if (minPrice || maxPrice) {
      filters['pricing.hourly'] = {};
      if (minPrice) filters['pricing.hourly'].$gte = parseFloat(minPrice);
      if (maxPrice) filters['pricing.hourly'].$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filters.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    }
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [ads, totalCount] = await Promise.all([
      Ad.find(filters)
        .populate('category', 'name slug')
        .populate('location', 'name slug type')
        .populate('user', 'username')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Ad.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      ads,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ message: 'Server error while fetching ads' });
  }
});

// @route   GET /api/ads/:id
// @desc    Get single ad by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('location', 'name slug type')
      .populate('user', 'username firstName lastName');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.status !== 'active' || ad.expiresAt <= new Date()) {
      return res.status(404).json({ message: 'Ad not available' });
    }

    // Increment views (but not for the ad owner)
    if (!req.user || !ad.user._id.equals(req.user._id)) {
      ad.views += 1;
      await ad.save();
    }

    res.json({ ad });

  } catch (error) {
    console.error('Get ad error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ad ID' });
    }
    res.status(500).json({ message: 'Server error while fetching ad' });
  }
});

// @route   POST /api/ads
// @desc    Create new ad
// @access  Private
router.post('/', auth, upload.array('images', 10), [
  body('title')
    .notEmpty()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .notEmpty()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isMongoId()
    .withMessage('Valid category is required'),
  body('location')
    .isMongoId()
    .withMessage('Valid location is required'),
  body('contact.name')
    .notEmpty()
    .trim()
    .withMessage('Contact name is required'),
  body('contact.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      category,
      subcategory,
      location,
      contact,
      pricing,
      details
    } = req.body;

    // Verify category and location exist
    const [categoryDoc, locationDoc] = await Promise.all([
      Category.findById(category),
      Location.findById(location)
    ]);

    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }

    if (!locationDoc) {
      return res.status(400).json({ message: 'Location not found' });
    }

    // Process uploaded images
    const images = req.files ? req.files.map((file, index) => ({
      url: `/uploads/ads/${file.filename}`,
      alt: `${title} - Image ${index + 1}`,
      isPrimary: index === 0
    })) : [];

    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingAd = await Ad.findOne({ slug });
    if (existingAd) {
      slug += '-' + Date.now();
    }

    // Create ad
    const ad = new Ad({
      title,
      description,
      slug,
      category,
      subcategory: subcategory || null,
      location,
      user: req.user._id,
      images,
      contact,
      pricing: pricing || {},
      details: details || {},
      status: 'active'
    });

    await ad.save();

    // Update category and location ad counts
    await Promise.all([
      Category.findByIdAndUpdate(category, { $inc: { adCount: 1 } }),
      Location.findByIdAndUpdate(location, { $inc: { adCount: 1 } })
    ]);

    const populatedAd = await Ad.findById(ad._id)
      .populate('category', 'name slug')
      .populate('location', 'name slug type');

    res.status(201).json({
      message: 'Ad created successfully',
      ad: populatedAd
    });

  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ message: 'Server error while creating ad' });
  }
});

// @route   PUT /api/ads/:id
// @desc    Update ad
// @access  Private (Owner only)
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check ownership
    if (!ad.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this ad' });
    }

    const allowedFields = ['title', 'description', 'contact', 'pricing', 'details'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update slug if title changed
    if (updates.title) {
      updates.slug = generateSlug(updates.title);
      const existingAd = await Ad.findOne({ slug: updates.slug, _id: { $ne: ad._id } });
      if (existingAd) {
        updates.slug += '-' + Date.now();
      }
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name slug').populate('location', 'name slug type');

    res.json({
      message: 'Ad updated successfully',
      ad: updatedAd
    });

  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ message: 'Server error while updating ad' });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete ad
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check ownership
    if (!ad.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this ad' });
    }

    // Soft delete - just update status
    ad.status = 'deleted';
    await ad.save();

    // Update category and location ad counts
    await Promise.all([
      Category.findByIdAndUpdate(ad.category, { $inc: { adCount: -1 } }),
      Location.findByIdAndUpdate(ad.location, { $inc: { adCount: -1 } })
    ]);

    res.json({ message: 'Ad deleted successfully' });

  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ message: 'Server error while deleting ad' });
  }
});

// @route   POST /api/ads/:id/contact
// @desc    Record contact attempt
// @access  Public
router.post('/:id/contact', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.status !== 'active' || ad.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Ad not available' });
    }

    // Don't count contacts from the ad owner
    if (!req.user || !ad.user.equals(req.user._id)) {
      ad.contacts += 1;
      await ad.save();
    }

    res.json({ message: 'Contact recorded' });

  } catch (error) {
    console.error('Record contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ads/user/my-ads
// @desc    Get current user's ads
// @access  Private
router.get('/user/my-ads', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'active', 'paused', 'expired', 'blocked', 'deleted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const filters = { user: req.user._id };
    if (status) filters.status = status;

    const skip = (page - 1) * limit;

    const [ads, totalCount] = await Promise.all([
      Ad.find(filters)
        .populate('category', 'name slug')
        .populate('location', 'name slug type')
        .sort({ lastBumped: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Ad.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      ads,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user ads error:', error);
    res.status(500).json({ message: 'Server error while fetching user ads' });
  }
});

module.exports = router;