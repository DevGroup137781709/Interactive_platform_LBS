/**
 * ���ڿ����û���¼��α��
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

//��ʼ����Ҫ�û���Ϣ


}

userclass.prototype.doLogin=function(callback){
    var flat=0;//���ڱ���Ƿ�ɹ���֤��¼��Ϣ   0δ�ҵ��û��� 1������� 2������ȷ
    if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
        console.log('err');
        //δ����
    }else{
        //�û�����¼
        var _password=this.userJson.userInfo.password;
        var _name=this.userJson.userInfo.name;
        var _email=this.userJson.userInfo.email;



        this.userData.findOne({where:{$or:[{name:_name},{email:_email}]}}).then(function(result){
            if(result==null){
                //û���ҵ��û�����������
                flat=0;

            }else{
                if(result.dataValues.password==_password){
                    flat=2;//������ȷ
                }else{
                    flat=1;//�������
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

userclass.prototype.addUser=function(){
    //�����û���������ע��

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
            throw new Error('��ô����,���ﲻӦ�ó����');
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

    var state=0;//0������� 1������ȷ


    if(field=='password'){
        /*
         * ������ʵ����ֻ���ڸ�����,����������д��,�����Ժ�������
         * */
        var _ID=this.ID;

        this.userData.update({password:newValue},{where:{ID:_ID,password:oldValue}}).then(function(affectedRows){
            if(affectedRows==0){
                //�������
                state=0;


            }else{
                //�޸�����ɹ�
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
            throw new Error('��ô����,���ﲻӦ�ó����');
        }else{
            var resjson={};
            resjson.userInfo={};
            resjson.userInfo.ID=result.ID;
            resjson.userInfo.type=result.type;
            resjson.userInfo.name=result.name;
            resjson.userInfo.email=result.email;
            resjson.userInfo.sex=result.sex;
            resjson.userInfo.host_holdingpartys=String(result.host_holdingpartys).split(',');//���ﴦ����,��������,�����Ժ�Ҫ������,���ظ��û��Ĳ�Ӧ��ֻ��ID,�����д��party�Ŀ��������޸�
            resjson.userInfo.host_holdedpartys=String(result.host_holdedpartys).split(',');
            resjson.userInfo.user_takenpartys=String(result.user_takenpartys).split(',');
            resjson.userInfo.registerTime=result.registerTime;

            callback(resjson);

        }


    });


};



userclass.prototype.changeInfo=function(field,oldValue,newValue,callback){

    var state=0;//0������� 1������ȷ


    if(field=='password'){
        /*
         * ������ʵ����ֻ���ڸ�����,����������д��,�����Ժ�������
         * */
        var _ID=this.ID;

        this.userData.update({password:newValue},{where:{ID:_ID,password:oldValue}}).then(function(affectedRows){
            if(affectedRows==0){
                //�������
                state=0;


            }else{
                //�޸�����ɹ�
                state=1;

            }

            callback(state);



        });




    }



}









module.exports = userclass ;