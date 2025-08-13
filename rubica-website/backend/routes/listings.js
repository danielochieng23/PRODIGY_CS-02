const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Listing = require('../models/Listing');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all listings with search/filter
// @route   GET /api/listings
// @access  Public
router.get('/', optionalAuth, [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term must not be empty'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      limit = 20,
      page = 1,
      search,
      category,
      city,
      minPrice,
      maxPrice,
      gender,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    const options = {
      category,
      city,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      gender,
      limit: parseInt(limit),
      skip,
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1
    };

    const listings = await Listing.search(search, options);
    
    // Count total for pagination
    let countFilter = {
      status: 'active',
      expiresAt: { $gt: new Date() }
    };
    
    if (search) countFilter.$text = { $search: search };
    if (category) countFilter.category = category;
    if (city) countFilter.city = city;
    if (gender) countFilter['attributes.gender'] = gender;
    if (minPrice || maxPrice) {
      countFilter['pricing.price'] = {};
      if (minPrice) countFilter['pricing.price'].$gte = parseFloat(minPrice);
      if (maxPrice) countFilter['pricing.price'].$lte = parseFloat(maxPrice);
    }

    const total = await Listing.countDocuments(countFilter);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: listings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const { limit = 10, category, city } = req.query;
    
    let filter = {
      status: 'active',
      expiresAt: { $gt: new Date() },
      'promotion.isFeatured': true,
      'promotion.featuredUntil': { $gt: new Date() }
    };
    
    if (category) filter.category = category;
    if (city) filter.city = city;

    const listings = await Listing.find(filter)
      .populate('user', 'username firstName lastName avatar')
      .populate('category', 'name slug')
      .populate('city', 'name state')
      .sort({ 'promotion.featuredUntil': -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('user', 'username firstName lastName avatar isVerified')
      .populate('category', 'name slug')
      .populate('city', 'name state');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is active or user owns it
    if (listing.status !== 'active' && (!req.user || listing.user._id.toString() !== req.user.id)) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment views (only if not the owner)
    if (!req.user || listing.user._id.toString() !== req.user.id) {
      await listing.incrementViews();
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get listing by slug
// @route   GET /api/listings/slug/:slug
// @access  Public
router.get('/slug/:slug', optionalAuth, async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug })
      .populate('user', 'username firstName lastName avatar isVerified')
      .populate('category', 'name slug')
      .populate('city', 'name state');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is active or user owns it
    if (listing.status !== 'active' && (!req.user || listing.user._id.toString() !== req.user.id)) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment views (only if not the owner)
    if (!req.user || listing.user._id.toString() !== req.user.id) {
      await listing.incrementViews();
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
router.post('/', protect, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be 5-200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be 20-2000 characters'),
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category'),
  body('city')
    .isMongoId()
    .withMessage('Please provide a valid city'),
  body('pricing.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  body('contactInfo.phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('attributes.age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user to listing
    req.body.user = req.user.id;

    const listing = await Listing.create(req.body);
    
    // Populate the created listing
    await listing.populate('user', 'username firstName lastName avatar');
    await listing.populate('category', 'name slug');
    await listing.populate('city', 'name state');

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be 5-200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be 20-2000 characters'),
  body('pricing.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  body('contactInfo.phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('attributes.age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership or admin
    if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .populate('user', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .populate('city', 'name state');

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership or admin
    if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's listings
// @route   GET /api/listings/user/me
// @access  Private
router.get('/user/me', protect, async (req, res, next) => {
  try {
    const { limit = 20, page = 1, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = { user: req.user.id };
    if (status) filter.status = status;

    const listings = await Listing.find(filter)
      .populate('category', 'name slug')
      .populate('city', 'name state')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: listings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Activate/Deactivate listing
// @route   PATCH /api/listings/:id/status
// @access  Private
router.patch('/:id/status', protect, [
  body('status')
    .isIn(['active', 'paused', 'draft'])
    .withMessage('Status must be active, paused, or draft')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership or admin
    if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    listing.status = req.body.status;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get contact info (increment contact views)
// @route   GET /api/listings/:id/contact
// @access  Public
router.get('/:id/contact', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing || listing.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment contact views
    await listing.incrementContactViews();

    res.status(200).json({
      success: true,
      data: {
        phone: listing.contactInfo.phone,
        email: listing.contactInfo.email,
        whatsapp: listing.contactInfo.whatsapp
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;