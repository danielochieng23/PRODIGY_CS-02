const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['country', 'state', 'city', 'area'],
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  timezone: {
    type: String,
    trim: true
  },
  population: {
    type: Number,
    min: 0
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
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  adCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
locationSchema.index({ slug: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ parent: 1 });
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ isFeatured: 1, sortOrder: 1 });

// Virtual for child locations
locationSchema.virtual('children', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'parent'
});

// Method to get full location path
locationSchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current = this;
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current.name);
    }
  }
  
  return path.join(', ');
};

// Static method to find nearby locations
locationSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

module.exports = mongoose.model('Location', locationSchema);