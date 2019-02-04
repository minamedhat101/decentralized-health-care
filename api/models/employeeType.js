const mongoose = require('mongoose');

const EmployeeTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('EmployeeType', EmployeeTypeSchema);