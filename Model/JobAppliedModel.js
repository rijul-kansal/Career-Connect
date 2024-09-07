const mongoose = require('mongoose');

const jobAppliedSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: [true, 'User email should be there'],
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
  type: {
    type: String,
    enum: {
      values: ['Applied', 'Seen', 'Interested', 'Discard'],
      message: 'Value can be Applied , Seen ,Interested , Discard',
    },
    default: 'Applied',
  },
});

const jobApplied = mongoose.model('JobAppliedData', jobAppliedSchema);

module.exports = jobApplied;
