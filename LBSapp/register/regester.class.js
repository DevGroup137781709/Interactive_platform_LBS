/**
 * Created by qianzise on 2015/4/27.
 */

/*
 * ���ջ�ϵĹ��캯��/ԭ�ͷ�ʽ����α��
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


//�ж��û�����,ѡ���Ӧ�ı��ѯ


    this.userData=require('../model_user.js');




}


/*
 * �ú����û��ж��û����Ƿ��ͻ,��ͻ����0,����ͻ����1
 * */

regester.prototype.checkNameAndEmailIsAble=function(callback){

    var _name= this.reqJson.userInfo.name;
    var _email= this.reqJson.userInfo.email;


    var _type=this.type;
    var _userData=this.userData;




    //�˴�����ͬ���첽�ص��Ľ��,
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
        //1��ʾ��Ӧ���ͻ,0��ʾ����ͻ
        //����resultsΪһ������{ name: 1|0, email: 1|0 }
        if(results.name==1){
            //�û�����ͻ
            flat=0;
        }else if(results.email==1){
            //�����ͻ
            flat=1;
        }else{
            flat=2;
        }
        callback(flat);


    });

};

regester.prototype.addUser=function(){
    //�����û���������ע��

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