'use strict';
const express = require('express');
const router = express.Router();
const Inputs = require("../models/inputs");
/* GET all inputs page. */
router.get('/', function(req, res, next) {
  Inputs.find(function(err, inputs) {
    if(err)
    return res.status(400);
    if (req.accepts('application/json')) {
        return res.status(200).send(inputs);
    }
  });
});

module.exports = router;
