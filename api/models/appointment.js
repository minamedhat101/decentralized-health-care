const mongoose = require('mongoose');

const AppoinmentSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  user: { type: Schema.Types.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('Apointment', AppoinmentSchema);