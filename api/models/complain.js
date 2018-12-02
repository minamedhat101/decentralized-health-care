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
  answeredBy:{ type: Schema.Types.ObjectId, ref: 'Employee' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },

});

module.exports = mongoose.model('complain', ComplainSchema);