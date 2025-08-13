const express = require('express');
const { body, validationResult, query } = require('express-validator');
const City = require('../models/City');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term must not be empty'),
  query('state').optional().isLength({ min: 1 }).withMessage('State must not be empty')
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
      limit = 50, 
      page = 1, 
      search, 
      state, 
      featured = false,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    let filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const cities = await City.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await City.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: cities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: cities
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured cities
// @route   GET /api/cities/featured
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const cities = await City.getFeatured(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get popular cities
// @route   GET /api/cities/popular
// @access  Public
router.get('/popular', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const cities = await City.getPopular(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get nearby cities
// @route   GET /api/cities/nearby
// @access  Public
router.get('/nearby', [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('distance').optional().isFloat({ min: 1, max: 1000 }).withMessage('Distance must be between 1 and 1000 km')
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

    const { latitude, longitude, distance = 100 } = req.query;
    const cities = await City.findNearby(
      parseFloat(latitude), 
      parseFloat(longitude), 
      parseFloat(distance)
    );
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single city
// @route   GET /api/cities/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get city by slug
// @route   GET /api/cities/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const city = await City.findOne({ slug: req.params.slug, isActive: true });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new city
// @route   POST /api/cities
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name is required and must be max 100 characters'),
  body('state')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('State is required and must be max 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Country must be max 100 characters'),
  body('coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('population')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Population must be a non-negative integer'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
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

    const city = await City.create(req.body);

    res.status(201).json({
      success: true,
      data: city
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be 1-100 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('State must be 1-100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Country must be 1-100 characters'),
  body('coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('population')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Population must be a non-negative integer'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
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

    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete city
// @route   DELETE /api/cities/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Check if city has active listings
    const Listing = require('../models/Listing');
    const activeListings = await Listing.countDocuments({ 
      city: req.params.id, 
      status: 'active' 
    });
    
    if (activeListings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete city with active listings'
      });
    }

    // Check if city has users
    const User = require('../models/User');
    const users = await User.countDocuments({ city: req.params.id });
    
    if (users > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete city with registered users'
      });
    }

    await city.deleteOne();

    res.status(200).json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;