/**
 * 用于控制用户登录的伪类
 *
 */



var async = require('async');
var userclass=function(data){
    if(isNaN(data)){
        this.ID=data.userInfo.ID;
        this.userJson=data;
        this.userData=require('./model_user.js');

    }else {
        this.ID=data;
        this.userData=require('./model_user.js');

    }

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

userclass.prototype.addUser=function(){
    //传入用户参数进行注册

    var name=this.userJson.userInfo.name;
    var type=this.userJson.userInfo.userType;
    var email=this.userJson.userInfo.email;
    var password=this.userJson.userInfo.password;
    var sex=this.userJson.userInfo.sex;
    this.userData.create({type:type,name:name,email:email,password:password,sex:sex}).then(function(user){

        if(user!=null){
            return 1;
        }


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
            result.host_holdingpartys=resjson.userInfo.host_holdingpartys.split(',');
            console.log(result.host_holdingpartys);

         //   resjson.userInfo.host_holdingpartys=result.host_holdingpartys;
            resjson.userInfo.host_holdedpartys=result.host_holdedpartys;
            resjson.userInfo.user_takenpartys=result.user_takenpartys;
            resjson.userInfo.registerTime=result.registerTime;

            callback(resjson);

        }


    });


};



userclass.prototype.changeInfo=function(field,oldValue,newValue,callback){

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



        });




    }



}









module.exports = userclass ;