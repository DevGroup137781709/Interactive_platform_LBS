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


var regester =function(_type,_name,_email,_password){


    this.type = _type;
    this.name = _name;
    this.email = _email;
    this.password = _password;

    this.db =  require('rapid-mysql').instance({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '1237891379',
        resource: 'host_data'
    });


}


/*
* �ú����û��ж��û����Ƿ��ͻ,��ͻ����0,����ͻ����1
* */

regester.prototype.checkNameIsAble=function(callback){
    var _name=this.name;


    this.db.findOne('basedata_user',{'user_name':_name}).then(function(obj){

        if(obj.user_name==_name){
            console.dir(obj);
            callback(1);
        }


    },function(err){
        //����Ҳ������߲��ҳ���
        callback(0);
    });

};


module.exports = regester ;