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
    "dojo/request/xhr"


]);

function updateComments(){



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