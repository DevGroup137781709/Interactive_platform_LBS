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
*         method:'register','login','getUserInfo','logout','changePassword','takePartIn',                   //����ǵ�¼�Ļ�,ֻ��Ҫ��һ��name����email,������߶���,��Ĭ���û�����������
*         userInfo{
*                   userType: 0�߻��� 1���� Ĭ��1
*                   name:
*                   sex: 0Ů 1��
*                   email:
*                   password:
*                   newPassword:
*                    }
*         ��
*
*         takePartIn:{
*                       partyID:
*         }
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
//�﷨��¶��


var object =    //����Сд��object�����࣬����ʵ��������ķ�����
{
    isA: function(aType)   //һ���ж�������֮���Լ���������֮���ϵ�Ļ�������
    {
        var self = this;
        while(self)
        {
            if (self == aType)
                return true;
            self = self.Type;
        };
        return false;
    }
};

function Class(aBaseClass, aClassDefine)    //������ĺ��������������༰�̳й�ϵ
{
    function class_()   //���������ʱ������
    {
        this.Type = aBaseClass;    //���Ǹ�ÿһ����Լ��һ��Type���ԣ�������̳е���
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //�������ȫ�����嵽��ǰ��������
    };
    class_.prototype = aBaseClass;
    return new class_();
};

function New(aClass, aParams)   //��������ĺ���������������Ķ��󴴽�
{
    function new_()     //�����������ʱ������
    {
        this.Type = aClass;    //����Ҳ��ÿһ������Լ��һ��Type���ԣ��ݴ˿��Է��ʵ�������������
        if (aClass.Create)
            aClass.Create.apply(this, aParams);   //����Լ��������Ĺ��캯������Create�����DELPHI�Ƚ�����
    };
    new_.prototype = aClass;
    return new new_();
};





var express = require('express');
var router = express.Router();


/* GET home page. */
router.post('/', function(req, res, next) {
    var reqjson;//ȡ����������
    reqjson=req.body;

 //   reqjson=JSON.parse(req.body.data);
    var resjson={};//���ͳ�ȥ������




    resjson.userInfo={};



    switch (reqjson.method)
    {
        case 'register':
            /*
             * ע��  �˴��������Ż�,�п���˵, ��findOrCreate����
             * */


        //    var CRegister =  require('./user.class.js');//����ע��ģ��
        //    var register =new CRegister(reqjson);
            var user=New(require('./user.class.js'),[reqjson]);
            resjson.registerRes={};
            user.checkNameAndEmailIsAble(function(flat){

                if(flat==2) {
                    //����ͻ,��ʼע��

                    user.addUser(function (state) {
                        if (state == 1) {
                            //�ɹ�
                            flat=2;

                        } else if (state == 0) {
                            //ʧ��
                            flat=3;

                        }

                        resjson.registerRes.state=flat;
                        res.json(resjson);
                        res.end();

                    });
                }


            });


            break;
        case 'login':
            /*
             * ��¼
             * */
            var user=New(require('./user.class.js'),[reqjson]);

            resjson.login={};
            user.doLogin(function(flat,userInfo){
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





            var user=New(require('./user.class.js'),[req.session.userID]);
            var CVMS=require('../VMS/VMS.js');
            var VMS=new CVMS();


            if(VMS.isLogin(req.session)){
                //��֤�û��Ѿ���¼�ɹ�

                user.getInfo(function(result){

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
            var user=New(require('./user.class.js'),[req.session.userID]);

            var CVMS=require('../VMS/VMS.js');
            var VMS=new CVMS();
            if(VMS.isLogin(req.session)) {


                user.changeInfo('password',reqjson.userInfo.password,reqjson.userInfo.newPassword, function (state) {
                    resjson.changePasswordRes={};
                    resjson.changePasswordRes.state=state;
                    res.send(resjson);


                });


            }
            break;


        case 'takePartIn':
            var user=New(require('./user.class.js'),[req.session.userID]);

            var CVMS=require('../VMS/VMS.js');

            var VMS=new CVMS();
            if(VMS.isLogin(req.session)) {

                user.takePartIn(reqjson.takePartIn.partyID,reqjson.takePartIn.state,function(state){
                    res.json({takePartIn:{state:state}});
                    res.end();

                })


            }else{
                res.json({takePartIn:{state:-1}})
                res.end();
            }




            break;

    }

});
router.get('/:type/:ID', function(req, res, next) {
    var ID=req.params.ID;
    if(req.params.ID==0){

        ID=req.session.userID;


    }


    console.log(ID)
    if(req.params.type.toLowerCase()=='info') {
        // infoҳ��
        var user = New(require('./user.class.js'), [ID]);


        user.getInfo(function (result) {

            var party = New(require('../party/party.class.js'), []);

            var async = require('async');


            async.series({
                    one:function(callback_1){

                        if(result.userInfo.type==0){
                            //�ٰ췽,���ﴦ�����������


                            if((result.userInfo.host_holdedpartys.length==0)&&(result.userInfo.host_holdingpartys.length==0)){
                                result.userInfo.host_holdingpartys_names = [];
                                result.userInfo.host_holdedpartys_names = [];
                                callback_1();
                                return ;
                            }


                            if(result.userInfo.host_holdingpartys.length!=0){
                                result.userInfo.host_holdingpartys_names = [];
                                async.each(result.userInfo.host_holdingpartys, function (data, callback) {
                                    party.getInfoByID(data, ['ID', 'name'], function (_res) {
                                        result.userInfo.host_holdingpartys_names.push(_res.name);



                                    });


                                });

                            }

                            if(result.userInfo.host_holdedpartys.length!=0){
                                result.userInfo.host_holdedpartys_names = [];
                                async.each(result.userInfo.host_holdedpartys, function (data, callback) {
                                    party.getInfoByID(data, ['ID', 'name'], function (_res) {
                                        result.userInfo.host_holdedpartys_names.push(_res.name);
                                            if(result.userInfo.host_holdedpartys_names.length==result.userInfo.host_holdedpartys.length){
                                                callback_1();
                                            }
                                    });
                                });

                            }





                        }else{
                            //��ͨ�û�,�����Ǵ������������,

                            if(result.userInfo.user_takenpartys.length!=0){
                                async.each(result.userInfo.user_takenpartys, function (data, callback) {
                                    result.userInfo.user_takenpartys_names = [];
                                    party.getInfoByID(data, ['ID', 'name'], function (_res) {

                                        result.userInfo.user_takenpartys_names.push(_res.name);


                                        if(result.userInfo.user_takenpartys_names.length==result.userInfo.user_takenpartys.length){

                                            callback_1();
                                        }


                                    });


                                });


                            }else{
                                result.userInfo.user_takenpartys_names = []
                                callback_1();
                            }


                        }




                    },
                    two:function(callback_2) {
                   //     console.log(result.userInfo)



                           res.render('userinfo', {
                               userName: result.userInfo.name,
                               userType:result.userInfo.type,
                               userEmail: result.userInfo.email,
                               userSex: result.userInfo.sex,
                               takenpartys: result.userInfo.user_takenpartys_names,
                               takenpartys_ID:result.userInfo.user_takenpartys,
                               holdingpartys: result.userInfo.host_holdingpartys_names,
                               holdingpartys_ID:result.userInfo.host_holdingpartys,
                               holdedpartys:result.userInfo.host_holdedpartys_names,
                               holdedpartys_ID:result.userInfo.host_holdedpartys

                           });


                           res.end();
                        callback_2();
                   }
        }),function(err,result){


            };

        });


    }





});

module.exports = router;

