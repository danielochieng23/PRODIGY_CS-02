const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username,
      isActive: true 
    }).select('-email -phone');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;