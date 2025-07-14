const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      // Only require password if not signed in via Google
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // allows multiple null values
  }
});

// ✅ Hash password before saving (only if password is set)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
