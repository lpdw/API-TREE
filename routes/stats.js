"use strict";
const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET all inputs page. */
router.get('/count', (req, res, next) => {
const Inputs = db.get().collection('inputs');
const Words = db.get().collection('words');
let words = [];
// On récupère tous les mots
Words.find({}).sort({
  key: 1
}).toArray().then( (wordsFound) => {
  // Pour chaque mot on compte le nombre de fois qu'il apparaît dans les inputs
  wordsFound.forEach((word, index) => {
    Inputs.find({
      words: {
        $elemMatch: {
          $eq: word.key
        }
      }
    }).count().then((count) => {
      word.count = count;
      words.push(word);
      if (words.length === wordsFound.length) return res.status(200).send(words);
    });

  });
});
});


module.exports = router;
