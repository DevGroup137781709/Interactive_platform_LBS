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
                            $('#sug').text("????????????");
                        if($(data.registerRes.state)==1)
                            $('#sug').text("???????????");
                        if($(data.registerRes.state)==2)
                        //????????
                            if($(data.registerRes.state)==3)
                                $('#sug').text("??????????");





                    })
            }
            else
            {
                $('#sug').text("????????");
            }
        }
        else
        {
            $('#sug').text("???????");
        }


    }
    else
    {
        $('#sug').text("??????");
    }



}
