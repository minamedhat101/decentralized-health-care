const express = require('express');
const RoomType = require('../models/roomType');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let type = await RoomType.find().exec();
    res.status(200).json(type);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let type = await RoomType.findById(req.params.id).exec();
    res.status(200).json(type);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:name', async (req, res) => {
  try {
    const name = req.params.name;
    let type = await RoomType.find({name: name}).exec();
    res.status(200).json(type);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const type = new RoomType({
      name: req.body.name,
      description: req.body.description
    });
    let result = await type.save();
    console.log(result);
    res.status(201).json({
      message: "Created type successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let type = await RoomType.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: type
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
    let type = await RoomType.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "Room Type updated",
      request: {
        type: "GET",
        url: "http://localhost:3000/article/" + id,
        result: type
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;