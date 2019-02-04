const mongoose = require('mongoose');

const ComplainSchema = mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  },
  answerDetails: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },

});

module.exports = mongoose.model('complain', ComplainSchema);