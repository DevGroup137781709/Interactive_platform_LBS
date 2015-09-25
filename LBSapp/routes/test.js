/**
 * Created by qianzise on 2015/9/6.
 */
var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {
    res.render('test', { });

});


module.exports = test;