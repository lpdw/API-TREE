'use strict';
const express = require('express');
const db = require('../db');


const router = express.Router();

/* GET all inputs page. */
router.get('/', (req, res, next) => {
  const Inputs = db.get().collection('inputs');
  Inputs.find().toArray().then(inputs => {
    res.status(200).send(inputs);
    // console.log(projects);
    // res.render('projects', { projects: projects });
  });
});

/* Create a new input page. */
router.post('/', (req, res, next) => {
  let input = {
    date: new Date(),
    inputs: [{
        label: "Humeur",
        value: 0,
      },
      {
        label: "Sentiment",
        value: 1,
      },
    ]
  };
  return db.get().collection('inputs').insertOne(input)
  .then(input => {
console.log(input);
  })
  .catch(err => {
    console.log(err);
  })
});



module.exports = router;
