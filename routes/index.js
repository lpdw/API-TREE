'use strict'
var router = require('express').Router();

router.get('/',function(req,res,next){
	var mongoose = require('mongoose');
	// Connect to MongoDB and create/use database called todoAppTest
	mongoose.connect('mongodb://lpat:4heW78svFtR4@ds111622.mlab.com:11622/api-tree');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log("Connecté à la base de données !!");

	  	var inputsSchema = new mongoose.Schema({
		    date: Date,
		    inputs: [{
		      label : String,
		      value: String,
		    }]
		});
		var Input = mongoose.model('inputs', inputsSchema);
		Input.count(function (err, count) {
	    	if (err) return console.error(err);
	    	console.log(count);
	  	})

	 //  	Input.find(function (err, todos) {
		//   if (err) return console.error(err);
		//   console.log(todos)
		// });
	    var todo = new Input({date:new Date(),inputs:[{label:3,value:1},{label:2,value:0}]});
		// Save it to database
		todo.save(function(err){
		  if(err)
		    console.log(err);
		  else
		    console.log(todo);
		});
	});

	


	res.render('index',{title:"Je suis une home"});
});

module.exports = router;