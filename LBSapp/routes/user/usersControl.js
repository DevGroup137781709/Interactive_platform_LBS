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
*         method:'register','login','getUserInfo','logout','changePassword',,                   //如果是登录的话,只需要传一个name或者email,如果两者都有,则默认用户名优先邮箱
*         userInfo{
*                   userType: 0策划者 1观众 默认1
*                   name:
*                   sex:
*                   email:
*                   password:
*                   newPassword:
*                    }
*         ｝
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
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    var reqjson;//取回来的数据
    reqjson=req.body;
    var resjson={};//发送出去的数据

    resjson.userInfo={};


    switch (reqjson.method)
    {
        case 'register':
            /*
             * 注册  此处可做个优化,有空再说, 用findOrCreate函数
             * */
            var CRegister =  require('./user.class.js');//加载注册模块
            var register =new CRegister(reqjson);
            resjson.registerRes={};
            register.checkNameAndEmailIsAble(function(flat){

                if(flat==2){
                    //不冲突,开始注册
                    register.addUser();
                }
                resjson.registerRes.state=flat;
                res.json(resjson);
                res.end();
            });


            break;
        case 'login':
            /*
             * 登录
             * */
            var Cloginer=require('./user.class.js');
            var loginer=new Cloginer(reqjson);
            resjson.login={};
            loginer.doLogin(function(flat,userInfo){
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

            if(req.session.isLogin=='yes'&&req.session.userID&&req.session.userName&&req.session.userType){
                //验证用户已经登录成功


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
            * 退出登录
            * */
            req.session.destroy();//销毁session
            res.end();
            break;
        case 'changePassword':

            /*
            * 修改密码请求  0修改失败 1修改成功
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

