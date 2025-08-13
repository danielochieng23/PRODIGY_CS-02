const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ad title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Ad description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  price: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  contact: {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    showPhone: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    }
  },
  features: [{
    name: String,
    value: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'sold', 'expired', 'rejected'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['normal', 'featured', 'premium', 'urgent'],
    default: 'normal'
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favoriteCount: {
    type: Number,
    default: 0
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedUntil: Date,
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  rejectionReason: String,
  moderationNotes: String,
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  socialSharing: {
    title: String,
    description: String,
    image: String
  }
}, {
  timestamps: true
});

// Indexes
AdSchema.index({ status: 1, createdAt: -1 });
AdSchema.index({ category: 1, createdAt: -1 });
AdSchema.index({ user: 1, createdAt: -1 });
AdSchema.index({ 'location.city': 1, status: 1 });
AdSchema.index({ slug: 1 });
AdSchema.index({ priority: 1, createdAt: -1 });
AdSchema.index({ expiresAt: 1 });
AdSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Create slug from title before saving
AdSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    this.slug = `${baseSlug}-${this._id}`;
  }
  next();
});

// Update favorite count when favorites array changes
AdSchema.pre('save', function(next) {
  if (this.isModified('favorites')) {
    this.favoriteCount = this.favorites.length;
  }
  next();
});

// Static method to get ads with filters
AdSchema.statics.getFilteredAds = function(filters = {}, options = {}) {
  const {
    category,
    subcategory,
    city,
    state,
    country,
    minPrice,
    maxPrice,
    search,
    status = 'active',
    priority,
    user
  } = filters;

  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;

  const query = { status };

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  if (country) query['location.country'] = new RegExp(country, 'i');
  if (user) query.user = user;
  if (priority) query.priority = priority;

  if (minPrice !== undefined || maxPrice !== undefined) {
    query['price.amount'] = {};
    if (minPrice !== undefined) query['price.amount'].$gte = minPrice;
    if (maxPrice !== undefined) query['price.amount'].$lte = maxPrice;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder };

  return this.find(query)
    .populate('category', 'name slug color')
    .populate('subcategory', 'name slug')
    .populate('user', 'username firstName lastName avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Method to increment views
AdSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to check if ad is expired
AdSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

// Virtual for main image
AdSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || (this.images.length > 0 ? this.images[0] : null);
});

// Transform output
AdSchema.methods.toJSON = function() {
  const adObject = this.toObject();
  adObject.mainImage = this.mainImage;
  return adObject;
};

module.exports = mongoose.model('Ad', AdSchema);