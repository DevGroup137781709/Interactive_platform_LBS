
require([
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojo/ready",
    "dijit/_base/manager",
    "dojox/mobile/compat",
    "dojox/mobile/Button",
    "dojox/mobile/ComboBox",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/ListItem",
    "dojox/mobile/TabBar",
    "dojox/mobile/RoundRectList"
]);

var ml = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var url='/user/';

function reg(){
    var type;
    var sex;


    if(dijit.byId("type").value=='on'){
        type=1;
    }else if(dijit.byId("type").value=='off'){
        type=0;
    }

    if(dijit.byId("sex").value=='on'){
        sex=0;
    }else if(dijit.byId("sex").value=='off'){
        sex=1;
    }


    if($('#newusername').val()!=""){
        if($('#password1').val()==$('#password2').val()){
            if(ml.test($('#email').val())){
                $.post(url,{
                        method:'register',
                        userInfo:{userType:type,
                            name:$('#newusername').val(),
                            sex:sex,
                            password:$('#password1').val(),
                            email:$('#email').val()}}
                    ,function(data,status){
                        //do something

                        if(data.registerRes.state==0)
                            $('#regsug').text("注册失败,用户名重复");
                        if(data.registerRes.state==1)
                            $('#regsug').text("注册失败,邮箱已被使用");
                        if(data.registerRes.state==2)
                        //
                            if(data.registerRes.state==3)
                                $('#regsug').text("注册失败,内部错误");

                    })
            }
            else
            {
                $('#sug').text("请输入正确的邮箱格式");
            }
        }
        else
        {
            $('#sug').text("两次密码输入不一致");
        }


    }
    else
    {
        $('#sug').text("请输入用户名");
    }



}
