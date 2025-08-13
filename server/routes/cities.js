const express = require('express');
const Ad = require('../models/Ad');

const router = express.Router();

// @desc    Get popular cities
// @route   GET /api/cities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cities = await Ad.aggregate([
      { $match: { status: 'active' } },
      { 
        $group: { 
          _id: { 
            city: '$location.city', 
            state: '$location.state', 
            country: '$location.country' 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state',
          country: '$_id.country',
          adCount: '$count'
        }
      }
    ]);

    res.json({
      success: true,
      data: { cities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Search cities
// @route   GET /api/cities/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { cities: [] }
      });
    }

    const cities = await Ad.aggregate([
      { $match: { 
        status: 'active',
        'location.city': { $regex: q, $options: 'i' }
      }},
      { 
        $group: { 
          _id: { 
            city: '$location.city', 
            state: '$location.state', 
            country: '$location.country' 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state',
          country: '$_id.country',
          adCount: '$count'
        }
      }
    ]);

    res.json({
      success: true,
      data: { cities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;