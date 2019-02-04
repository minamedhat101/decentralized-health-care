const express = require('express');
const UserType = require('../models/userType');

const router = express.Router();

router.get('/', (req, res) => {
  UserType.find().exec()
    .then(types => {
      res.status(200).json(types);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', (req, res) => {
  UserType.findById(req.params.id).exec()
    .then(type => {
      res.status(200).json(type);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post('/', (req, res) => {
  const type = new UserType({
    name: req.body.name,
    accessLevel: req.body.accessLevel
  })
  type.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "Created type successfully",
      result: result
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });

});

router.delete('/:id', (req, res) => {
  UserType.remove({ _id: req.params.id }).exec()
    .then(result => {
      res.status(200).json({
        message: "Type deleted",
        request: {
          type: "delete"
        },
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;