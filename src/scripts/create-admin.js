const mongoose = require('mongoose');

// Update this URI if different
const MONGODB_URI = "mongodb+srv://thanhlamkh2004_db_user:5q8OCzTDEyJjxaU0@cluster0.wx9qzhr.mongodb.net/?appName=Cluster0";

const userSchema = new mongoose.Schema({
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function promoteToAdmin(email) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${email} is now an admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node create-admin.js example@gmail.com');
  process.exit(1);
}

promoteToAdmin(email);
