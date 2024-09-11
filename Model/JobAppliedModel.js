const mongoose = require('mongoose');

const jobAppliedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  jobAppliedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    index: true,
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
