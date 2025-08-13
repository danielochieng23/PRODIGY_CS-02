const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Ad = require('../models/Ad');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rubica');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: 'Escort Services',
    slug: 'escort-services',
    description: 'Professional escort and companionship services',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Massages',
    slug: 'massages',
    description: 'Relaxing and therapeutic massage services',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Male Escorts',
    slug: 'male-escorts',
    description: 'Male escort and companionship services',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Entertainment and event services',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Photography',
    slug: 'photography',
    description: 'Professional photography services',
    sortOrder: 5,
    isActive: true
  },
  {
    name: 'Accommodation',
    slug: 'accommodation',
    description: 'Short-term rental and accommodation services',
    sortOrder: 6,
    isActive: true
  },
  {
    name: 'Business Services',
    slug: 'business',
    description: 'Professional business and consulting services',
    sortOrder: 7,
    isActive: true
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Other miscellaneous services',
    sortOrder: 8,
    isActive: true
  }
];

const locations = [
  // Countries
  {
    name: 'India',
    slug: 'india',
    type: 'country',
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: 'United States',
    slug: 'united-states',
    type: 'country',
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  
  // States (India)
  {
    name: 'Maharashtra',
    slug: 'maharashtra',
    type: 'state',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Karnataka',
    slug: 'karnataka',
    type: 'state',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Delhi',
    slug: 'delhi-state',
    type: 'state',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Tamil Nadu',
    slug: 'tamil-nadu',
    type: 'state',
    isActive: true,
    sortOrder: 4
  },
  
  // Cities
  {
    name: 'Mumbai',
    slug: 'mumbai',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    population: 20411000
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    population: 32226000
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    population: 13193000
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 4,
    population: 10494000
  },
  {
    name: 'Pune',
    slug: 'pune',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 5,
    population: 7764000
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 6,
    population: 11503000
  },
  {
    name: 'Kolkata',
    slug: 'kolkata',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 7,
    population: 15133000
  },
  {
    name: 'Ahmedabad',
    slug: 'ahmedabad',
    type: 'city',
    isActive: true,
    isFeatured: true,
    sortOrder: 8,
    population: 8253000
  }
];

const users = [
  {
    username: 'admin',
    email: 'admin@rubica.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    username: 'testuser1',
    email: 'user1@test.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'user',
    isVerified: true,
    isActive: true
  },
  {
    username: 'testuser2',
    email: 'user2@test.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'user',
    isVerified: true,
    isActive: true
  }
];

// Seed functions
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

const seedLocations = async () => {
  try {
    await Location.deleteMany({});
    
    // Create locations and establish parent-child relationships
    const createdLocations = [];
    
    // First create all locations
    for (const locationData of locations) {
      const location = new Location(locationData);
      await location.save();
      createdLocations.push(location);
    }
    
    // Then establish parent-child relationships
    const india = createdLocations.find(l => l.slug === 'india');
    const maharashtra = createdLocations.find(l => l.slug === 'maharashtra');
    const karnataka = createdLocations.find(l => l.slug === 'karnataka');
    const delhiState = createdLocations.find(l => l.slug === 'delhi-state');
    const tamilNadu = createdLocations.find(l => l.slug === 'tamil-nadu');
    
    // Set state parents
    if (india) {
      await Location.updateMany(
        { type: 'state' },
        { parent: india._id }
      );
    }
    
    // Set city parents
    if (maharashtra) {
      await Location.updateOne(
        { slug: 'mumbai' },
        { parent: maharashtra._id }
      );
      await Location.updateOne(
        { slug: 'pune' },
        { parent: maharashtra._id }
      );
    }
    
    if (karnataka) {
      await Location.updateOne(
        { slug: 'bangalore' },
        { parent: karnataka._id }
      );
    }
    
    if (delhiState) {
      await Location.updateOne(
        { slug: 'delhi' },
        { parent: delhiState._id }
      );
    }
    
    if (tamilNadu) {
      await Location.updateOne(
        { slug: 'chennai' },
        { parent: tamilNadu._id }
      );
    }
    
    console.log(`✅ Seeded ${createdLocations.length} locations`);
    return createdLocations;
  } catch (error) {
    console.error('Error seeding locations:', error);
    throw error;
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    // Hash passwords before creating users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const updateCounts = async () => {
  try {
    // Update ad counts for categories and locations
    const categories = await Category.find();
    const locations = await Location.find();
    
    // Set random ad counts for demo purposes
    for (const category of categories) {
      const randomCount = Math.floor(Math.random() * 1000) + 100;
      category.adCount = randomCount;
      await category.save();
    }
    
    for (const location of locations) {
      if (location.type === 'city') {
        const randomCount = Math.floor(Math.random() * 3000) + 500;
        location.adCount = randomCount;
        await location.save();
      }
    }
    
    console.log('✅ Updated ad counts for categories and locations');
  } catch (error) {
    console.error('Error updating counts:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    await seedCategories();
    await seedLocations();
    await seedUsers();
    await updateCounts();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Categories: 8 created');
    console.log('- Locations: 16 created (countries, states, cities)');
    console.log('- Users: 3 created (1 admin, 2 regular users)');
    console.log('\n🔑 Test Accounts:');
    console.log('Admin: admin@rubica.com / admin123');
    console.log('User 1: user1@test.com / password123');
    console.log('User 2: user2@test.com / password123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedCategories,
  seedLocations,
  seedUsers,
  updateCounts
};