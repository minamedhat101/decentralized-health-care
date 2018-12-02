const mongoose = require('mongoose');

const DepartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
});

module.exports = mongoose.model('Department', DepartmentSchema);