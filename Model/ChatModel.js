const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId1: {
    type: String,
    trim: true,
    required: [true, 'User1 Id should be there'],
    index: true,
  },
  userId2: {
    type: String,
    trim: true,
    required: [true, 'User2 Id should be there'],
    index: true,
  },
  message: {
    type: String,
    trim: true,
    required: [true, 'Message Id should be there'],
  },
  timeStamp: {
    type: Number,
    default: Date.now,
  },
});

const model = mongoose.model('Chat', schema);

module.exports = model;
