/**
 * Created by qianzise on 2015/8/2.
 */
var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {

    var CVMS=require('./VMS/VMS.js');

    var VMS=new CVMS();



    if(VMS.isLogin(req.session)){
        res.redirect('user/info/0');


    }else{
        res.render('login',{});

    }


});


module.exports = test;
