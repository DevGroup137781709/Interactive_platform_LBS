document.getElementById('topHead').innerHTML="登录";
require([
    "dojo/dom",
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojo/ready",
    "dojox/mobile/compat",
    "dojox/mobile/ComboBox",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/ListItem",
    "dojox/mobile/Button",
    "dojox/mobile/TabBar",
    "dojox/mobile/TextBox",
    "dijit/_base/manager"

]);





var url='/user/';
function enter(){
    if($('#username').val()=="")
        $('#logsug').text("请输入用户名");
    else if($('#password').val()=="")
        $('#logsug').text("请输入密码");
    else
        $.post(url,{
                method:'login',
                userInfo:{userType:1,
                    name:$('#username').val(),
                    password:$('#password').val(),
                    email:$('#email').val()}}
            ,function(data,status){
                if(data.login.state==0)
                    $('#sug').text("用户名不存在");
                if(data.login.state==1)
                    $('#sug').text("密码错误");
                if(data.login.state==2)
                {//这里是成功之后的事件。
                    //然后我们可以提供一个找回密码的渠道，这个后面再说啦。

                 //          document.getElementById('partyList').onclick();
                    document.getElementById("login_page").url='user/info/0';
                    loadJS('/javascripts/userInfo.js')

                    window.location.href='/';



                }
            }

        )




}
