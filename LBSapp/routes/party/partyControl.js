
/*
* 晚会信息控制器
* 用于处理:晚会信息请求,晚会信息修改请求,聊天室各项请求,投票请求
*
*
* 传入json格式:{
*               method:'addParty','getPartyInfo','renewPartyInfo','comment'
*               addParty:{
*                       name:
*                       time:
*                       location:
*                       location_lo_la:
*                       type:
*                       programs_actor:
*                       hostname:   //主办方这里默认加入自己,
*                       includeMyself: true false
*                       poster:
*                       detail:
*
*
*                       }
*               reqDetail:{location:
*                           range:
*                           type:'new','old',
*                           rows:
*                           partyDate://这个用作标识,用时间作为排序标准和确定需要的数据标准
*                           ID:辅助标准用于搜索的时候,如果时间重复,则按这个排序,ID号也正好反应了发布的时间顺序
*                           needed:'ID','name','time','location','location_lo_la','type','programs_actor','hostname','poster','detail'
*
*
*                       }
*
*
*               }
*
*
*
*
* */

var express = require('express');
var formidable = require('formidable');//使用中间件 ,用于上传文件
var router = express.Router();


router.post('/', function(req, res, next) {
    var reqJson=req.body;
    var resJson={};











    switch (reqJson.method)
    {
        case 'addParty':





            break;





    }



});


router.get('/', function(req, res, next) {
    res.end('you must use POST !');


});





function addPoster(req,ID,callback){

    var fs =require('fs');

    var form = new formidable.IncomingForm();
    var flat=0;
    form.keepAlive = true;
    form.keepExtensions = true;
    fs.mkdirSync('../public/images/parties/'+ID);
    form.uploadDir='../public/images/parties/'+ID;
    form.maxFieldsSize = 3 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {
        if(err ||files==null) {
            flat = 0;
        }else{
            flat = 1;
        }
        callback(flat);
    });



}






module.exports = router;

