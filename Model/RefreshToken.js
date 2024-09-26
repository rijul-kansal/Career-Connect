const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: [true, 'refreshToken is needed'],
  },
  userEmail: {
    type: String,
    required: [true, 'email is needed'],
  },
});

const model = mongoose.model('RefreshToken', schema);

module.exports = model;
