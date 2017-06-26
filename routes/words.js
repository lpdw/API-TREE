

const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET all inputs page. */
router.get('/', (req, res, next) => {
  const Words = db.get().collection('words');

  Words.find().toArray().then((words) => {
    res.status(200).send(words);
    // console.log(projects);
    // res.render('projects', { projects: projects });
  });
});

router.get('/getbykey/:key', (req, res, next) => {
  const Words = db.get().collection('words');
  Words.findOne({ key: parseInt(req.params.key) })
  .then((word) => {
    res.status(200).send(word);
  });
});

router.get('/getbyword/:word', (req, res, next) => {
  const Words = db.get().collection('words');
  Words.findOne({ word: req.params.word }).then((word) => {
    res.status(200).send(word);
  });
});
module.exports = router;
