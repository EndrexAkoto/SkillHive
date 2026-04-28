import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: { type: String, required: true },
  profession: { type: String, required: false },
  specialization: { type: String, required: false },
  location: { type: String, required: false },
  address: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  about: { type: String, required: false },
  profilePicture: { type: String, required: false },
  skills: { type: [String], default: [] },
  education: {
    type: [{
      institution: String,
      course: String,
      startYear: String,
      endYear: String
    }],
    default: []
  },
  experience: {
    type: [{
      institution: String,
      location: String,
      role: String
    }],
    default: []
  },
  courses: {
    type: [{
      name: String,
      institution: String,
      year: String
    }],
    default: []
  }
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
