/*
*
* �û���Ϣ����������
* �����������ڴ����¼��ע�ᣬ��ȡ�û���Ϣ���û���ص�����
* 1.ע����Ϣ�Ĵ���,
*               ����û����Ƿ��ͻ[���][����+Ӣ�Ĳ������]
*               ��¼��Ϣ��֤[���][����+Ӣ�Ĳ������]
*
* AJAX����json��ʽ���£�
*        ��
*         method:'register','login','getUserInfo',                   //����ǵ�¼�Ļ�,ֻ��Ҫ��һ��name����email,������߶���,��Ĭ���û�����������
*         userInfo{
*                   userType: 0�߻��� 1���� Ĭ��1
*                   name:
*                   sex:
*                   email:
*                   password:
*                    }
*         ��
*
*
* ����json��ʽ
*        {
*        registerRes:{
*                      state:0ע��ʧ���û����ظ�,1ע��ʧ�������Ѿ�ʹ�ù�,2ע��ɹ�,3�ڲ�δ֪����
*                       }
*        loginRes:{
*                   state: 0δ�ҵ��û��� 1������� 2������ȷ
*               }
*
*
*
*
*
*
*        }
*
*

*
*
* */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    var reqjson;//ȡ����������
    reqjson=req.body;
    var resjson=new Object();//���ͳ�ȥ������
    resjson.login=new Object();
    resjson.registerRes=new Object();




    switch (reqjson.method)
    {
        case 'register':
            /*
             * ע��  �˴��������Ż�,�п���˵, ��findOrCreate����
             * */
            var CRegister =  require('./regester.class.js');//����ע��ģ��
            var register =new CRegister(reqjson);
            register.checkNameAndEmailIsAble(function(flat){

                if(flat==2){
                    //����ͻ,��ʼע��
                    register.addUser();
                }
                resjson.registerRes.state=flat;
                res.json(resjson);
                res.end();
            });


            break;
        case 'login':
            /*
             * ��¼
             * */
            var Cloginer=require('./login.class.js');
            var loginer=new Cloginer(reqjson);
            loginer.doLogin(function(flat){
                //flat  0δ�ҵ��û��� 1������� 2������ȷ

                if(flat==2){
                    req.session.isLogin='yes';//���õ�¼�ɹ�sesion

                }
                    resjson.login.state=flat;
                    res.json(resjson);

                    res.end();




            });


            break;
        case 'getUserInfo':
            break;




    }

});
router.get('/', function(req, res, next) {
    res.end('you must use POST !');




});

module.exports = router;

