const express = require('express');
const Room = require('../models/room');
const Hospital = require('../models/hospital');
const RoomType = require('../models/roomType');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let room = await Room.find()
      .populate('hospital')
      .populate('roomType')
      .exec();
    res.status(200).json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let room = await Room.findById(req.params.id)
      .populate('hospital')
      .populate('roomType')
      .exec();
    res.status(200).json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    let hospital = await Hospital.findOne({ name: query }).exec();
    let roomType = await RoomType.findOne({ name: query }).exec();

    let room = await Room
      .find({ $or: [{ name: query }, { hospital: hospital.id }, { roomType: roomType.id }] })
      .populate('hospital')
      .populate('roomType')
      .exec();
    res.status(200).json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const room = new Room({
      name: req.body.name,
      description: req.body.description,
      hospital: req.body.hospital,
      user: req.body.user
    });
    let result = await room.save();
    console.log(result);
    res.status(201).json({
      message: "Created room successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let room = await Room.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: room
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    let room = await Room.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "room updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/room/" + id,
        result: room
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;