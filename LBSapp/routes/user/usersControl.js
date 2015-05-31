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
*         method:'register','login','getUserInfo','logout','changePassword',,                   //����ǵ�¼�Ļ�,ֻ��Ҫ��һ��name����email,������߶���,��Ĭ���û�����������
*         userInfo{
*                   userType: 0�߻��� 1���� Ĭ��1
*                   name:
*                   sex:
*                   email:
*                   password:
*                   newPassword:
*                    }
*         ��
*
*
* ����json��ʽ
*        {
*        registerRes:{
*                      state:0ע��ʧ���û����ظ�,1ע��ʧ�������Ѿ�ʹ�ù�,2ע��ɹ�,3�ڲ�δ֪����
*                       },
*        loginRes:{
*                   state: 0δ�ҵ��û��� 1������� 2������ȷ
*               },
*         userInfo;{
*                       ID:
*                       type:
*                       name:
*                       email:
*                       sex:
*                       host_holdingpartys:
*                       host_holdedpartys:
*                       user_takenpartys:
*                       registerTime:
*
*                   },
*         changePasswordRes:{
*                               state:0 �޸�ʧ�� 1�ɹ�
*
*                           }
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
    var resjson={};//���ͳ�ȥ������

    resjson.userInfo={};


    switch (reqjson.method)
    {
        case 'register':
            /*
             * ע��  �˴��������Ż�,�п���˵, ��findOrCreate����
             * */
            var CRegister =  require('./user.class.js');//����ע��ģ��
            var register =new CRegister(reqjson);
            resjson.registerRes={};
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
            var Cloginer=require('./user.class.js');
            var loginer=new Cloginer(reqjson);
            resjson.login={};
            loginer.doLogin(function(flat,userInfo){
                //flat  0δ�ҵ��û��� 1������� 2������ȷ

                if(flat==2){
                    req.session.userID=userInfo.ID;
                    req.session.userName=userInfo.name;
                    req.session.userType=userInfo.type;
                    req.session.isLogin='yes';//���õ�¼�ɹ�sesion

                }
                    resjson.login.state=flat;
                    res.json(resjson);
                    res.end();


            });

            break;
        case 'getUserInfo':
            /*
            * ��ȡ�û���ϸ��Ϣ
            * */

            if(req.session.isLogin=='yes'&&req.session.userID&&req.session.userName&&req.session.userType){
                //��֤�û��Ѿ���¼�ɹ�


                var CgetInfo=require('./user.class.js');
                var geter=new CgetInfo(req.session.userID);

                geter.getInfo(function(result){

                    resjson=result;
                    res.json(resjson);
                    res.end();

                });
            }
            break;
        case 'logout':
            /*
            * �˳���¼
            * */
            req.session.destroy();//����session
            res.end();
            break;
        case 'changePassword':

            /*
            * �޸���������  0�޸�ʧ�� 1�޸ĳɹ�
            * */
            if(req.session.isLogin=='yes'&&req.session.userID&&req.session.userName&&req.session.userType) {
                var CInfo = require('./user.class.js');
                var infoer = new CInfo(req.session.userID);

                infoer.changeInfo('password',reqjson.userInfo.password,reqjson.userInfo.newPassword, function (state) {
                    resjson.changePasswordRes={};
                    resjson.changePasswordRes.state=state;
                    res.send(resjson);


                });


            }
            break;

    }

});
router.get('/', function(req, res, next) {
    res.end('you must use POST !');


});

module.exports = router;

