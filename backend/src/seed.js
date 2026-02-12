/**
 * Seed Script — Creates demo admin and user accounts
 * Usage: node src/seed.js
 * Requires .env file with MONGO_URI
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

const seedUsers = [
  {
    username: 'admin',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    username: 'demouser',
    email: 'user@demo.com',
    password: 'demo123',
    role: 'user',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');

  for (const userData of seedUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`⚠️  User already exists: ${userData.email}`);
      continue;
    }
    const user = await User.create(userData);
    console.log(`✅ Created ${user.role}: ${user.email}`);
  }

  console.log('\n🌱 Seed complete!');
  console.log('Admin  → admin@demo.com / admin123');
  console.log('User   → user@demo.com  / demo123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
