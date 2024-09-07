const mongoose = require('mongoose');
const ErrorClass = require('./../Utils/ErrorClass');

const companyLink = {
  name: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
};

const jobSchema = new mongoose.Schema({
  nameOfCompany: {
    type: String,
    required: [true, 'A company name should be there'],
    trim: true,
    maxLength: [30, 'Maximum length of company name should not exceed 30 char'],
  },
  aboutCompany: {
    type: String,
    required: [true, 'Company description should be there'],
    trim: true,
    maxLength: [
      500,
      'Maximum length of company description should not exceed 500 char',
    ],
    minLength: [100, 'Minimum length should be 100 char'],
  },
  nameOfRole: {
    type: String,
    required: [true, 'Role name should be there'],
    trim: true,
    maxLength: [50, 'Maximum length of role name should not exceed 50 char'],
    index: true,
  },
  typeOfJob: {
    type: String,
    trim: true,
    enum: {
      values: ['Internship', 'FullTime', 'PartTime', 'Contract'],
      message: 'Type is either Internship, FullTime, PartTime, or Contract',
    },
    required: [true, 'Type should be there'],
  },
  location: {
    type: [String],
    trim: true,
    required: [true, 'Location should be there'],
  },
  startDate: {
    type: String,
    default: 'Immediate',
  },
  durationOfInternship: {
    type: String,
    trim: true,
  },
  costToCompany: {
    type: String,
    default: 'Not Disclosed',
    trim: true,
  },
  lastDateToApply: {
    type: Number,
    default: () => Date.now + 10 * 24 * 60 * 60 * 1000,
  },
  postedDate: {
    type: Number,
    default: Date.now,
  },
  descriptionAboutRole: {
    type: String,
    trim: true,
    required: [true, 'Description about role should be there'],
    maxLength: [
      500,
      'Maximum length of role description should not exceed 500 char',
    ],
  },
  skillsRequired: {
    type: [String],
    trim: true,
  },
  noOfOpening: {
    type: Number,
    default: 0,
  },
  perks: { type: [String], trim: true },
  noOfStudentsApplied: {
    type: Number,
    default: 0,
  },
  responsibilities: {
    type: [String],
    trim: true,
  },
  roleCategory: {
    type: String,
    trim: true,
    required: [true, 'Role category should be there'],
    index: true,
  },
  minimumQualification: {
    type: [String],
    trim: true,
  },
  companyLinks: [companyLink],
});

jobSchema.pre('save', function (next) {
  if (this.typeOfJob === 'Internship' || this.typeOfJob === 'Contract') {
    if (!this.durationOfInternship) {
      return next(
        new ErrorClass(
          'If job type is internship or Contract , then duration is mandatory'
        )
      );
    }
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
