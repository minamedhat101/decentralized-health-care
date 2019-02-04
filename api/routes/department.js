const express = require('express');
const Department = require('../models/department');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let department = await Department.find().exec();
    res.status(200).json(department);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let department = await Department.findById(req.params.id).exec();
    res.status(200).json(department);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get('/search/:name', async (req, res) => {
  try {
    const name = req.params.name;
    let department = await Department.find({name: name}).exec();
    res.status(200).json(department);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const department = new Department({
      name: req.body.name,
      description: req.body.description
    });
    let result = await department.save();
    console.log(result);
    res.status(201).json({
      message: "Created department successfully",
      result: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let department = await Department.remove({ _id: req.params.id }).exec();
    res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: department
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
    let department = await Department.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "Room Type updated",
      request: {
        type: "UPDATE",
        url: "http://localhost:3000/article/" + id,
        result: department
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;