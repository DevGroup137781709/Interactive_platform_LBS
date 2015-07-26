/**
 * 用于控制用户登录的伪类
 *
 */




/*
 var userclass=function(data){


 if(isNaN(data)){//重载
 this.ID=data.userInfo.ID;
 this.userJson=data;
 }else {
 this.ID=data;

 }

 this.userData=require('./model_user.js');




 //初始化必要用户信息


 }

 userclass.prototype.doLogin=function(callback){

 var flat=0;//用于标记是否成功验证登录信息   0未找到用户名 1密码错误 2密码正确
 if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
 console.log('err');
 //未处理
 }else{
 //用户名登录
 var _password=this.userJson.userInfo.password;
 var _name=this.userJson.userInfo.name;
 var _email=this.userJson.userInfo.email;

 this.userData.findOne({where:{$or:[{name:_name},{email:_email}]}}).then(function(result){

 if(result==null){
 //没有找到用户名或者邮箱
 flat=0;

 }else{
 if(result.dataValues.password==_password){
 flat=2;//密码正确
 }else{
 flat=1;//密码错误
 }
 }
 if(flat==2){
 callback(flat,result.dataValues);
 }else{
 callback(flat);
 }





 }).catch(function(err){
 //未知错误
 callback(1);

 });










 }

 };


 userclass.prototype.checkNameAndEmailIsAble=function(callback){

 var _name= this.userJson.userInfo.name;
 var _email= this.userJson.userInfo.email;

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

 userclass.prototype.addUser=function(callback){
 //传入用户参数进行注册


 var name=this.userJson.userInfo.name;
 var type=this.userJson.userInfo.userType;
 var email=this.userJson.userInfo.email;
 var password=this.userJson.userInfo.password;
 var sex=this.userJson.userInfo.sex;

 this.userData.create({type:type,name:name,email:email,password:password,sex:sex}).then(function(user){
 if(user!=null){
 callback(1);
 }else{
 callback(0);

 }
 }).catch(function(err){

 if(err){callback(0);}

 });



 };


 userclass.prototype.getInfo=function(callback){

 var _ID=this.ID;

 this.userData.findOne({where:{id:_ID}}).then(function(result){
 if(result==null){
 throw new Error('怎么可能,这里不应该出错的');
 }else{
 var resjson=new Object();;
 resjson.userInfo=new Object();
 resjson.userInfo.ID=result.ID;
 resjson.userInfo.type=result.type;
 resjson.userInfo.name=result.name;
 resjson.userInfo.email=result.email;
 resjson.userInfo.sex=result.sex;
 resjson.host_holdingpartys=result.host_holdingpartys.split(',');//数组形式传回
 //   resjson.userInfo.host_holdingpartys=result.host_holdingpartys;
 resjson.userInfo.host_holdedpartys=result.host_holdedpartys.split(',');
 resjson.userInfo.user_takenpartys=result.user_takenpartys.split(',');
 resjson.userInfo.registerTime=result.registerTime;

 callback(resjson);

 }


 });


 };



 userclass.prototype.changeInfo=function(field,oldValue,newValue,callback){

 var state=0;//0密码错误 1密码正确


 if(field=='password'){

 //这里其实本来只用于改密码,不过这里先写死,或许以后有需求

 var _ID=this.ID;

 this.userData.update({password:newValue},{where:{ID:_ID,password:oldValue}}).then(function(affectedRows){
 if(affectedRows==0){
 //密码错误
 state=0;
 }else{
 //修改密码成功
 state=1;

 }
 callback(state);



 }).catch(function(err){
 //未知错误
 callback(0)

 });




 }



 }

 userclass.prototype.setSesionuserID=function(ID){
 this.ID=ID;


 }




 userclass.prototype.getInfo=function(callback){

 var _ID=this.ID;

 this.userData.findOne({where:{id:_ID}}).then(function(result){
 if(result==null){
 throw new Error('怎么可能,这里不应该出错的');
 }else{
 var resjson={};
 resjson.userInfo={};
 resjson.userInfo.ID=result.ID;
 resjson.userInfo.type=result.type;
 resjson.userInfo.name=result.name;
 resjson.userInfo.email=result.email;
 resjson.userInfo.sex=result.sex;
 resjson.userInfo.host_holdingpartys=String(result.host_holdingpartys).split(',');//这里处理下,返回数组,这里以后要处理下,返回给用户的不应该只是ID,这个在写好party的控制器后修改
 resjson.userInfo.host_holdedpartys=String(result.host_holdedpartys).split(',');
 resjson.userInfo.user_takenpartys=String(result.user_takenpartys).split(',');
 resjson.userInfo.registerTime=result.registerTime;

 callback(resjson);

 }


 });


 };



 userclass.prototype.changeInfo=function(field,oldValue,newValue,callback){

 var state=0;//0密码错误 1密码正确


 if(field=='password'){

 // 这里其实本来只用于改密码,不过这里先写死,或许以后有需求

 var _ID=this.ID;

 this.userData.update({password:newValue},{where:{ID:_ID,password:oldValue}}).then(function(affectedRows){
 if(affectedRows==0){
 //密码错误
 state=0;


 }else{
 //修改密码成功
 state=1;

 }

 callback(state);



 });




 }



 }

 */

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




var async = require('async');

var  userclass =Class(object,
    {
        Create : function(data){


            if(isNaN(data)){//重载
                this.ID=data.userInfo.ID;

                this.userJson=data;
            }else {
                this.ID=data;

            }

            this.userData=require('./model_user.js');

            //初始化必要用户信息


        },

        doLogin:function(callback){

            var flat=0;//用于标记是否成功验证登录信息   0未找到用户名 1密码错误 2密码正确
            if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
                console.log('err');
                //未处理
            }else{
                //用户名登录
                var _password=this.userJson.userInfo.password;
                var _name=this.userJson.userInfo.name;
                var _email=this.userJson.userInfo.email;

                this.userData.findOne({where:{$or:[{name:_name},{email:_email}]}}).then(function(result){

                    if(result==null){
                        //没有找到用户名或者邮箱
                        flat=0;

                    }else{
                        if(result.dataValues.password==_password){
                            flat=2;//密码正确
                        }else{
                            flat=1;//密码错误
                        }
                    }
                    if(flat==2){
                        callback(flat,result.dataValues);
                    }else{
                        callback(flat);
                    }



                }).catch(function(err){
                    //未知错误
                    callback(1);

                });




            }

        },

        checkNameAndEmailIsAble:function(callback){

            var _name= this.userJson.userInfo.name;
            var _email= this.userJson.userInfo.email;

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

        },

        addUser:function(callback){
            //传入用户参数进行注册


            var name=this.userJson.userInfo.name;
            var type=this.userJson.userInfo.userType;
            var email=this.userJson.userInfo.email;
            var password=this.userJson.userInfo.password;
            var sex=this.userJson.userInfo.sex;

            this.userData.create({type:type,name:name,email:email,password:password,sex:sex}).then(function(user){
                if(user!=null){
                    callback(1);
                }else{
                    callback(0);

                }
            }).catch(function(err){
                console.error(err);

                if(err){callback(0);}

            });



        },

        getInfo:function(callback){

            var _ID=this.ID;

            this.userData.findOne({where:{id:_ID}}).then(function(result){
                if(result==null){
                    throw new Error('怎么可能,这里不应该出错的');
                }else{
                    var resjson=new Object();;
                    resjson.userInfo=new Object();
                    resjson.userInfo.ID=result.ID;
                    resjson.userInfo.type=result.type;
                    resjson.userInfo.name=result.name;
                    resjson.userInfo.email=result.email;
                    //        resjson.userInfo.sex=result.sex;
                    if(result.sex==0){
                        resjson.userInfo.sex='女';
                    }else if(result.sex==1){
                        resjson.userInfo.sex='男';
                    }
                    if(result.host_holdingpartys==null){
                        resjson.userInfo.host_holdingpartys='';

                    }else{
                        resjson.userInfo.host_holdingpartys=result.host_holdingpartys.split(',');//数组形式传回

                    }

                    if(result.host_holdedpartys==null){
                        resjson.userInfo.host_holdedpartys='';

                    }else{
                        resjson.userInfo.host_holdedpartys=result.host_holdedpartys.split(',');

                    }

                    if(result.user_takenpartys==null){
                        resjson.userInfo.user_takenpartys='';

                    }else{
                        resjson.userInfo.user_takenpartys=result.user_takenpartys.split(',');

                    }


                    resjson.userInfo.registerTime=result.registerTime;

                    callback(resjson);

                }


            });


        },

        changeInfo:function(field,oldValue,newValue,callback){

            var state=0;//0密码错误 1密码正确


            if(field=='password'){
                /*
                 * 这里其实本来只用于改密码,不过这里先写死,或许以后有需求
                 * */
                var _ID=this.ID;

                this.userData.update({password:newValue},{where:{ID:_ID,password:oldValue}}).then(function(affectedRows){
                    if(affectedRows==0){
                        //密码错误
                        state=0;
                    }else{
                        //修改密码成功
                        state=1;

                    }
                    callback(state);



                }).catch(function(err){
                    //未知错误
                    callback(0)

                });




            }



        }



    });






module.exports = userclass ;