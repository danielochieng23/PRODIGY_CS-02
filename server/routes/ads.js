const express = require('express');
const { body, validationResult } = require('express-validator');
const Ad = require('../models/Ad');
const Category = require('../models/Category');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all ads with filters
// @route   GET /api/ads
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      city,
      state,
      country,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      priority
    } = req.query;

    const filters = {
      status: 'active',
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(minPrice && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      ...(search && { search }),
      ...(priority && { priority })
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };

    const ads = await Ad.getFilteredAds(filters, options);
    const total = await Ad.countDocuments(filters);

    res.json({
      success: true,
      data: {
        ads,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('category', 'name slug color')
      .populate('subcategory', 'name slug')
      .populate('user', 'username firstName lastName avatar');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Increment views (only if not the owner)
    if (!req.user || ad.user._id.toString() !== req.user.id) {
      await ad.incrementViews();
    }

    res.json({
      success: true,
      data: { ad }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category').isMongoId().withMessage('Valid category ID required'),
  body('contact.name').trim().isLength({ min: 2 }).withMessage('Contact name is required'),
  body('location.city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('location.country').trim().isLength({ min: 2 }).withMessage('Country is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Create ad
    const ad = await Ad.create({
      ...req.body,
      user: req.user.id
    });

    await ad.populate('category', 'name slug color');
    await ad.populate('user', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: { ad }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ad'
      });
    }

    ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug color');

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: { ad }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this ad'
      });
    }

    await Ad.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's ads
// @route   GET /api/ads/user/my-ads
// @access  Private
router.get('/user/my-ads', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const ads = await Ad.find(query)
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Ad.countDocuments(query);

    res.json({
      success: true,
      data: {
        ads,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle favorite ad
// @route   POST /api/ads/:id/favorite
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    const isFavorited = ad.favorites.includes(req.user.id);

    if (isFavorited) {
      ad.favorites = ad.favorites.filter(id => id.toString() !== req.user.id);
    } else {
      ad.favorites.push(req.user.id);
    }

    await ad.save();

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      data: { 
        favorited: !isFavorited,
        favoriteCount: ad.favoriteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;