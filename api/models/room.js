const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },

});

module.exports = mongoose.model('Room', RoomSchema);