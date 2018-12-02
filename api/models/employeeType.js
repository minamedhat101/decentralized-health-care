const mongoose = require('mongoose');

const EmployeeTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  accessLevel: {
    type: Number
  },
});

module.exports = mongoose.model('EmployeeType', EmployeeTypeSchema);