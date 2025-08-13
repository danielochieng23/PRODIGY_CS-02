const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#007bff'
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  adCount: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String,
  keywords: [String]
}, {
  timestamps: true
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

// Create slug from name before saving
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to get category tree
CategorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('subcategories');
  
  const tree = [];
  const categoryMap = {};
  
  // Create a map of all categories
  categories.forEach(cat => {
    categoryMap[cat._id] = { ...cat.toObject(), children: [] };
  });
  
  // Build the tree structure
  categories.forEach(cat => {
    if (cat.parentCategory) {
      if (categoryMap[cat.parentCategory]) {
        categoryMap[cat.parentCategory].children.push(categoryMap[cat._id]);
      }
    } else {
      tree.push(categoryMap[cat._id]);
    }
  });
  
  return tree;
};

// Method to get full category path
CategorySchema.methods.getPath = async function() {
  const path = [this];
  let current = this;
  
  while (current.parentCategory) {
    current = await this.constructor.findById(current.parentCategory);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }
  
  return path;
};

module.exports = mongoose.model('Category', CategorySchema);