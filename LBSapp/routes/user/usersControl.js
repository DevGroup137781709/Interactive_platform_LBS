/*
*
* 用户信息交互控制器
* 本控制器用于处理登录，注册，获取用户信息等用户相关的请求
* 1.注册信息的处理,
*               检查用户名是否冲突[完成][中文+英文测试完毕]
*               登录信息验证[完成][中文+英文测试完毕]
*
* AJAX传入json格式如下：
*        ｛
*         method:'register','login','getUserInfo','logout','changePassword','takePartIn',                   //如果是登录的话,只需要传一个name或者email,如果两者都有,则默认用户名优先邮箱
*         userInfo{
*                   userType: 0策划者 1观众 默认1
*                   name:
*                   sex: 0女 1男
*                   email:
*                   password:
*                   newPassword:
*                    }
*         ｝
*
*         takePartIn:{
*                       partyID:
*         }
*
*
* 传出json格式
*        {
*        registerRes:{
*                      state:0注册失败用户名重复,1注册失败邮箱已经使用过,2注册成功,3内部未知错误
*                       },
*        loginRes:{
*                   state: 0未找到用户名 1密码错误 2密码正确
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
*                               state:0 修改失败 1成功
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
//语法甘露：


var object =    //定义小写的object基本类，用于实现最基础的方法等
{
    isA: function(aType)   //一个判断类与类之间以及对象与类之间关系的基础方法
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

function Class(aBaseClass, aClassDefine)    //创建类的函数，用于声明类及继承关系
{
    function class_()   //创建类的临时函数壳
    {
        this.Type = aBaseClass;    //我们给每一个类约定一个Type属性，引用其继承的类
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //复制类的全部定义到当前创建的类
    };
    class_.prototype = aBaseClass;
    return new class_();
};

function New(aClass, aParams)   //创建对象的函数，用于任意类的对象创建
{
    function new_()     //创建对象的临时函数壳
    {
        this.Type = aClass;    //我们也给每一个对象约定一个Type属性，据此可以访问到对象所属的类
        if (aClass.Create)
            aClass.Create.apply(this, aParams);   //我们约定所有类的构造函数都叫Create，这和DELPHI比较相似
    };
    new_.prototype = aClass;
    return new new_();
};





var express = require('express');
var router = express.Router();


/* GET home page. */
router.post('/', function(req, res, next) {
    var reqjson;//取回来的数据
    reqjson=req.body;

 //   reqjson=JSON.parse(req.body.data);
    var resjson={};//发送出去的数据




    resjson.userInfo={};



    switch (reqjson.method)
    {
        case 'register':
            /*
             * 注册  此处可做个优化,有空再说, 用findOrCreate函数
             * */


        //    var CRegister =  require('./user.class.js');//加载注册模块
        //    var register =new CRegister(reqjson);
            var user=New(require('./user.class.js'),[reqjson]);
            resjson.registerRes={};
            user.checkNameAndEmailIsAble(function(flat){

                if(flat==2) {
                    //不冲突,开始注册

                    user.addUser(function (state) {
                        if (state == 1) {
                            //成功
                            flat=2;

                        } else if (state == 0) {
                            //失败
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
             * 登录
             * */
            var user=New(require('./user.class.js'),[reqjson]);

            resjson.login={};
            user.doLogin(function(flat,userInfo){
                //flat  0未找到用户名 1密码错误 2密码正确

                if(flat==2){
                    req.session.userID=userInfo.ID;
                    req.session.userName=userInfo.name;
                    req.session.userType=userInfo.type;
                    req.session.isLogin='yes';//设置登录成功sesion

                }
                    resjson.login.state=flat;
                    res.json(resjson);
                    res.end();


            });

            break;
        case 'getUserInfo':
            /*
            * 获取用户详细信息
            * */





            var user=New(require('./user.class.js'),[req.session.userID]);
            var CVMS=require('../VMS/VMS.js');
            var VMS=new CVMS();


            if(VMS.isLogin(req.session)){
                //验证用户已经登录成功

                user.getInfo(function(result){

                    resjson=result;
                    res.json(resjson);
                    res.end();

                });
            }
            break;
        case 'logout':

            /*
            * 退出登录
            * */

            req.session.destroy();//销毁session
            res.end();
            break;
        case 'changePassword':
            /*
            * 修改密码请求  0修改失败 1修改成功
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
        // info页面
        var user = New(require('./user.class.js'), [ID]);


        user.getInfo(function (result) {

            var party = New(require('../party/party.class.js'), []);

            var async = require('async');


            async.series({
                    one:function(callback_1){

                        if(result.userInfo.type==0){
                            //举办方,这里处理下晚会数组


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
                            //普通用户,这里是处理下晚会数组,

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

