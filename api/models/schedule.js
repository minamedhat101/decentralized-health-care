const mongoose = require('mongoose');

const ScheduleSchema = mongoose.Schema({
  begin: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  numberOfMaxAppointments: {
    type: Number
  },
  numberOfAppointments: {
    type: Number,
    defalut: 0
  },
  available: {
    type: Boolean,
    required: true
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);