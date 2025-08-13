const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { limit = 20, page = 1, search, role, isActive } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .populate('city', 'name state')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('city', 'name state')
      .populate('listings')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['user', 'premium', 'admin'])
    .withMessage('Role must be user, premium, or admin')
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

    const fieldsToUpdate = {};
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'isActive', 'isVerified', 'city', 'bio', 'dateOfBirth', 'gender'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Check if email is being updated and if it's already taken
    if (fieldsToUpdate.email) {
      const existingUser = await User.findOne({
        email: fieldsToUpdate.email,
        _id: { $ne: req.params.id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })
    .populate('city', 'name state')
    .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has active listings
    const Listing = require('../models/Listing');
    const activeListings = await Listing.countDocuments({
      user: req.params.id,
      status: 'active'
    });

    if (activeListings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active listings. Deactivate listings first.'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's public profile
// @route   GET /api/users/profile/:username
// @access  Public
router.get('/profile/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isActive: true
    })
    .populate('city', 'name state')
    .select('username firstName lastName avatar bio isVerified createdAt city');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's active listings count
    const Listing = require('../models/Listing');
    const activeListingsCount = await Listing.countDocuments({
      user: user._id,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    const userProfile = {
      ...user.toObject(),
      activeListingsCount
    };

    res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's public listings
// @route   GET /api/users/profile/:username/listings
// @access  Public
router.get('/profile/:username/listings', async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isActive: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const Listing = require('../models/Listing');
    const listings = await Listing.find({
      user: user._id,
      status: 'active',
      expiresAt: { $gt: new Date() }
    })
    .populate('category', 'name slug')
    .populate('city', 'name state')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Listing.countDocuments({
      user: user._id,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

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

// @desc    Deactivate user account
// @route   PATCH /api/users/:id/deactivate
// @access  Private (Admin only)
router.patch('/:id/deactivate', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    // Also deactivate all user's listings
    const Listing = require('../models/Listing');
    await Listing.updateMany(
      { user: req.params.id, status: 'active' },
      { status: 'suspended' }
    );

    res.status(200).json({
      success: true,
      message: 'User account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Activate user account
// @route   PATCH /api/users/:id/activate
// @access  Private (Admin only)
router.patch('/:id/activate', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account activated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify user
// @route   PATCH /api/users/:id/verify
// @access  Private (Admin only)
router.patch('/:id/verify', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User verified successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;