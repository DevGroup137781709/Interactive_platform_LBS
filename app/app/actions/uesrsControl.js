/*
*
* 用户信息交互控制器
* 本控制器用于处理登录，注册，获取用户信息等用户相关的请求
* 1.注册信息的处理,
*               检查用户名是否冲突[完成][中文+英文测试完毕]
*
* AJAX传入json格式如下：
*        ｛
*         method:'register','login','getUserInfo',
*         userInfo{
*                   userType: 0策划者 1观众 默认1
*                   name:
*                   sex:
*                   email:
*                   password:
*                    }
*         ｝
*
*
* 传出json格式
*        {
*        registerRes:{
*                      state:0注册失败用户名重复,1注册失败邮箱已经使用过,2注册成功
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
    var reqjson;//取回来的数据
    var resjson;//发送出去的数据


    if(req.method!='POST'){
        //一律用POST提交数据
        res.end('you must use POST for sending');
    }

    req.on('data',function(data){
        reqjson=eval('('+data+')');
        console.dir(reqjson);
        //中文乱码在前端加xmlHttprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");解决

        switch (reqjson.method)
        {
            case 'register':
                var CRegister =  require('./regester.class.js');//加载注册模块
                var register =new CRegister(reqjson.userInfo.userType,reqjson.userInfo.name,reqjson.userInfo.email,reqjson.userInfo.password);

                register.checkNameIsAble(function(state){
                    //如果用户名不重复,state为0,重复返回1
                    if(state==0){
                        resjson="{'registerRes':{'state':"+state+"}}";
                        console.log(resjson);
                        res.write(resjson);//发送数据到缓存区[未真实发送]
                        res.end();//发送数据
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
    new_element.setAttribute("src",path);// 在这里引入了其他js
    document.body.appendChild(new_element);

}

