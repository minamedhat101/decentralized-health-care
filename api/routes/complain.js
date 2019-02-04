const express = require('express');
const Complain = require('../models/complain');
const Hospital = require('../models/hospital');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let complain = await Complain.find()
      .populate('hospital')
      .populate('user')
      .populate('answeredBy')
      .exec();
    res.status(200).json(complain);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let complain = await Complain.findById(req.params.id)
      .populate('hospital')
      .populate('user')
      .populate('answeredBy')
      .exec();
    res.status(200).json(complain);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    let hospital = await Hospital.findOne({ name: query }).exec();
    let user = await User.find({ name: query }).exec();

    let complain = await Complain
      .find({ $or: [{ user: user.id }, { hospital: hospital.id }] })
      .populate('hospital')
      .populate('user')
      .populate('answeredBy')
      .exec();
    res.status(200).json(complain);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const complain = new Complain({
      body: req.body.body,
      user: req.body.user,
      hospital: req.body.hospital,

    });
    let result = await complain.save();
    console.log(result);
    res.status(201).json({
      message: "Created complain successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let complain = await Complain.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: complain
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
    let complain = await Complain.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "complain updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/complain/" + id,
        result: complain
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;