/**
 * ���ڿ����û���¼��α��
 *
 */


var login=function(userJson){
    this.userJson=userJson;
//��ʼ����Ҫ�û���Ϣ
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
    var flat=0;//���ڱ���Ƿ�ɹ���֤��¼��Ϣ   0δ�ҵ��û��� 1������� 2������ȷ
    if(this.userJson.userInfo.name==null&&this.userJson.userInfo.email==null){
        console.log('err');
        //δ����
    }else{
        //�û�����¼
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
                //�ҵ�key[�û�����������]
                if(password==result[0].password){
                    //������ȷ
                    flat=2;

                }else{
                    //�������
                    flat=1;

                }
            }else{
                //δ�ҵ�key[�û�����������]
                flat=0;

            }
            callback(flat);

        });


    }

};


module.exports = login ;