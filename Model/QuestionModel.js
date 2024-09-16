const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: [true],
  },
  options: {
    type: [String],
    trim: true,
    required: [true],
  },
  correct_answer: {
    type: String,
    trim: true,
    required: true,
  },
  difficulty: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    required: true,
  },
});
const model = mongoose.model('Questions', schema);
module.exports = model;
