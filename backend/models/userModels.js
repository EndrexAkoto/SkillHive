import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: false
  },
  verifyToken: {
    type: String,
    required: false,
    default: '',
    unique: true,
    expires: 86400 * 7 // 7 days
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  token: {
    type: String,
    required: false
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;