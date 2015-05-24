/**
 * 用于控制用户登录的伪类
 *
 */
var login=function(userJson){
    this.userJson=userJson;
//初始化必要用户信息


}

login.prototype.doLogin=function(callback){
    var flat=0;//用于标记是否成功验证登录信息   0未找到用户名 1密码错误 2密码正确
    if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
        console.log('err');
        //未处理
    }else{
        //用户名登录
        var _password=this.userJson.userInfo.password;
        var _name=this.userJson.userInfo.name;
        var _email=this.userJson.userInfo.email;




        this.userData=require('../model_user.js');

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


            callback(flat);


        });





    }

};


module.exports = login ;