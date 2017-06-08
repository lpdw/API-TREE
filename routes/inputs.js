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

module.exports = router;
