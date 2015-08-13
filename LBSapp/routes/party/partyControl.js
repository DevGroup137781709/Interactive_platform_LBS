
/*
 * 晚会信息控制器
 * 用于处理:晚会信息请求,晚会信息修改请求,聊天室各项请求,投票请求
 *
 *
 * 传入json格式:{
 *               method:'addParty','getPartyInfo','renewPartyInfo','sendComment','getComment'
 *               addPartyInfo:{
 *                       name:
 *                       time:
 *                       location:
 *                       location_lo_la:
 *                       type:
 *                       show_actors:
 *                                       [{show:'XXX',actors:'XXX,XXX,XXX'},,,,,,]
 *
 *
 *                       hostname:  //用逗号分开
 *                       poster://这个参数不用传给我,前台上传海报文件后,我已经把海报临时地址存在cookies中了
 *                       detail:
 *
 *
 *                       }
 *               detail:{
 *                           location:
 *                           range://这个参数先废除,以后在加这个功能,这个是用来确定详细地理范围的,用米表示的
 *                           type://传入想要获取的晚会类型
 *                           newOrOld:'new','old'//默认new
 *                           obtainedRows:0,//传递给后台你现在所拿到信息的条数
 *                           rows:10,//这个参数只在 newOrold为old 有用,用于指定需要后台返回晚会信息的条数
 *                           partyDate://这个用作标识,用时间作为排序标准和确定需要的数据标准
 *
 *                           needed:['ID','name','time','location','location_lo_la','type','programs_actor','hostname','poster','detail']
 *
 *
 *                       }
 *
 *
 *               reNewPartyInfo:{
 *                        ID:
 *                       time:
 *                       location:
 *                       location_lo_la:
 *                       type:
 *                       show_actors:
 *                                       [{show:'XXX',actors:'XXX,XXX,XXX'},,,,,,]
 *
 *
 *
 *                       poster://这个参数不用传给我,前台上传海报文件后,我已经把海报临时地址存在cookies中了
 *                       detail:
 *
 *
 *                       }
 *
 *              commentInfo:{
 *                          partyID:        ,
 *                          type:0 1, 1是弹幕 0是评论
 *                          contentInfo:{
 *                                  content:
 *                                  danmuType:              // 1滚动字幕 2 3 4
 *                                  danmuSize:              //1 2 3三种大小 1最小 2默认 3最大
 *                                  danmuColor:             //形如FFFFFF的十六进制格式
 *
 *
 *                                  }
 *            commentDetail:{
 *                           partyID:  ,
 *                           type: 0 1, 1是弹幕 0是评论
 *                           obtainedRows:0,//传递给后台你现在所拿到信息的条数
 *                           rows:10,//用于指定需要后台返回晚会信息的条数
 *
 *
 *
 *                       }
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *                          }
 *
 *
 *               }
 *
 *
 *
 * 传出json格式{
 *               addPartyRes:{
 *                           state: -1 无权限  0失败 1 成功 2未上传图片
 *                           },
 *               reNewRes:{
 *                           state: -1 无权限  0失败 1 成功
 *                           }
 *                partyInfo://此处返回一个数组,数组格式如下:
 *                           [{
 *                               ID:
 *
 *                               time:
 *                               location:
 *
 *                               show_actors:
 *
 *                               poster:
 *                               detail:
 *
 *
 *                           }.......]
 *
 *
 *
 *
 *               }
 *
 *               commentRes:{
 *               如果是获取评论,这里会有个数组
 *                           state://发送评论时候会返回代码 0失败 1成功
 *
 *
 *                           }
 *
 *
 *
 *
 * */

var object =    //定义小写的object基本类，用于实现最基础的方法等
{
    isA: function(aType)   //一个判断类与类之间以及对象与类之间关系的基础方法
    {
        var self = this;
        while(self)
        {
            if (self == aType)
                return true;
            self = self.Type;
        };
        return false;
    }
};

function Class(aBaseClass, aClassDefine)    //创建类的函数，用于声明类及继承关系
{
    function class_()   //创建类的临时函数壳
    {
        this.Type = aBaseClass;    //我们给每一个类约定一个Type属性，引用其继承的类
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //复制类的全部定义到当前创建的类
    };
    class_.prototype = aBaseClass;
    return new class_();
};

function New(aClass, aParams)   //创建对象的函数，用于任意类的对象创建
{
    function new_()     //创建对象的临时函数壳
    {
        this.Type = aClass;    //我们也给每一个对象约定一个Type属性，据此可以访问到对象所属的类
        if (aClass.Create)
            aClass.Create.apply(this, aParams);   //我们约定所有类的构造函数都叫Create，这和DELPHI比较相似
    };
    new_.prototype = aClass;
    return new new_();
};




var express = require('express');
var formidable = require('formidable');//使用中间件 ,用于上传文件
var router = express.Router();



router.post('/*', function(req, res, next) {



    /*
     * 处理上传海报,返回服务器海报储存地址,到时候前台一起返回给后台储存
     *
     *
     * */

    var reqJson=req.body;
    var resJson={};
    var session=req.session;








    if(req.originalUrl=='/party/uploadposter') {

        var MAXSIZE=1*1024*1024;
        var CVMS=require('../VMS/VMS.js');
        var VMS=new CVMS();

        if(VMS.isLogin(req.session,'host')){
            var form = new formidable.IncomingForm();
            form.uploadDir = "../temp/poster/";
            var size = req.headers['content-length'];

            form.on('fileBegin', function(name, file){
                var type = file.type;
                type = type.split('/');
                type = type[1];

                if(type != 'jpeg' && type != 'png' && type != 'gif')
                {
                    res.end('-2');
                }

            });


            if(size>MAXSIZE){
                res.end('-1');
            }else{

                form.parse(req, function (err, fields, files) {
                    if (err) {
                        res.clearCookie('posterPath');
                        res.end(0);
                    }

                    res.cookie('posterPath', {path: files.uploadedfile.path});
                    res.end('1');
                });


            }





        }else{
            res.end('0');
        }
    }














    var CVMS=require('../VMS/VMS.js');
    var VMS=new CVMS();


    switch (reqJson.method)
    {
        case 'addParty':
            /*
             * 添加晚会信息,传入的海报地址为之前上传的一个临时位置即可
             *
             * */


            if(VMS.isLogin(req.session,'host')){//验证登录,必须为策划者才行
                var party=New(require('./party.class.js'),[]);


                if(req.cookies.posterPath.path==undefined){//判断是否已经上传过文件
                    resJson.addPartyRes={};
                    resJson.addPartyRes.state=2;
                    res.end(resJson);
                    break;
                }else{
                    reqJson.addPartyInfo.poster=req.cookies.posterPath.path;

                }


                party.addParty(reqJson.addPartyInfo,req.session.userName, function (state) {

                    resJson.addPartyRes={};
                    resJson.addPartyRes.state=state;
                    res.clearCookie('posterPath');
                    res.json(resJson);
                    res.end();

                });
            }else{

                resJson.addPartyRes={};
                resJson.addPartyRes.state='-1';
                res.json(resJson);
                res.end();

            }
            break;


        case 'getPartyInfo':
            /*
             * 获取晚会信息,这里不需要验证身份
             *
             * */


            var detail=reqJson.detail;
            var party=New(require('./party.class.js'),[]);
            resJson.partyInfo=[];

            party.getInfo(detail,function(parties){
                resJson.partyInfo=parties;
                res.json(resJson);
                res.end();

            });

            break;



        case 'renewPartyInfo':

            /*
             * 更新晚会信息,验证策划者登录
             *
             * */

            resJson.reNewRes={};

            if(VMS.isLogin(req.session,'host')){

                VMS.isPartyPublicer(req.session.userName,reqJson.reNewPartyInfo.ID,function(state){

                    if(state==1){
                        //可以修改
                        var party=New(require('./party.class.js'),[]);

                        party.reNew(reqJson.reNewPartyInfo.ID,reqJson.reNewPartyInfo,function(state){
                            resJson.reNewRes=state;
                            res.json(resJson);
                            res.end();

                        });
                    }else{
                        //不可修改
                        resJson.reNewRes=-1;
                        res.json(resJson);
                        res.end();

                    }
                });
            }else{
                //不可修改
                resJson.reNewRes=-1;
                res.json(resJson);
                res.end();
            }



            break;
        case 'sendComment':
            //发送弹幕或者评论
            console.log('sendComment')

            resJson.commentRes={};

            if(VMS.isLogin(req.session)){
                var party=New(require('./party.class.js'),[]);



                party.comment(reqJson.commentInfo.partyID,req.session.userName,reqJson.commentInfo.type,reqJson.commentInfo.contentInfo,function(state){
                    resJson.commentRes=state;
                    res.json(resJson);
                    res.end();

                })



            }else{
                resJson.commentRes=0;
                res.json(resJson);
                res.end();

            }

            break;

        case 'getComment':
            //获取评论,弹幕
            resJson.commentRes={};
            var party=New(require('./party.class.js'),[]);
            var result=  party.getCommentInfo(reqJson.commentDetail.partyID,reqJson.commentDetail.type,reqJson.commentDetail.obtainedRows,reqJson.commentDetail.row);
                    console.log(result);
                    resJson.commentRes=result;
                    res.json(resJson);
                    res.end();
                    if(reqJson.commentDetail.type==1){
                        party.updateDanmu(result);
                    }

            break;




        case 'getNearbyParty':

            console.log(reqJson);
            var party=New(require('./party.class.js'),[]);
            party.getPartyInDistanceAroundPoint(reqJson.getNearbyParty.point,reqJson.getNearbyParty.distance,reqJson.getNearbyParty.rows,reqJson.getNearbyParty.obtainedRows,function(result){
                resJson.partyInfo=[];
                resJson.partyInfo=result;
                res.json(resJson);
                res.end();
                console.log(result);

            })
            //party.getPartyInDistanceAroundPoint({lng:109.099595,lat:21.484221},100,20,function(result){
            //
            //    console.log(result);
            //
            //
            //})


            break;



    }






});



router.get('/:type/:ID', function(req, res, next) {


    var async = require('async');

    if(req.params.type.toLowerCase()=='info') {

        var party=New(require('./party.class.js'),[]);
        var comment;
        async.series({
            one: function (callback_1) {
                //先异步取得晚会评论信息

                party.getCommentInfo(req.params.ID,0,0,10,function(result){

                    comment=result;

                    callback_1();

                })

            },
            two: function (callback_2) {


                party.getInfoByID(req.params.ID,['name','time','location','type','publisher','show_actors','hostname','poster','detail'],function(result){

                    if(req.session.userID!=undefined){

                        var user=New(require('../user/user.class.js'),[req.session.userID]);
                        user.getInfo(function(userResult){


                            var isTaken=0;


                            userResult.userInfo.user_takenpartys.forEach(function(each){

                                if(each==req.params.ID){
                                    isTaken=1;
                                }

                            })



                            res.render('partyInfo',{
                                partyName:result.name,
                                partyID:req.params.ID,
                                partyTime:result.time,
                                partyLocation:result.location,
                                partyType:result.type,
                                detail:result.detail,
                                partyPublisher:result.publisher,
                                partyHosts:result.hostname,
                                isTaken:isTaken,//这里三个状态 0未参加 1已经参加 -1未登录
                                shows:result.show_actors,
                                comments:comment,
                                posterURL:result.poster

                            });

                            callback_2();



                        });



                    }else{
                        res.render('partyInfo',{

                            partyName:result.name,
                            partyID:req.params.ID,
                            partyTime:result.time,
                            partyLocation:result.location,
                            partyType:result.type,
                            detail:result.detail,
                            partyPublisher:result.publisher,
                            partyHosts:result.hostname,
                            isTaken:-1,//这里三个状态 0未参加 1已经参加 -1未登录
                            shows:result.show_actors,
                            comments:comment,
                            posterURL:result.poster

                        });

                        callback_2();



                    }






                })




            }


        })








    }else if(req.params.type.toLowerCase()=='add'){


        res.render('addParty',{})


    }else if(req.params.type.toLowerCase()=='list'){


        res.render('partyList',{})


    }











});











module.exports = router;

