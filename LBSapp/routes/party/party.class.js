/**
 * ���ڰ�װ���к�����йصĺ���class
 */



var object =    //����Сд��object�����࣬����ʵ��������ķ�����
{
    isA: function(aType)   //һ���ж�������֮���Լ���������֮���ϵ�Ļ�������
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


function Class(aBaseClass, aClassDefine)
{
    function class_()
    {
        this.Type = aBaseClass;
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];
    };
    class_.prototype = aBaseClass;
    return new class_();
};

var partyclass=Class(object,
{


    Create: function () {
        //初始化数据库连接
        this.partyDb = require('./party/model_parties.js');
        this.msgDb = require('./party/model_msg.js');

    },

    addParty: function (json, hostname,hostID, callback) {
        /*
         * 添加晚会信息,
         *
         * */

        var _hostname = (json.hostname).toString().split(',');
        //拆分hostname为数组形式,此处无论主办方列表中是否有发起人,自动添加

        for (var i = 0; i < _hostname.length; i++) {
            if (_hostname[i] == hostname) {
                json.hostname = _hostname.slice(0, i).concat(_hostname.slice(i + 1, this.length));
            }
        }
        json.hostname = [hostname].concat(json.hostname);

        var Db = this.partyDb;
        //创建新的晚会信息到数据库
        this.partyDb.create({
            name: json.name,
            time: json.time,
            location: json.location,
            location_lo_la: json.location_lo_la,
            type: json.type,
            publisher: hostname,
            show_actors: JSON.stringify(json.show_actors),
            hostname: JSON.stringify(json.hostname),
            poster: json.poster,
            detail: json.detail
        })
            .then(function (party) {
            //检查是否创建成功
                if (party == null) {
                    //创建失败
                    callback(0);
                } else {
                    //创建成功
                    var Ctool = require('../tool/tool.js');
                    var tool = new Ctool();
                    tool.dealPoster(party.ID,'parties', party.poster, function (state) {
                        if (state == 0) {
                            //海报处理失败
                            callback(0);
                        } else {
                            //海报处理成功,存入海报地址
                            Db.update({poster: '/images/parties/' + party.ID + '/poster.jpg'}, {where: {ID: party.ID}}).then(function (affectedRows) {
                                if (affectedRows == 0) {
                                    //添加海报地址失败
                                    callback(0);
                                } else {
                                    //添加晚会成功,更新主办方主持晚会列表信息
                                    var user=New(require('../user/user.class.js'),[hostID]);
                                    user.holdParty(party.ID,function(state){
                                        callback(state);
                                    })
                                }
                            }).catch(function (err) {
                                console.error(err);
                                callback(0);
                            });
                        }
                    })
                }
            }).catch(function (err) {
                console.error(err);
                if (err) {
                    callback(0);
                }
            })
    },


    getInfo: function (detail, callback) {
        //获得晚会信息,用于更新
        this.partyDb.findAll({
            where: {
                location: detail.location, type: detail.type,
                time: detail.newOrOld == 'new' ? {$gte: detail.partyDate} : {$lte: detail.partyDate}
            }, attributes: detail.needed,
            order: ['updatedAt', 'time', 'ID'], offset: detail.obtainedRows, limit: detail.rows
        }).then(function (results) {
            var arr = [];

            results.forEach(function (data) {
                if(data.dataValues.show_actors!=undefined){
                    data.dataValues.show_actors = JSON.parse(data.dataValues.show_actors);
                }
                if(data.dataValues.hostname!=undefined){
                    data.dataValues.hostname = JSON.parse(data.dataValues.hostname);

                }

                arr.push(data.dataValues);


            })


            callback(arr);


        }).catch(function (err) {
            console.error(err);
            callback([]);

        });

    },

    /*
     partyID:要获取的晚会信息的ID
     needed:所需要的晚会信息列表
     callback:回调

     */
    getInfoByID:function(partyID,needed,callback){
        //通过ID获取晚会信息
        this.partyDb.findOne({where: {ID:partyID}, attributes: needed}).then(function (result) {//先在数据库中找到相应的数据,并且只获取相应的属性

            if(result!=null){//检验下是否为空
                //不为空则
                if(result.dataValues.show_actors!=undefined){//检验下节目表是否未定义
                    result.dataValues.show_actors = JSON.parse(result.dataValues.show_actors);//已经定义的话则去获取节目表json形式,并且解析json
                }

                if( result.dataValues.hostname!=undefined){//检验下举办方是否未定义
                    result.dataValues.hostname = JSON.parse(result.dataValues.hostname);//已经定义的话,获取举办方json数组,并且解析
                }

                var Ctool = require('../tool/tool.js');//导入自己写的工具包,用于后面的格式化时间
                var tool = new Ctool();
                var i;

                for(i=0;i<needed.length;i++){
                    if(needed[i]=='time'){//如果获取的信息中包含时间
                        result.dataValues.time=tool.SimpleDateFormat(result.dataValues.time);//用工具包格式化时间
                    }

                }
            }

            callback(result.dataValues);//回调返回信息


        }).catch(function (err) {
            console.error(err);
            callback(null);//出错则返回空

        });

    },

    reNew: function (partyID, info, callback) {
        //更新晚会信息
        var state = 0;
        this.partyDb.update({
            name:info.name, time: info.time, location: info.location, location_lo_la: info.location_lo_la,
            show_actors: JSON.stringify(info.show_actors), detail: info.detail
        }, {where: {ID: partyID}}).then(function (affectedRows) {
            if (affectedRows == 0) {
                //失败
                state = 0;


            } else {
                //成功
                state = 1;

            }
            callback(state);


        }).catch(function (err) {
            console.error(err);
            state = 0;
            callback(state);


        });


    },

    comment:function (partyID,userName,type,contentInfo,callback){
        //type为1表示是弹幕.0是正常评论

        if(type==1){
            //弹幕
            this.msgDb.create({
                userName:userName,
                partyID:partyID,
                type:type,
                content:contentInfo.content,
                danmuType:contentInfo.danmuType,
                danmuSize:contentInfo.danmuSize,
                danmuColor:contentInfo.danmuColor,
                getatable:true


            }).then(function(msg){
                if(msg==null){
                    //err
                    callback(0);

                }else{
                    callback(1);

                }

            }).catch(function(err){
                console.error(err);
                callback(0);

            });



        }else if(type==0){
            //评论

            this.msgDb.create({
                userName:userName,
                partyID:partyID,
                type:type,
                content:contentInfo.content

          }).then(function(msg){
                if(msg==null){
                    //err
                    callback(0);

                }else{
                    callback(1);

                }

            }).catch(function(err){
                console.error(err);
                callback(0);

            });



        }


    },

    getCommentInfo:function (partyID,type,obtainedRows,row,callback){

        if(type==1){
            //获取弹幕
            this.msgDb.findAll({where:{
                partyID:partyID,
                type:type,
                getatable:true

            },attributes:['ID','partyID','userName','content','danmuType','danmuSize','danmuColor','time'],order:[['updatedAt','ASC']] }).then(function(results){
                var arr = [];
                results.forEach(function (data) {
                    arr.push(data.dataValues);
                })
                callback(arr);

            }).catch(function(err){
                console.error(err);
                callback([]);

            })

        }else if(type==0){
            this.msgDb.findAll({where:{partyID:partyID,type:type},attributes:['ID','partyID','userName','content','time'],
            offset:obtainedRows,limit:row,order:[['updatedAt','ASC']]}).then(function(results){
                var arr = [];

                results.forEach(function (data) {
                    arr.push(data.dataValues);
            })

            callback(arr);

        }).catch(function(err){
            console.error(err);
            callback([]);

        });


    }

    },

    updateDanmu:function(msgs){
        //此函数用于更新弹幕,当弹幕被读取完后,更新getatable参数为false0
        var _Db=this.msgDb;
        var state=0;

        msgs.forEach(function(data){
            _Db.update({getatable:0},{where:{ID:data.ID}}).then(function(results){
                if(results==[]){
                    state=0;
                }else{
                    state=1;
                }
            }).catch(function(err){
                console.error(err);
                state=0;


            });


        });


    },

    getNewPartys:function(row,callback){
        //获取最新添加的晚会信息
        var dateObj = new Date();


        this.partyDb.findAll({where:{time:{$gte:dateObj}},attributes:['ID','name','time','location','type','poster'],
               order:[['createdAt', 'DESC']], limit:row}).then(function(results){
            var arr = [];
            var Ctool = require('../tool/tool.js');
            var tool = new Ctool();
            results.forEach(function (data) {

                data.dataValues.time=tool.SimpleDateFormat(data.dataValues.time);
                arr.push(data.dataValues);
            })

            callback(arr);

        }).catch(function(err){
            console.error(err);
            callback([]);

        });




    },

    getPartyInDistanceAroundPoint:function(point,distance,row,obtainedRows,callback){
        //用于获取在一定半径内的晚会信息

        var Ctool = require('../tool/tool.js');
        var tool = new Ctool();


        this.partyDb.findAll({where:{},
           limit:row,order:[['updatedAt','DESC']]}).then(function(results){



            var arr = [];

            results.forEach(function (data) {


                var lng=data.dataValues.location_lo_la.split(',')[0];
                var lat=data.dataValues.location_lo_la.split(',')[1];
                var point2={};
                point2.lng=lng;
                point2.lat=lat;

                if(tool.getDistance(point,point2)<distance){
                    data.dataValues

                    arr.push(data.dataValues);
                }


            });


            for(var i = 0;i<obtainedRows;i++){

                arr.pop();
            }




            for(var j=0;j<arr.length;j++){
                arr[j].time=tool.SimpleDateFormat(arr[j].time);

            }


            callback(arr);

        }).catch(function(err){
            console.error(err);
            callback([]);

        });



    },

    vote:function(partyID,callback){

        var _Db=this.partyDb;
        this.partyDb.findOne({where:{ID:partyID},attributes:['ID','votes']})
            .then(function(result){
                if(result){
                    _Db.update({votes:++result.dataValues.votes},{where:{ID:result.dataValues.ID}})
                        .then(function(affectedRows){

                            if(affectedRows){

                                callback(1);

                            }else{

                                callback(0);
                            }


                        })

                }else{
                    console.error("vote函数错误");
                    callback(0);

                }



            }).catch(function(err){


        })


    },

    getVote:function(partyID,callback){
        this.partyDb.findOne({where:{ID:partyID},attributes:['votes']})
            .then(function(result){
                if(result.dataValues.votes==null||result.dataValues.votes==''||result.dataValues.votes==[]){
                    result.dataValues.votes=0;
                }
                callback(result.dataValues.votes);

        }).catch(function(err){
            console.error(err);
            callback(-1);

        });

    }
}

);


module.exports = partyclass ;