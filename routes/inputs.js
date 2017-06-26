"use strict";
const express = require('express');
const db = require('../db');

const router = express.Router();


/* GET all inputs page. */
router.get('/', (req, res, next) => {
  const Inputs = db.get().collection('inputs');
  Inputs.find().toArray().then((inputs) => {
    res.status(200).send(inputs);
    // console.log(projects);
    // res.render('projects', { projects: projects });
  });
});

/* Create a new input page. */
router.post('/', (req, res, next) => {

  const Inputs = db.get().collection('inputs');
  const Words = db.get().collection('words');

  // 1. Premier contrôle nombre de mots
  if (req.body.words.length !== 6) return res.status(400).send("Vous n'avez pas saisi le bon nombre de mots");

  Words.find({ key: { $in: req.body.words },mood: true }).count((err, count) => {
    if (err) return res.status(500).send();
    if (count > 2) return res.status(400).send('Vous ne pouvez sélectionner plus de deux humeurs');
  });
  // 2. Deuxième contrôle si tous les mots existent
  Words.find({ key: { $in: req.body.words } }, { _id: 0, word: 0, mood:0 }).count((err, count) => {
    if (err) return res.status(500).send();
    if (count < 6) return res.status(400).send('Au moins une des clés envoyées ne correspond à aucun mot.');
    const newInput = {
      date: new Date(),
      words: req.body.words
    };
    // On enregistre l'input dans la base de données
    Inputs.insertOne(newInput)
    .then((insert) => {
      // On récupère les données enregistrées
      Inputs.findOne({ _id: insert.insertedId })
      .then((input) => {
        // On envoie le socket pour actualiser l'arbre
        req.app.io.emit('new_inputs',input.words);
      });
      return res.status(200).send({ insertedCount: insert.insertedCount, insertedId: insert.insertedId });
    })
    .catch(err => {
      console.log(err);
    });
  });
});

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

        res.status(200).send({inputs});
    }).catch(err=>{console.log(err);});

});




module.exports = router;
