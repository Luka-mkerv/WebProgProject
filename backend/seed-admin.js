const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Admin user
const adminUser = {
  username: 'admin',
  password: 'admin123',
  role: 'Admin',
  name: 'Admin User'
};

// Connect to MongoDB and seed admin
async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️  Cleared existing admin user');

    // Insert admin user
    await User.create(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: Admin');

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedAdmin();