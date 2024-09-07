const mongoose = require('mongoose');

const jobPostedSchema = new mongoose.Schema({
  recruiterEmail: {
    type: String,
    required: [true, 'Recruiter email should be there'],
    index: true,
  },
  JobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  postedDate: {
    type: Number,
    default: Date.now,
  },
});

const jobPosted = mongoose.model('JobPostedData', jobPostedSchema);
module.exports = jobPosted;
