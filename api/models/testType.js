const mongoose = require('mongoose');

const TestTypeSchema = mongoose.Schema({
  typeName: {
    type: String,
    required: true
  },
  description: {
    type: Number,
    required:true
  },
});

module.exports = mongoose.model('TestType', TestTypeSchema);