/**
 * Created by qianzise on 2015/8/2.
 */
var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {
    res.render('login',{});

});


module.exports = test;
