/**
 * Created by qianzise on 2015/8/4.
 */

require([
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojo/ready",
    "dojox/mobile/ListItem",
    "dijit/registry",
    "dojo/dom",
    "dojox/mobile/compat",
    "dojox/mobile/ComboBox",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/TabBar",
    "dojox/mobile/TextArea",
    "dojox/mobile/Button",
    "dojox/form/Uploader",
    "dojox/embed/Flash",
    "dojox/form/uploader/plugins/IFrame",
    "dojo/request/xhr",
    "dijit/_base/manager"


],function(parser,moblie,ready,ListItem,registry,dom){


ready(function(){



    var showListItem={};
    var ListStore= registry.byId('showLists');
    var addBotton=dom.byId('addshow');
    dojo.connect(addBotton,'onclick',function(evt){
        addShowList();

    })
  //  var loader=registry.byId()

    //var b_add = registry.byId('forget')
    //dojo.connect(b_add,'onclick',function(evt){
    //
    //    alert('aaa');
    //})



    var addShowList=function(){
        var item=new ListItem({
            innerHTML:' <center><input  data-dojo-type="dojox/mobile/TextBox" class="showName" intermediateChanges="true" selectOnClick="true">--<input  data-dojo-type="dojox/mobile/TextBox" class="showActors" intermediateChanges="true" selectOnClick="true"> </center>'
        });

        ListStore.addChild(item);




    }



})









});





function isEmpty(obj){

    if(obj.value==""){

        return true;
    }else {

        return false;

    }


}

function newShow(name,actors){
    var o={};
    o.show=name;
    o.actors=actors;
    return o;


}



function send(){

    var showObj=[];
    var showList= dojo.query(".showList")
    var len=showList.length;
    for(var i=0;i<len;i++){

        if(isEmpty(showList[i].children[0].children[0])==false){
            showObj.push(newShow(showList[i].children[0].children[0].value,showList[i].children[0].children[1].value))
        }

    }



    $.post('/party/',{
        method : 'addParty',
        addPartyInfo : {
            name : dijit.byId("new_name").get('value'),
            time : dijit.byId("new_time").get('value'),
            location : document.getElementById("new_location_detail").innerHTML,
            location_lo_la: dijit.byId("new_location").get('value'),
            type:dijit.byId("new_type").get('value'),
            show_actors:showObj,
            hostname:dijit.byId("new_hosts").get('value') ,
            detail:dijit.byId("new_detail").get('value')

        }
    },function(data,status){
        //do something
        if(data.addPartyRes.state==-1){
            //没登录
            alert('没登录')

        }else if(data.addPartyRes.state==0){
            //未知错误
            alert('未知错误')

        }else if(data.addPartyRes.state==1){
            //成功
            alert('成功')

        }




    });






}

function clsShowList(){

    var list=dojo.query("input.showName");
    var len= list.length;
    for(var i= 0;i<len;i++){
        list[i].value="";
    }

    list=dojo.query("input.showActors");
    len= list.length;
    for(var i= 0;i<len;i++){
        list[i].value="";
    }


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
    if(getCookie('newPartyLng')!=null&&getCookie('newPartyLat')!=null){
        arr.push(getCookie('newPartyLng'));
        arr.push(getCookie('newPartyLat'));
        dijit.byId("new_location").set('value',arr);
        document.getElementById('new_location_detail').innerHTML=getCookie('newLocation');

    }

},2000);