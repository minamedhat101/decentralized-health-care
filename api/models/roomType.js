const mongoose = require('mongoose');

const RoomTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('RoomType', RoomTypeSchema);