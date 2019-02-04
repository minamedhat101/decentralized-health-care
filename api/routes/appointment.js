const express = require('express');
const Appointment = require('../models/appointment');
const Hospital = require('../models/hospital');
const User = require('../models/user');
const Room = require('../models/room');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let appointment = await Appointment.find()
      .populate('hospital')
      .populate('user')
      .populate('room')
      .exec();
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id)
      .populate('hospital')
      .populate('user')
      .populate('room')
      .exec();
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    let hospital = await Hospital.findOne({ name: query }).exec();
    let users = await User.find({ fristName: query }).exec();
    let userArr = [];
    let rooms = await Room.find({ fristName: query }).exec();
    let roomArr = [];
    for (const room of rooms) {
      roomArr.push(room.id)
    }
    for (const user of users) {
      userArr.push(user.id)
    }
    let appointment = await Appointment
      .find({ $or: [{ user: { $in: userArr } }, { room: { $in: roomArr } }, { hospital: hospital.id }] })
      .populate('hospital')
      .populate('user')
      .populate('room')
      .exec();
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment({
      description: req.body.description,
      date: req.body.date,
      room: req.body.room,
      hospital: req.body.hospital,
      user: req.body.user,
      schedule: req.body.schedule
    });
    let schedule = await Schedule.findOne({ _id: appointment.schedule }).exec();
    if (schedule.available) {
      let result = await appointment.save();
      console.log(result);
      res.status(201).json({
        message: "Created appointment successfully",
        result: result
      });
    } else {
      let err = 'no appointment available in this date';
      console.log(err);
      res.status(500).json({ error: err });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let appointment = await Appointment.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: appointment
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
    let appointment = await Appointment.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "appointment updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/article/" + id,
        result: appointment
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;