const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const careerPreferenceSchema = new mongoose.Schema({
  preferredLocation: [String],
  preferredJobType: {
    type: [String],
    enum: ['Internship', 'FullTime', 'PartTime', 'Contract'],
  },
});

const educationSchema = new mongoose.Schema({
  course: {
    type: String,
    required: [true, 'Course name should be there'],
  },
  collegeName: {
    type: String,
    required: [true, 'College name should be there'],
  },
  CGPA: {
    type: String,
    required: [true, 'CGPA should be there'],
  },
  graduationYear: {
    type: String,
    required: [true, 'Graduation year should be there'],
  },
});

const experienceSchema = new mongoose.Schema({
  nameOfCompany: {
    type: String,
    required: [true, 'Company name should be there'],
  },
  role: {
    type: String,
    required: [true, 'Role should be there'],
  },
  description: {
    type: String,
    required: [true, 'Description should be there'],
    minLength: [100, 'Description should be of minimum length 100'],
    maxLength: [500, 'Description should be of maximum length 500'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date should be there'],
  },
  endDate: {
    type: Date,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name of project should be there'],
  },
  gitHubLink: String,
  projectLink: String,
  skills: [String],
  description: {
    type: String,
    required: [true, 'Description should be there'],
    minLength: [100, 'Description should be of minimum length 100'],
    maxLength: [500, 'Description should be of maximum length 500'],
  },
});

const achievementsSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Achievement description should be there'],
  },
  link: String,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name should be there'],
    trim: true,
    minLength: [5, 'Minimum length should be 5 char'],
    maxLength: [20, 'Maximum length should be 20 char'],
  },
  password: {
    type: String,
    trim: true,
    minLength: [8, 'minimum length  of password should ne 8 character'],
    required: [true, 'password should be there'],
    select: false,
  },
  image: {
    type: String,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    },
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female'],
      message: 'Value of gender should be either Male or Female',
    },
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
    required: [true, 'Mobile number should be there'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email should be there'],
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  careerPreference: careerPreferenceSchema,
  education: [educationSchema],
  skills: [String],
  language: [String],
  experience: [experienceSchema],
  project: [projectSchema],
  summary: {
    type: String,
    minLength: [50, 'Summary should be of minimum length 50'],
    maxLength: [300, 'Summary should be of maximum length 100'],
  },
  achievements: [achievementsSchema],
  resumeLink: String,
  githubLink: String,
  portfolioLink: String,
  codingProfileLink: [String],
  typeOfUser: {
    type: String,
    required: [true, 'Please enter typeOfUser'],
    enum: {
      values: ['User', 'Recruiter'],
      message: 'Value should only be User or Recruiter',
    },
  },
  designation: {
    type: String,
    required: [true, 'Designation should be there'],
  },
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

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    console.log('Password change');
    const salt = process.env.SALT;
    this.password = await promisify(bcrypt.hash)(this.password, salt);
  }
});

const model = mongoose.model('UserData', userSchema);

module.exports = model;
