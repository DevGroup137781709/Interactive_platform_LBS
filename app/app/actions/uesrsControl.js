/*
*
* �û���Ϣ����������
* �����������ڴ����¼��ע�ᣬ��ȡ�û���Ϣ���û���ص�����
* 1.ע����Ϣ�Ĵ���,
*               ����û����Ƿ��ͻ[���][����+Ӣ�Ĳ������]
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
*                      state:0ע��ʧ���û����ظ�,1ע��ʧ�������Ѿ�ʹ�ù�,2ע��ɹ�
*                       }
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
        console.dir(reqjson);
        //����������ǰ�˼�xmlHttprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");���

        switch (reqjson.method)
        {
            case 'register':
                var CRegister =  require('./regester.class.js');//����ע��ģ��
                var register =new CRegister(reqjson.userInfo.userType,reqjson.userInfo.name,reqjson.userInfo.email,reqjson.userInfo.password);

                register.checkNameIsAble(function(state){
                    //����û������ظ�,stateΪ0,�ظ�����1
                    if(state==0){
                        resjson="{'registerRes':{'state':"+state+"}}";
                        console.log(resjson);
                        res.write(resjson);//�������ݵ�������[δ��ʵ����]
                        res.end();//��������
                    }



                });

                break;
            case 'login':
                break;
            case 'getUserInfo':
                break;




        }




    });









});

function addjs(path){
    var new_element;
    new_element=document.createElement("script");
    new_element.setAttribute("type","text/javascript");
    new_element.setAttribute("src",path);// ����������������js
    document.body.appendChild(new_element);

}

