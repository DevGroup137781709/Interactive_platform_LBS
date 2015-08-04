var ml = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var url='/user/';

function reg(){

    if($('#newusername').val()!=""){
        if($('#password1').val()==$('#password2').val()){
            if(ml.test($('#email').val())){
                $.post(url,{
                        method:'register',
                        userInfo:{userType:1,
                            name:$('#newusername').val(),
                            sex:$('#sex').val(),
                            password:$('#password1').val(),
                            email:$('#email').val()}}
                    ,function(data,status){
                        //do something
                        if($(data.registerRes.state)==0)
                            $('#sug').text("?注册失败,用户名重复");
                        if($(data.registerRes.state)==1)
                            $('#sug').text("注册失败,邮箱已被使用");
                        if($(data.registerRes.state)==2)
                        //
                            if($(data.registerRes.state)==3)
                                $('#sug').text("注册失败,内部错误");





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
