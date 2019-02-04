const mongoose = require('mongoose');

const HospitalSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  phoneNumber: {
    type: String
  },
  departments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Department'}],
});

module.exports = mongoose.model('Hospital', HospitalSchema);