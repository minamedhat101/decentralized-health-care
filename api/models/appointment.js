const mongoose = require('mongoose');
const Room = require('./room');
const Schedule = require('./schedule');

const AppoinmentSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },

  purchasedAt: {
    type: Date,
    default: Date.now
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

AppoinmentSchema.pre('save', async (next) => {
  try {
    let appointment = this;
    let schedule = await Schedule
      .update({ _id: appointment.schedule },
        { $inc: { numberOfAppointments: 1 } }
      )

    if (schedule.numberOfAppointments === schedule.numberOfMaxAppointments) {
      let schedule = await Schedule
      .update({ _id: appointment.schedule },
        { $set: { available: 'false' }}
      )
    }
    console.log('schedule updated');
  } catch (err) {
    console.log('schedule not updated');
  }

});

module.exports = mongoose.model('Apointment', AppoinmentSchema);