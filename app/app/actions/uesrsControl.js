/*
*
* �û���Ϣ����������
* �����������ڴ����¼��ע�ᣬ��ȡ�û���Ϣ���û���ص�����
* 1.ע����Ϣ�Ĵ���,
*               ����û����Ƿ��ͻ[���][����+Ӣ�Ĳ������]
*               ��¼��Ϣ��֤[���][����+Ӣ�Ĳ������]
*
* AJAX����json��ʽ���£�
*        ��
*         method:'register','login','getUserInfo',
*         userInfo{
*                   userType: 0�߻��� 1���� Ĭ��1
*                   name:
*                   sex:
*                   email:
*                   password:
*                    }
*         ��
*
*
* ����json��ʽ
*        {
*        registerRes:{
*                      state:0ע��ʧ���û����ظ�,1ע��ʧ�������Ѿ�ʹ�ù�,2ע��ɹ�,3�ڲ�δ֪����
*                       }
*        loginRes:{
*                   state: 0δ�ҵ��û��� 1������� 2������ȷ
*               }
*
*
*
*
*
*
*        }
*
*

*
*
* */
var server = rapid.use("rapid-httpserver");

server.defineAction("uesrsControl",['default_request','default_response','cookie'] ,function (req, res, cookie) {
    var reqjson;//ȡ����������
    var resjson;//���ͳ�ȥ������



    if(req.method!='POST'){
        //һ����POST�ύ����
        res.end('you must use POST for sending');
    }

    req.on('data',function(data){
        reqjson=eval('('+data+')');

        //����������ǰ�˼�xmlHttprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");���

        switch (reqjson.method)
        {
            case 'register':
                /*
                * ע��
                * */
                var CRegister =  require('./regester.class.js');//����ע��ģ��
                var register =new CRegister(reqjson.userInfo.userType,reqjson.userInfo.name,reqjson.userInfo.email,reqjson.userInfo.password);
                register.checkNameAndEmailIsAble(function(flat){
                    if(flat==2){
                        //����ͻ,��ʼע��
                        register.addUser(reqjson);
                    }
                    resjson="{'registerRes':{'state':"+flat+"}}"
                    sendDta(res,resjson);
                });

                break;
            case 'login':
                /*
                * ��¼
                * */
                var Cloginer=require('./login.class.js');
                var loginer=new Cloginer(reqjson);
                loginer.doLogin(function(flat){
                   //flat  0δ�ҵ��û��� 1������� 2������ȷ
                    resjson="{'loginRes':{'state':"+flat+"}}";
                    console.log(resjson);
                    sendDta(res,resjson);

                });


                break;
            case 'getUserInfo':
                break;




        }




    });





});


function sendDta(res,json){
    res.write(json);//�������ݵ�������[δ��ʵ����]
    res.end();//��������
}