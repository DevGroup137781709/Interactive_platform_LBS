/**
 * Created by qianzise on 2015/4/27.
 */

/*
 * 参照混合的构造函数/原型方式定义伪类
 * function Car(sColor,iDoors,iMpg) {
 this.color = sColor;
 this.doors = iDoors;
 this.mpg = iMpg;
 this.drivers = new Array("Mike","John");

 if (typeof Car._initialized == "undefined") {
 Car.prototype.showColor = function() {
 alert(this.color);
 };

 Car._initialized = true;
 }
 }
 *
 * */

var async = require('async');




var regester =function(reqJson){
    this.reqJson=reqJson;

    this.type = reqJson.userInfo.userType;


//判断用户类型,选择对应的表查询


    this.userData=require('../model_user.js');




}


/*
 * 该函数用户判断用户名是否冲突,冲突返回0,不冲突返回1
 * */

regester.prototype.checkNameAndEmailIsAble=function(callback){

    var _name= this.reqJson.userInfo.name;
    var _email= this.reqJson.userInfo.email;


    var _type=this.type;
    var _userData=this.userData;




    //此处必须同步异步回调的结果,
    async.series({

        name:function(callback){

            _userData.findOne({where:{name:_name}}).then(function(user){
                    if(user==null){
                        callback(null,0);
                    }else{
                        callback(null,1);
                    }

                });

        },
        email:function(callback){
            _userData.findOne({where:{email:_email}}).then(function(user){
                if(user==null){
                    callback(null,0);
                }else{
                    callback(null,1);
                }

            });
        }


    },function(err,results){




        if(err){
            callback('err');
        }
        var flat=0;
        //1表示对应项冲突,0表示不冲突
        //这里results为一个对象{ name: 1|0, email: 1|0 }
        if(results.name==1){
            //用户名冲突
            flat=0;
        }else if(results.email==1){
            //邮箱冲突
            flat=1;
        }else{
            flat=2;
        }
        callback(flat);


    });

};

regester.prototype.addUser=function(){
    //传入用户参数进行注册

    var name=this.reqJson.userInfo.name;
    var type=this.reqJson.userInfo.userType;
    var email=this.reqJson.userInfo.email;
    var password=this.reqJson.userInfo.password;
    var sex=this.reqJson.userInfo.sex;
    this.userData.create({type:type,name:name,email:email,password:password,sex:sex}).then(function(user){

        if(user!=null){
            return 1;
        }


    });




};


module.exports = regester ;