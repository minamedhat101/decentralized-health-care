const express = require('express');
const Room = require('../models/room');
const Hospital = require('../models/hospital');
const Schedule = require('../models/schedule');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let schedule = await Schedule.find()
      .populate(
        {
          path: 'room',
          populate: {
            path: 'hospital'
          }
        })
      .exec();
    res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id)
      .populate(
        {
          path: 'room',
          populate: {
            path: 'hospital'
          }
        })
      .exec();
    res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:query', (req, res) => {
  try {
    const query = req.params.query;
    let hospital = await Hospital.findOne({ name: query }).exec();
    let room = await Room
      .find({ $or: [{ name: query }, { hospital: hospital.id }] })

    let schedule = await Schedule
      .find({ $or: [{ room: room.id }, { hospital: hospital.id }] })
      .populate(
        {
          path: 'room',
          populate: {
            path: 'hospital'
          }
        })
      .exec();
    res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const schedule = new Schedule({
      begin: req.body.begin,
      end: req.body.end,
      numberOfMaxAppointments: req.body.numberOfMaxAppointments,
      numberOfAppointments: req.body.numberOfAppointments,
      available: req.body.available
    });
    let result = await schedule.save();
    console.log(result);
    res.status(201).json({
      message: "Created schedule successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let schedule = await Schedule.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: schedule
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
    let schedule = await Schedule.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "schedule updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/schedule/" + id,
        result: schedule
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;