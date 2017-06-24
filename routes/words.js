"use strict";
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

router.get('/:key',(req,res,next)=>{
  const Words = db.get().collection('words');

  Words.find({ number: req.params.key }).then((word) => {
    res.status(200).send(word);
    // console.log(projects);
    // res.render('projects', { projects: projects });
  });
});
module.exports = router;
