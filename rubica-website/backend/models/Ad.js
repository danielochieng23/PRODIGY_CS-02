const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    telegram: {
      type: String,
      trim: true
    }
  },
  pricing: {
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    hourly: {
      type: Number,
      min: 0
    },
    halfHour: {
      type: Number,
      min: 0
    },
    overnight: {
      type: Number,
      min: 0
    },
    customRates: [{
      duration: String,
      price: Number
    }]
  },
  details: {
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    height: {
      type: String,
      trim: true
    },
    weight: {
      type: String,
      trim: true
    },
    ethnicity: {
      type: String,
      trim: true
    },
    languages: [String],
    services: [String],
    availability: {
      days: [String],
      hours: {
        from: String,
        to: String
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'expired', 'blocked', 'deleted'],
    default: 'draft'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  contacts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  lastBumped: {
    type: Date,
    default: Date.now
  },
  moderationNotes: {
    type: String,
    trim: true
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
adSchema.index({ category: 1, location: 1, status: 1 });
adSchema.index({ user: 1, status: 1 });
adSchema.index({ status: 1, expiresAt: 1 });
adSchema.index({ isPremium: 1, isFeatured: 1, lastBumped: -1 });
adSchema.index({ 'contact.phone': 1 });
adSchema.index({ slug: 1 });

// Text index for search
adSchema.index({
  title: 'text',
  description: 'text',
  'contact.name': 'text'
});

// Virtual for primary image
adSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Method to increment views
adSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment contacts
adSchema.methods.incrementContacts = function() {
  this.contacts += 1;
  return this.save();
};

// Method to check if ad is active
adSchema.methods.isActive = function() {
  return this.status === 'active' && this.expiresAt > new Date();
};

// Static method to find active ads
adSchema.statics.findActive = function(filters = {}) {
  return this.find({
    ...filters,
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

// Pre-save middleware to ensure only one primary image
adSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  next();
});

module.exports = mongoose.model('Ad', adSchema);