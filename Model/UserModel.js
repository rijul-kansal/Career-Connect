const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');

// Career Preference Schema
const careerPreferenceSchema = new mongoose.Schema({
  preferredLocation: {
    type: [String],
    trim: true,
  },
  preferredJobType: {
    type: [String],
    trim: true,
    enum: {
      values: ['Internship', 'FullTime', 'PartTime', 'Contract', 'FreeLancer'],
      message:
        'Can only contain values: Internship, FullTime, PartTime, Contract ,FreeLancer',
    },
  },
});

// Education Schema
const educationSchema = new mongoose.Schema({
  course: {
    type: String,
    trim: true,
    required: [true, 'Course name is required'],
  },
  collegeName: {
    type: String,
    trim: true,
    required: [true, 'College name is required'],
  },
  CGPA: {
    type: String,
    trim: true,
    required: [true, 'CGPA is required'],
  },
  graduationYear: {
    type: String,
    trim: true,
    required: [true, 'Graduation year is required'],
  },
});

// Experience Schema
const experienceSchema = new mongoose.Schema({
  nameOfCompany: {
    type: String,
    trim: true,
    required: [true, 'Company name is required'],
  },
  role: {
    type: String,
    trim: true,
    required: [true, 'Role is required'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required'],
    minLength: [100, 'Description should be of minimum length 100'],
    maxLength: [500, 'Description should be of maximum length 500'],
  },
  startDate: {
    type: Number,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Number,
  },
  type: {
    type: String,
    trim: true,
    required: [true, 'Type of job is required'],
    enum: {
      values: ['Remote', 'OnSite'],
      message: 'Value for this enum can only be Remote or OnSite',
    },
  },
});

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Project name is required'],
  },
  gitHubLink: String,
  projectLink: String,
  skills: [String],
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required'],
    minLength: [100, 'Description should be of minimum length 100'],
    maxLength: [500, 'Description should be of maximum length 500'],
  },
});

// Achievements Schema
const achievementsSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: [true, 'Achievement description is required'],
  },
  link: String,
});

// certificate schema
const certificateEarned = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type of certificate Required'],
    trim: true,
  },
  score: {
    type: Number,
    required: [true, 'score must be there'],
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 10;
      },
      message: (props) => `${props.value} is not a valid Score!`,
    },
  },
  date: {
    type: Number,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  typeOfUser: {
    type: String,
    enum: {
      values: ['User', 'Recruiter'],
      message: 'Values of Type can be User or Recruiter',
    },
    required: [true, 'Type of user should be there'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: [8, 'Minimum length of password should be 8 characters'],
    required: [true, 'Password is required'],
    select: false,
  },
  image: String,
  currentLocation: {
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female'],
      message: 'Gender should be either Male or Female',
    },
    trim: true,
  },
  dateOfBirth: {
    type: Number,
  },
  mobileNumber: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'Mobile number is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
    index: true,
  },
  careerPreference: careerPreferenceSchema,
  education: [educationSchema],
  skills: { type: [String], trim: true },
  language: { type: [String], trim: true },
  experience: [experienceSchema],
  project: [projectSchema],
  summary: {
    type: String,
    trim: true,
    minLength: [50, 'Summary should be of minimum length 50'],
    maxLength: [300, 'Summary should be of maximum length 300'],
  },
  achievements: [achievementsSchema],
  resumeLink: String,
  githubLink: String,
  portfolioLink: String,
  codingProfileLink: [String],
  lastUpdated: {
    type: Number,
    default: Date.now,
  },
  fcmToken: {
    type: String,
  },
  certificateEarned: [certificateEarned],
  OTPVerification: String,
  OTPValidTill: {
    type: Number,
  },
  VerifiedUser: {
    type: Boolean,
    default: false,
  },
  ChangePassword: {
    type: Number,
    default: Date.now(),
  },
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = parseInt(process.env.SALT, 10) || 10;
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
const model = mongoose.model('User', userSchema);
module.exports = model;
