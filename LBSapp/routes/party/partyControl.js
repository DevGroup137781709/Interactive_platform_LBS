
/*
* �����Ϣ������
* ���ڴ���:�����Ϣ����,�����Ϣ�޸�����,�����Ҹ�������,ͶƱ����
*
*
* ����json��ʽ:{
*               method:'addParty','getPartyInfo','renewPartyInfo','comment'
*               addParty:{
*                       name:
*                       time:
*                       location:
*                       location_lo_la:
*                       type:
*                       programs_actor:
*                       hostname:   //���췽����Ĭ�ϼ����Լ�,
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
*                           partyDate://���������ʶ,��ʱ����Ϊ�����׼��ȷ����Ҫ�����ݱ�׼
*                           ID:������׼����������ʱ��,���ʱ���ظ�,���������,ID��Ҳ���÷�Ӧ�˷�����ʱ��˳��
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
var formidable = require('formidable');//ʹ���м�� ,�����ϴ��ļ�
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

