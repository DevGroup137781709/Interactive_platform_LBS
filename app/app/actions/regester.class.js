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



var regester =function(_type,_name,_email,_password){


    this.type = _type;
    this.name = _name;
    this.email = _email;
    this.password = _password;

//判断用户类型,选择对应的表查询
    if(this.type==0){
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


/*
* 该函数用户判断用户名是否冲突,冲突返回0,不冲突返回1
* */

regester.prototype.checkNameAndEmailIsAble=function(callback){


    var _name=this.name;
    var _email=this.email;
    var _db=this.db;

    var _table=this.tableName;


    //此处必须同步异步回调的结果,
    async.series({

        name:function(callback){
            _db.findOne(_table,{'name':_name},function(err,result){

                if(err){
                    console.log(err);
                    callback(null,0)
                }
                if(result.name==_name){
                    callback(null,1);

                }else{
                    callback(null,0)
                }
        })},
        email:function(callback){
            _db.findOne(_table,{'email':_email},function(err,result){
                if(err){
                    callback(null,0)
                }
                if(result.email==_email){
                    callback(null,1);

                }else{
                    callback(null,0)
                }

        })}


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

regester.prototype.addUser=function(data){
    //传入用户参数进行注册
    this.db.insert(this.tableName,{name:data.userInfo.name,sex:data.userInfo.sex,email:data.userInfo.email,user_pw:data.userInfo.password}).then(function(){

    });


};


module.exports = regester ;