/**
 * ���ڿ����û���¼��α��
 *
 */
var login=function(userJson){
    this.userJson=userJson;
//��ʼ����Ҫ�û���Ϣ


}

login.prototype.doLogin=function(callback){
    var flat=0;//���ڱ���Ƿ�ɹ���֤��¼��Ϣ   0δ�ҵ��û��� 1������� 2������ȷ
    if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
        console.log('err');
        //δ����
    }else{
        //�û�����¼
        var _password=this.userJson.userInfo.password;
        var _name=this.userJson.userInfo.name;
        var _email=this.userJson.userInfo.email;




        this.userData=require('../model_user.js');

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


            callback(flat);


        });





    }

};


module.exports = login ;