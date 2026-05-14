require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  email: String,
  role: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ role: 'admin' });
  console.log('ADMIN_USER:', JSON.stringify(user));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
