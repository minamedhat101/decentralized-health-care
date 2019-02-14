const express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
const Article = require('../models/article');
const Employee = require('../models/employee');

const router = express.Router();

router.get('/', async (req, res) => {
  Article.find().exec()
    .then(articles => {
      res.status(200).json(articles);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', async (req, res) => {
  Article.findById({ _id: req.params.id }).populate('author').exec()
    .then(article => {
      // let response = article.map();
      res.status(200).json(article);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    let employees = await Employee.find({ fristName: query }).exec();
    let employeArr = [];
    for (const employee of employees) {
      employeArr.push(employee.id)
    }
    const id = new ObjectId((query.length < 12) ? "123456789012" : query);
    let Article = await Article
      .find({ $or: [{ _id: id }, { title: query }, { author: { $in: employeArr } }] })
      .populate('author').exec();

    return res.status(200).json(Article);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }

});

router.post('/', async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      author: req.body.author,
      text: req.body.text,
      picture: req.body.picture,
    });
    let result = await article.save();
    return res.status(201).json({
      message: "Created type successfully",
      result: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }

});
router.delete('/:id', async (req, res) => {
  try {
    let article = await Article.remove({ _id: req.params.id }).exec();
    return res.status(200).json({
      message: "Type deleted",
      request: {
        type: "delete"
      },
      result: article
    });

  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    let article = await Article.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "Article updated",
      request: {
        type: "GET",
        url: "http://localhost:3000/article/" + id,
        result: article
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;