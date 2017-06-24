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
        words.push(word);
        if (index === wordsFound.length - 1) res.status(200).send(words);
      });
    });
  });
});

/** OLD ROUTES TO UPDATE **/


// GET previous inputs to sent date
router.get('/BeforeDate/:date', (req, res, next) => {
    const Inputs = db.get().collection('inputs');
    Inputs.find(
        {
            date: {
                "$lte": new Date(req.params.date)
            }
        }
    ).toArray().then(inputs => {
        console.log(inputs);
        res.status(200).send({inputs});
    }).catch(err=>{console.log(err);});

});

module.exports = router;
