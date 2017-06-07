'use strict'
var router = require('express').Router();
var request = require('request');

router.get('/',function(req,res,next){
	res.render('index',{title:"Je suis une home"});
});

module.exports = router;