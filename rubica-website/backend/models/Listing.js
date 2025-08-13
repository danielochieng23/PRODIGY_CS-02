const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide listing title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide listing description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Listing must belong to a user']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
    required: [true, 'Please provide a city']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [100, 'Image caption cannot exceed 100 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  }],
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    whatsapp: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  pricing: {
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly', 'daily', 'negotiable', 'free'],
      default: 'fixed'
    },
    minPrice: {
      type: Number,
      min: [0, 'Minimum price cannot be negative']
    },
    maxPrice: {
      type: Number,
      min: [0, 'Maximum price cannot be negative']
    }
  },
  location: {
    address: {
      type: String,
      maxlength: [300, 'Address cannot exceed 300 characters']
    },
    landmark: {
      type: String,
      maxlength: [100, 'Landmark cannot exceed 100 characters']
    },
    area: {
      type: String,
      maxlength: [100, 'Area cannot exceed 100 characters']
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
    }
  },
  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    hours: {
      from: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
      },
      to: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
      }
    },
    is24Hours: {
      type: Boolean,
      default: false
    },
    isAlwaysAvailable: {
      type: Boolean,
      default: false
    }
  },
  attributes: {
    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'transgender', 'other']
    },
    ethnicity: {
      type: String,
      maxlength: [50, 'Ethnicity cannot exceed 50 characters']
    },
    bodyType: {
      type: String,
      enum: ['slim', 'average', 'athletic', 'curvy', 'plus-size']
    },
    height: {
      type: String,
      maxlength: [20, 'Height cannot exceed 20 characters']
    },
    languages: [{
      type: String,
      trim: true
    }],
    services: [{
      type: String,
      trim: true
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'expired', 'suspended', 'deleted'],
    default: 'draft'
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  engagement: {
    views: {
      type: Number,
      default: 0
    },
    contactViews: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  promotion: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    featuredUntil: {
      type: Date
    },
    premiumUntil: {
      type: Date
    },
    boostUntil: {
      type: Date
    }
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
listingSchema.index({ user: 1, status: 1 });
listingSchema.index({ category: 1, city: 1, status: 1 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ 'promotion.isFeatured': 1, createdAt: -1 });
listingSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
listingSchema.index({ expiresAt: 1 });

// Text index for search functionality
listingSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  'seo.keywords': 'text',
  'attributes.services': 'text'
});

// Virtual for primary image
listingSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for formatted price
listingSchema.virtual('formattedPrice').get(function() {
  if (!this.pricing.price) return 'Contact for price';
  
  const price = this.pricing.price;
  const currency = this.pricing.currency || 'INR';
  const type = this.pricing.priceType || 'fixed';
  
  let formatted = `${currency} ${price.toLocaleString()}`;
  
  if (type !== 'fixed') {
    formatted += ` (${type})`;
  }
  
  return formatted;
});

// Virtual for time since posted
listingSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now - this.createdAt;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Pre-save middleware to generate slug and update lastModified
listingSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
  }
  
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  
  // Generate short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 297) + '...';
  }
  
  // Set SEO fields if not provided
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 57) + '...';
  }
  
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.shortDescription || this.description.substring(0, 157) + '...';
  }
  
  next();
});

// Static method to find active listings
listingSchema.statics.findActive = function(filter = {}) {
  return this.find({
    ...filter,
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

// Static method to search listings
listingSchema.statics.search = function(query, options = {}) {
  const {
    category,
    city,
    minPrice,
    maxPrice,
    gender,
    age,
    limit = 20,
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  let filter = {
    status: 'active',
    expiresAt: { $gt: new Date() }
  };
  
  if (query) {
    filter.$text = { $search: query };
  }
  
  if (category) filter.category = category;
  if (city) filter.city = city;
  if (gender) filter['attributes.gender'] = gender;
  if (age) {
    filter['attributes.age'] = {
      $gte: age.min || 18,
      $lte: age.max || 100
    };
  }
  
  if (minPrice || maxPrice) {
    filter['pricing.price'] = {};
    if (minPrice) filter['pricing.price'].$gte = minPrice;
    if (maxPrice) filter['pricing.price'].$lte = maxPrice;
  }
  
  let sort = {};
  if (query) {
    sort.score = { $meta: 'textScore' };
  }
  sort[sortBy] = sortOrder;
  
  return this.find(filter)
    .populate('user', 'username firstName lastName avatar')
    .populate('category', 'name slug')
    .populate('city', 'name state')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Instance method to increment views
listingSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to increment contact views
listingSchema.methods.incrementContactViews = function() {
  this.engagement.contactViews += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if listing is expired
listingSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

// Instance method to extend expiry
listingSchema.methods.extend = function(days = 30) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

module.exports = mongoose.model('Listing', listingSchema);