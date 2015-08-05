/**
 * Created by qianzise on 2015/8/5.
 */
var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {
    res.render('map', { });

});


module.exports = test;
