require([
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojo/ready",
    "dojox/mobile/compat",
    "dojox/mobile/ComboBox",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/ListItem",
    "dojox/mobile/TabBar",
    "dojox/mobile/Button",
    "dojox/mobile/RadioButton",
    "dojox/mobile/TextArea",
    "dijit/_base/manager",
    "dojox/mobile/Opener",
    "dijit/ColorPalette",
    "dojox/mobile/ToolBarButton",
    "dojo/request/xhr",
    "dijit/_base/manager",

    "dojox/mobile/IconContainer",


]);
deviceTheme.loadDeviceTheme('Custom')
function updateComments(){



}


function vote(){
    var partyID=document.getElementById("party").innerHTML;
    $.post('/user/',{
        method: 'vote',
        vote: {
            partyID:partyID
        }
    },function(data,states){
        //do something


        if(data.vote.stutes==-1){
            alert("未登录")
            return ;

        }

        if(states=='success'){
            document.getElementById("vote").src="/javascripts/dojox/mobile/tests/images/tab-icon-21h.png";
            document.getElementById("vote").onclick="";
        }




    });


}





function changeType(type){
    if(type=='danmu'){
        document.getElementById("danmuArea").style.display='block';
    }else{
        document.getElementById("danmuArea").style.display='none';
    }
}


function send(){
    var partyID=document.getElementById("party").innerHTML;

    if(dijit.byId("rb_danmu").get('checked')==true){
        //发送弹幕
        var size=1;
        var color='000000';
        var content;
        var type=0;


        if(dijit.byId("size").get('value')=='on'){
            size=1;

        }else if(dijit.byId("size").get('value')=='off'){
            size=0;

        }

        color=dijit.byId("colorPalette").get('value');
        content=dijit.byId("content").get('value');

        if(dijit.byId("rb_Scroll").get('checked')==true){
            type=1;

        }else if(dijit.byId("rb_Top").get('checked')==true){
            type=2;

        }else if(dijit.byId("rb_Bottom").get('checked')==true){
            type=3;

        }





        //发送出去没写,信息已经获得

        $.post('/party/q',{
            method: 'sendComment',
            commentInfo: {
                partyID:partyID,
                type:1,
                contentInfo:{
                    content:content,
                    danmuType:type,         // 1滚动字幕 2 3
                    danmuSize:size,              //1 2 3三种大小 1最小 2默认 3最大
                    danmuColor:color             //形如#FFFFFF的十六进制格式
                }

            }
        },function(data,status){
            //do something

        //    location.reload(true);



        });





    }else if(dijit.byId("rb_comments").get('checked')==true){


        //发送评论
        var content;

        content=dijit.byId("content").get('value');

        //发送出去没写,信息已经获得


        $.post('/party/a',{
            method: 'sendComment',
            commentInfo: {
                partyID:partyID,
                type:0,
                contentInfo:{
                    content:content
                }

            }
        },function(data,status){

            //do something

            location.reload(true)
        });




    }





}



function getColor1(node, v){
    if(v === true){ // Done clicked
        var w = dijit.byId("colorPalette");
        var color = w.get("value");
        if(color){
            node.value = color;
            node.style.backgroundColor = color;
            node.style.color =  "#" + ("0" +(255-parseInt(color.substr(1,2), 16)).toString(16)).slice(-2)
                + ("0" + (255-parseInt(color.substr(3,2), 16)).toString(16)).slice(-2)
                + ("0" + (255-parseInt(color.substr(5,2), 16)).toString(16)).slice(-2);
        }
    }


}


function takePartIn(partyID,state){

    $.post('/user/',{
        method: 'takePartIn',
        takePartIn: {
            partyID:partyID,
            state:state
        }
    },function(data,states){
        //do something

        if(data.takePartIn.state==1&&state==1){
            document.getElementById("btn3").style.display='none';
            document.getElementById("btn2").style.display='block';

        }

        if(data.takePartIn.state==1&&state==0){
            document.getElementById("btn2").style.display='none';
            document.getElementById("btn3").style.display='block';

        }


    });

}


function changeEditMode(){
    if(document.getElementById("back").style.display=='none'){
        //正常查看信息模式
        document.getElementById("back").style.display='block';
        document.getElementById("renew").style.display='none';
       var infoMode= dojo.query(".info");
        for(var i=0;i<infoMode.length;i++){
            infoMode[i].style.display='block';


        }
        var editMode= dojo.query(".edit");
        for(var i=0;i<editMode.length;i++){
            editMode[i].style.display='none';


        }

        return 0;

    }else if(document.getElementById("back").style.display=='block'){
        //编辑模式
        document.getElementById("back").style.display='none';
        document.getElementById("renew").style.display='block';
        var infoMode= dojo.query(".info");
        for(var i=0;i<infoMode.length;i++){
            infoMode[i].style.display='none';


        }

        var editMode= dojo.query(".edit");
        for(var i=0;i<editMode.length;i++){
            editMode[i].style.display='block';


        }

        return 0;
    }




}




function renew(){

    var showObj=[];
    var showList= dojo.query(".showList");
    var len=showList.length;
    for(var i=0;i<len;i++){

        if(isEmpty(showList[i].children[0].children[0])==false){
            showObj.push(newShow(showList[i].children[0].children[0].value,showList[i].children[0].children[1].value));
        }

    }

  var time=dijit.byId("new_time").get('value');
  time=  time.replace(/年/g,'-');
    time= time.replace(/月/g,'-');
    time= time.replace(/日/g,' ');



    $.post('/party/',{
        method : 'renewPartyInfo',
        reNewPartyInfo : {
            ID:document.getElementById("party").innerHTML,
            name : dijit.byId("new_name").get('value'),
            time : time,
            location : document.getElementById("new_location_detail").innerHTML,
            location_lo_la: dijit.byId("new_location").get('value'),
            type:dijit.byId("new_type").get('value'),
            show_actors:showObj,
            detail:dijit.byId("new_detail").get('value')

        }
    },function(data,status){
        //do something


        if(data.reNewRes==-1){
            //没登录
            alert('没登录')

        }else if(data.reNewRes==0){
            //未知错误
            alert('未知错误')

        }else if(data.reNewRes==1){
            //成功
            alert('成功');
            delCookie('newPartyLng');
            delCookie('newPartyLat');
            delCookie('newLocation');
            window.location.href='/';

        }




    });




}



function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}




function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}



setInterval(function(){
    var arr=[];
    if(getCookie('newPartyLng')!=null&&getCookie('newPartyLat')!=null&&dijit.byId("new_location_detail").get('value')=='点击选择地点'){
        arr.push(getCookie('newPartyLng'));
        arr.push(getCookie('newPartyLat'));
        dijit.byId("new_location").set('value',arr);
        dijit.byId("new_location_detail").set('value',getCookie('newLocation'));
        clearCookie('newPartyLng');
        clearCookie('newPartyLat');
        clearCookie('newLocation');

    }

},2000);