'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const InputSchema = new Schema({
  date: Date,
  inputs: [{
    label : String,
    value: Number,
  }]
});

module.exports = mongoose.model('Inputs', InputSchema);
