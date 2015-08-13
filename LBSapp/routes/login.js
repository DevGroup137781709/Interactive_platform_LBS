/**
 * Created by qianzise on 2015/8/2.
 */
var express = require('express');
var test = express.Router();

/* GET home page. */
test.get('/', function(req, res, next) {

    var CVMS=require('./VMS/VMS.js');

    var VMS=new CVMS();

    console.log(req);

    console.log(VMS.isLogin(req.session));
    if(VMS.isLogin(req.session)){
     //   res.location('user/info/0');

        res.redirect('user/info/0');


    }else{

       // res.append('Cache-Control', 'no_cache');
       // res.append('Pragma', 'no-cache');
       // res.append('Expires', '-1');
        res.render('login',{});

    }


});


module.exports = test;
