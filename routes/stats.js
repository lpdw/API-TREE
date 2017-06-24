"use strict";
const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET all inputs page. */
router.get('/count', (req, res, next) => {
  const Inputs = db.get().collection('inputs');
  const Words = db.get().collection('words');
  // let words = [];
  // On récupère tous les mots
  Words.find({}).sort({
    key: 1
  }).toArray((err, wordsFound) => {
    if (err) throw err;
    // Pour chaque mot on compte le nombre de fois qu'il apparaît dans les inputs
    wordsFound.forEach((word, index) => {
      return Inputs.find({
        words: {
          $elemMatch: {
            $eq: word.key
          }
        }
      }).count((err, count) => {
        if (err) throw err;
        word.count = count;

        if (index === wordsFound.length - 1) return res.status(200).send(wordsFound);
      });
    });
  });
});


module.exports = router;
