const mongoose = require('mongoose');

const userTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  accessLevel: {
    type: Number
  },
});

module.exports = mongoose.model('UserType', userTypeSchema);