/**
 * Created by qianzise on 2015/8/13.
 */

function loginOut(){

    $.post('/user/',{
            method:'logout'
        }
    );
    window.location.href='/';




}