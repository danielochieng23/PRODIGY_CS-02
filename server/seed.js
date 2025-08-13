const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');
const Ad = require('./models/Ad');
require('dotenv').config();

// Sample categories based on the original Skokka structure
const categories = [
  {
    name: 'Call Girls',
    description: 'Professional escort services and call girls',
    icon: '💋',
    color: '#e91e63',
    sortOrder: 1
  },
  {
    name: 'Massages',
    description: 'Relaxing massage and spa services',
    icon: '💆',
    color: '#4caf50',
    sortOrder: 2
  },
  {
    name: 'Male Escorts',
    description: 'Professional male escort services',
    icon: '👨',
    color: '#2196f3',
    sortOrder: 3
  },
  {
    name: 'Transsexuals',
    description: 'Transgender escort services',
    icon: '🌈',
    color: '#ff9800',
    sortOrder: 4
  },
  {
    name: 'Adult Meetings',
    description: 'Casual adult meetings and encounters',
    icon: '💑',
    color: '#9c27b0',
    sortOrder: 5
  },
  {
    name: 'BDSM',
    description: 'BDSM and fetish services',
    icon: '🔗',
    color: '#f44336',
    sortOrder: 6
  }
];

// Sample cities
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
  'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington'
];

// Sample users
const sampleUsers = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sarah_j',
    email: 'sarah@example.com',
    password: 'password123'
  },
  {
    firstName: 'Mike',
    lastName: 'Wilson',
    username: 'mike_w',
    email: 'mike@example.com',
    password: 'password123'
  },
  {
    firstName: 'Emma',
    lastName: 'Davis',
    username: 'emma_d',
    email: 'emma@example.com',
    password: 'password123'
  },
  {
    firstName: 'Alex',
    lastName: 'Brown',
    username: 'alex_b',
    email: 'alex@example.com',
    password: 'password123'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await User.deleteMany({});
    await Ad.deleteMany({});

    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create sample ads
    const sampleAds = [];
    const adTitles = [
      'Elegant and sophisticated companion',
      'Relaxing full body massage',
      'Professional gentleman escort',
      'Beautiful transgender companion',
      'Discrete adult meetings',
      'Experienced dominatrix services',
      'Luxury escort experience',
      'Therapeutic massage therapy',
      'Charming male companion',
      'Exclusive private encounters'
    ];

    const descriptions = [
      'Offering premium companionship services with utmost discretion and professionalism.',
      'Providing relaxing and rejuvenating massage experiences in a comfortable environment.',
      'Available for social events, dinner dates, and private companionship.',
      'Experienced in providing quality services with respect and understanding.',
      'Offering discrete and professional adult entertainment services.'
    ];

    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomTitle = adTitles[Math.floor(Math.random() * adTitles.length)];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      sampleAds.push({
        title: `${randomTitle} - ${randomCity}`,
        description: randomDescription,
        category: randomCategory._id,
        user: randomUser._id,
        location: {
          city: randomCity,
          state: 'NY', // Default to NY for simplicity
          country: 'USA'
        },
        contact: {
          name: randomUser.firstName,
          phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          email: randomUser.email,
          showPhone: true,
          showEmail: false
        },
        price: {
          amount: Math.floor(Math.random() * 500) + 100,
          currency: 'USD',
          negotiable: Math.random() > 0.5
        },
        status: 'active',
        priority: Math.random() > 0.8 ? 'featured' : 'normal',
        views: Math.floor(Math.random() * 1000),
        images: [
          {
            url: `https://picsum.photos/400/300?random=${i}`,
            isMain: true,
            alt: randomTitle
          }
        ]
      });
    }

    const createdAds = await Ad.insertMany(sampleAds);
    console.log(`Created ${createdAds.length} sample ads`);

    // Update category ad counts
    for (const category of createdCategories) {
      const adCount = await Ad.countDocuments({ category: category._id, status: 'active' });
      await Category.findByIdAndUpdate(category._id, { adCount });
    }

    console.log('Updated category ad counts');
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();