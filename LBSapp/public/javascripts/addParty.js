/**
 * Created by qianzise on 2015/8/4.
 */
require([
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojo/ready",
    "dojox/mobile/compat",
    "dojox/mobile/ComboBox",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/ListItem",
    "dojox/mobile/TabBar",
    "dojox/mobile/TextArea",
    "dojox/mobile/Button",
    "dojox/form/Uploader",
    "dojox/embed/Flash",
    "dojox/form/uploader/plugins/IFrame",
    "dojo/request/xhr",
    "dijit/_base/manager"


]);

function isEmpty(obj){

    if(obj.value==""){

        return true;
    }else {

        return false;

    }


}

function newShow(name,actors){
    var o={};
    o.name=name;
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


function addShowList(){


    //var node=dijit.byId("showList");
    //          var node = document.getElementById("showList")

    //        var a = document.createElement('li');
    a.innerHTML="111";

//node.appendChild(dijit.byId("show"));
    //   dojo.dom.insertBefore(node, ref, true);



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