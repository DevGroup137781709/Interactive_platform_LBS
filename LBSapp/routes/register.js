var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {
  res.render('register', { });

});


module.exports = test;
