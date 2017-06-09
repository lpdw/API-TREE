"use strict";
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
  const Inputs = db.get().collection('inputs');

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
  // On enregistre l'input dans la base de données
  Inputs.insertOne(input)
  .then(insert => {
    // On récupère les données enregistrées
    Inputs.findOne({_id:insert.insertedId})
    .then(input => {
      // On envoie le socket pour actualiser l'arbre
      req.app.io.emit("new_inputs",input);
    });
      res.status(200).send({"insertedCount":insert.insertedCount,"insertedId":insert.insertedId});
  })
  .catch(err => {
    console.log(err);
  })
});

/* GET all inputs with label and value send. */
router.get('/AllValue/:label/:value', (req, res, next) => {
  	const Inputs = db.get().collection('inputs');
  	Inputs.find({inputs:{ $elemMatch:{label:req.params.label,value:Number(req.params.value)}}},{date:1}).toArray().then(inputs => {
    	res.status(200).send(inputs);
  	});
});

/* GET nb input with label and value send. */
router.get('/NbInput/:label/:value', (req, res, next) => {
  	const Inputs = db.get().collection('inputs');
  	Inputs.find({inputs:{ $elemMatch:{label:req.params.label,value:Number(req.params.value)}}}).count().then(inputs =>{
  		console.log(inputs);
    	res.status(200).send({result:inputs});
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
        console.log(inputs);
        res.status(200).send({inputs});
    }).catch(err=>{console.log(err);});

});

module.exports = router;
