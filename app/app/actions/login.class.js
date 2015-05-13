/**
 * 用于控制用户登录的伪类
 *
 */


var login=function(userJson){
    this.userJson=userJson;
//初始化必要用户信息
    if(userJson.userInfo.userType==0){
        this.tableName='basedata_host';
    }else{
        this.tableName='basedata_user';
    }

    this.db =  require('rapid-mysql').instance({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '1237891379',
        resource: 'host_data'
    });

}

login.prototype.doLogin=function(callback){
    var flat=0;//用于标记是否成功验证登录信息   0未找到用户名 1密码错误 2密码正确
    if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
        console.log('err');
        //未处理
    }else{
        //用户名登录
        var password=this.userJson.userInfo.password;
        var key;
        var value;
        if(this.userJson.userInfo.name!=''){
            key='name';
            value=this.userJson.userInfo.name;
        }else if(this.userJson.userInfo.email!=''){
            key='email';
            value=this.userJson.userInfo.email;
        }

        this.db.query("SELECT * FROM "+this.tableName+" WHERE "+key+"='"+value+"'").then(function(result){

            if(result[0]!=null){
                //找到key[用户名或者邮箱]
                if(password==result[0].password){
                    //密码正确
                    flat=2;

                }else{
                    //密码错误
                    flat=1;

                }
            }else{
                //未找到key[用户名或者邮箱]
                flat=0;

            }
            callback(flat);

        });


    }

};


module.exports = login ;