const express = require('express');
const Hospital = require('../models/hospital');
const Department = require('../models/department');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let hospital = await Hospital.find().populate('departments').exec();
    res.status(200).json(hospital);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id).populate('departments').exec();
    res.status(200).json(hospital);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:query', (req, res) => {
  try {
    const query = req.params.query;
    let department = await Department.findOne({ name: query }).exec();

    let hospital = await Hospital
      .find({ $or: [{ name: query }, { departments: department.id }] })
      .populate('departments')
      .exec();
    res.status(200).json(hospital);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const hospital = new Hospital({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      location: {
        coordinates: req.body.coordinates
      },
      departments: req.body.departments
    });
    let result = await hospital.save();
    console.log(result);
    res.status(201).json({
      message: "Created hospital successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let hospital = await Hospital.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: hospital
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
    let hospital = await Hospital.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "Room Type updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/article/" + id,
        result: hospital
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;