
var position={lat:0,lng:0};

require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-class",
    "dijit/registry",
    "dojox/mobile/ListItem",
    "dojox/mobile/parser",
    "dojox/mobile",
    "dojox/mobile/compat",
    "dojox/mobile/ScrollableView",
    "dojox/mobile/Heading",
    "dojox/mobile/RoundRect",
    "dojox/mobile/RoundRectList",
    "dojox/mobile/Slider"

], function(ready, on, dom, domClass, registry,ListItem){
    ready(function(){
        var pullToRefreshPanel = dom.byId("pullToRefreshPanel");
        var topMessage = dom.byId("topMessage");
        var scrollableView = registry.byId("sview");
        var list = registry.byId("list");
        var pullToRefreshPanelDisplayed = false;
        var refreshOnTouchEnd = false;
        var numberOfUpdates = 0;
        var numOfParty=0;
        var numOfUpdata=0;
        var displayPullToRefreshPanel = function() {
            pullToRefreshPanelDisplayed = true;
            pullToRefreshPanel.style.display="block";
        };

        var hidePullToRefreshPanel = function() {
            pullToRefreshPanelDisplayed = false;
            pullToRefreshPanel.style.display="none";
        };

        scrollableView.on("beforescroll", function(evt){
            if(evt.beforeTop){
                // display the pullToRefreshPanel panel if it is not
                if(!pullToRefreshPanelDisplayed){
                    displayPullToRefreshPanel();
                }
                // resize the pullToRefreshPanel according to the scroll destination
                pullToRefreshPanel.style.height= evt.beforeTopHeight + "px";
                pullToRefreshPanel.style.top= -evt.beforeTopHeight + "px";
            }else{
                // hide the pullToRefreshPanel panel if it is displayed
                if(pullToRefreshPanelDisplayed){
                    hidePullToRefreshPanel();
                }
            }
            if(evt.beforeTopHeight > 80){
                domClass.remove(pullToRefreshPanel, "pullDownToUpdate");
                domClass.add(pullToRefreshPanel, "releaseToUpdate");

                refreshOnTouchEnd = true;
            }else{
                domClass.remove(pullToRefreshPanel, "releaseToUpdate");
                domClass.add(pullToRefreshPanel, "pullDownToUpdate");
                refreshOnTouchEnd = false;
            }
        });

        scrollableView.on("touchend", function(evt){
            // We're done scrolling:
            // - hide the pullToRefreshPanel if it is displayed
            // - perform refresh if specified
            if(pullToRefreshPanelDisplayed){
                hidePullToRefreshPanel();
            }
            if(refreshOnTouchEnd){
                addNewParty();
                refreshOnTouchEnd = false;







            }
        });

        var addNewList =function (ID,name,time,location,type,poster){

            var HTML='<table border="0" width="100%" ><tr><th rowspan="4" ><img src="'+poster+'" width=100%  /></th><td width="70%">'+name+'</td></tr><tr><td width="30%">'+type+'</td></tr><tr><td width="30%">'+time+'</td></tr><tr><td width="30%" >'+location+'</td></tr></table> '


            var item=new ListItem({
                moveTo: "#",
                innerHTML: HTML,
                variableHeight:true,
                noArrow: true,
                href:"party/info/"+ID
            });
            list.addChild(item);

        }



        function getPosition(){
            var map = new BMap.Map("allmap");
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                   position.lat=r.point.lat;
                   position.lng=r.point.lng;
                }
                else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})


        }


getPosition();





        function addNewParty(){

            dateObj = new Date()
            $.post('/party/',{
                method:'getNearbyParty',
                getNearbyParty:{
                    point:position,
                    distance:document.getElementById('range').innerHTML,
                    newOrOld:'old',
                    type:'歌舞',
                    obtainedRows:numOfParty,//这个参数用在 newOrold为new时,传递给后台你现在所拿到信息的条数
                    rows:10,//这个参数只在 newOrold为old 有用,用于指定需要后台返回晚会信息的条数
                    partyDate:dateObj.toUTCString(),
                    needed:['ID','name','time','location','type','poster']


                }},function(data,status){
                //拿到相应信息
                numOfUpdata=0;
                for(var i=0;i<data.partyInfo.length;i++){
                    numOfUpdata++;

                    addNewList(data.partyInfo[i].ID,data.partyInfo[i].name,data.partyInfo[i].time,data.partyInfo[i].location,data.partyInfo[i].type,data.partyInfo[i].poster);
                }

                numOfParty=numOfParty+numOfUpdata;
                document.getElementById('massage').innerHTML = "更新了 " + numOfUpdata + " 个晚会 !";



            });




        };











    });
});


