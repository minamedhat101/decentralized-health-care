const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  available: {
    type: Boolean
  },
  roomType:{ type: Schema.Types.ObjectId, ref: 'RoomType' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },

});

module.exports = mongoose.model('Room', RoomSchema);