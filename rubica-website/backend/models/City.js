const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide city name'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  state: {
    type: String,
    required: [true, 'Please provide state name'],
    trim: true,
    maxlength: [100, 'State name cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Please provide country name'],
    trim: true,
    default: 'India',
    maxlength: [100, 'Country name cannot exceed 100 characters']
  },
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  population: {
    type: Number,
    min: [0, 'Population cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metadata: {
    area: {
      type: Number, // in square kilometers
      min: [0, 'Area cannot be negative']
    },
    postalCodes: [{
      type: String,
      trim: true
    }],
    districts: [{
      name: {
        type: String,
        trim: true
      },
      slug: {
        type: String,
        lowercase: true
      }
    }],
    nearbyAirports: [{
      name: String,
      code: String,
      distance: Number // in kilometers
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full location
citySchema.virtual('fullLocation').get(function() {
  return `${this.name}, ${this.state}, ${this.country}`;
});

// Virtual for listings count
citySchema.virtual('listingsCount', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'city',
  count: true
});

// Virtual for users count
citySchema.virtual('usersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'city',
  count: true
});

// Create compound index for unique city-state combination
citySchema.index({ name: 1, state: 1 }, { unique: true });

// Create geospatial index for location-based queries
citySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Pre-save middleware to generate slug
citySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('state')) {
    this.slug = `${this.name}-${this.state}`
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Static method to find nearby cities
citySchema.statics.findNearby = async function(latitude, longitude, maxDistance = 100) {
  return this.find({
    isActive: true,
    'coordinates.latitude': {
      $gte: latitude - (maxDistance / 111), // Rough conversion: 1 degree ≈ 111 km
      $lte: latitude + (maxDistance / 111)
    },
    'coordinates.longitude': {
      $gte: longitude - (maxDistance / (111 * Math.cos(latitude * Math.PI / 180))),
      $lte: longitude + (maxDistance / (111 * Math.cos(latitude * Math.PI / 180)))
    }
  }).sort('name');
};

// Static method to get featured cities
citySchema.statics.getFeatured = async function(limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort('sortOrder name')
    .limit(limit);
};

// Static method to get popular cities by listings count
citySchema.statics.getPopular = async function(limit = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'listings',
        localField: '_id',
        foreignField: 'city',
        as: 'listings'
      }
    },
    {
      $project: {
        name: 1,
        state: 1,
        slug: 1,
        listingsCount: { $size: '$listings' }
      }
    },
    { $sort: { listingsCount: -1, name: 1 } },
    { $limit: limit }
  ]);
};

// Instance method to calculate distance to another city
citySchema.methods.distanceTo = function(otherCity) {
  if (!this.coordinates.latitude || !this.coordinates.longitude ||
      !otherCity.coordinates.latitude || !otherCity.coordinates.longitude) {
    return null;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = (otherCity.coordinates.latitude - this.coordinates.latitude) * Math.PI / 180;
  const dLng = (otherCity.coordinates.longitude - this.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.coordinates.latitude * Math.PI / 180) *
    Math.cos(otherCity.coordinates.latitude * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

module.exports = mongoose.model('City', citySchema);