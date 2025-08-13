const express = require('express');
const Location = require('../models/Location');

const router = express.Router();

// @route   GET /api/locations
// @desc    Get all locations with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, parent, featured } = req.query;
    
    const filters = { isActive: true };
    if (type) filters.type = type;
    if (parent) filters.parent = parent;
    if (featured === 'true') filters.isFeatured = true;

    const locations = await Location.find(filters)
      .populate('parent', 'name slug type')
      .sort({ isFeatured: -1, sortOrder: 1, name: 1 });

    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error while fetching locations' });
  }
});

// @route   GET /api/locations/:slug
// @desc    Get location by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const location = await Location.findOne({ slug: req.params.slug, isActive: true })
      .populate('parent', 'name slug type')
      .populate('children', 'name slug type adCount');

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ location });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error while fetching location' });
  }
});

module.exports = router;