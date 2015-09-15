/**
 * Created by qianzise on 2015/8/13.
 */

function loginOut(){

    $.post('/user/',{
            method:'logout'
        },function(data,status){
            window.location.href='/';
        }
    );





}