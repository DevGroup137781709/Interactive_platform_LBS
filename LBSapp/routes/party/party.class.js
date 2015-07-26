/**
 * ���ڰ�װ���к�����йصĺ���class
 */

/*
var partyclass=function(){


    this.partyDb =require('./party/model_parties.js');




}




partyclass.prototype.addParty=function(json,hostname,callback){

//��������Ϣ,����json�еĺ�����ַΪ֮ǰ�ϴ�����ʱ�ļ�


    var _hostname=(json.hostname).toString().split(',');
    //���û�����hostnameȥ��

    for(var i=0;i<_hostname.length;i++){
        if(_hostname[i]==hostname){
            json.hostname=_hostname.slice(0,i).concat(_hostname.slice(i+1,this.length));
        }

    }
   json.hostname=[hostname].concat(json.hostname);



    var Db=this.partyDb;

    this.partyDb.create({name:json.name,time:json.time,location:json.location,
        type:json.type,publisher:hostname,show_actors:JSON.stringify(json.show_actors),hostname:JSON.stringify(json.hostname),poster:json.poster,detail:json.detail})
        .then(function(party){

            if(party==null){
                callback(0);
            }else{

                var Ctool=require('../tool/tool.js');
                var tool=new Ctool();
                tool.dealPoster(party.ID,party.poster,function(state){
                    if(state==0){
                        callback(0);
                    }else{
                        Db.update({poster:'/images/parties/'+party.ID+'/poster.jpg'},{where:{ID:party.ID}}).then(function(affectedRows){
                            if(affectedRows==0){
                                callback(0);

                            }else{
                                callback(1);

                            }

                        }).catch(function(err){
                            console.error(err);
                            callback(0);

                        });


                    }
                })

            }
        }).catch(function(err){
            console.error(err);
            if(err){
                callback(0);
            }
        });

}





partyclass.prototype.getInfo=function(detail,callback){
    this.partyDb.findAll({where:{location:detail.location,type:detail.type,
        time:detail.newOrOld=='new'?{$gte:detail.partyDate}:{$lte:detail.partyDate}}, attributes:detail.needed,
        order:['updatedAt','time','ID'],offset:detail.obtainedRows,limit:detail.rows}).then(function(results){
        var arr =[];

        results.forEach(function(data){

            data.dataValues.show_actors=JSON.parse(data.dataValues.show_actors);
            data.dataValues.hostname=JSON.parse(data.dataValues.hostname);
            arr.push(data.dataValues);


        })



        callback(arr);


    }).catch(function(err){
        console.error(err);
        callback([]);

    });

}


partyclass.prototype.reNew=function(partyID,info,callback){
    var state=0;
    this.partyDb.update({time:info.time,location:info.location,location_lo_la:info.location_lo_la,
            show_actors:JSON.stringify(info.show_actors),detail:info.detail},{where:{ID:partyID}}).then(function(affectedRows){
                if(affectedRows==0){
                    //�޸�ʧ��
                    state=0;


                }else{
                   //�޸ĳɹ�
                    state=1;

                }
        callback(state);




    }).catch(function(err){
        console.error(err);
        state=0;
        callback(state);



    });




}
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

function Class(aBaseClass, aClassDefine)    //������ĺ��������������༰�̳й�ϵ
{
    function class_()   //���������ʱ������
    {
        this.Type = aBaseClass;    //���Ǹ�ÿһ����Լ��һ��Type���ԣ�������̳е���
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //�������ȫ�����嵽��ǰ��������
    };
    class_.prototype = aBaseClass;
    return new class_();
};

var partyclass=Class(object,
{


    Create: function () {
        this.partyDb = require('./party/model_parties.js');
        this.msgDb = require('./party/model_msg.js');

    },

    addParty: function (json, hostname, callback) {
        /*
         * ��������Ϣ,����json�еĺ�����ַΪ֮ǰ�ϴ�����ʱ�ļ�
         *
         * */

        var _hostname = (json.hostname).toString().split(',');
        //���û�����hostnameȥ��

        for (var i = 0; i < _hostname.length; i++) {
            if (_hostname[i] == hostname) {
                json.hostname = _hostname.slice(0, i).concat(_hostname.slice(i + 1, this.length));
            }

        }
        json.hostname = [hostname].concat(json.hostname);


        var Db = this.partyDb;

        this.partyDb.create({
            name: json.name,
            time: json.time,
            location: json.location,
            type: json.type,
            publisher: hostname,
            show_actors: JSON.stringify(json.show_actors),
            hostname: JSON.stringify(json.hostname),
            poster: json.poster,
            detail: json.detail
        })
            .then(function (party) {

                if (party == null) {
                    callback(0);
                } else {

                    var Ctool = require('../tool/tool.js');
                    var tool = new Ctool();
                    tool.dealPoster(party.ID, party.poster, function (state) {
                        if (state == 0) {
                            callback(0);
                        } else {
                            Db.update({poster: '/images/parties/' + party.ID + '/poster.jpg'}, {where: {ID: party.ID}}).then(function (affectedRows) {
                                if (affectedRows == 0) {
                                    callback(0);

                                } else {
                                    callback(1);

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

    getInfoByID:function(partyID,needed,callback){
        this.partyDb.findOne({where: {ID:partyID}, attributes: needed}).then(function (result) {


            if(result.dataValues.show_actors!=undefined){
                result.dataValues.show_actors = JSON.parse(result.dataValues.show_actors);
            }

            if( result.dataValues.hostname!=undefined){
                result.dataValues.hostname = JSON.parse(result.dataValues.hostname);
            }




            callback(result.dataValues);


        }).catch(function (err) {
            console.error(err);
            callback(null);

        });

    },

    reNew: function (partyID, info, callback) {
        var state = 0;
        this.partyDb.update({
            time: info.time, location: info.location, location_lo_la: info.location_lo_la,
            show_actors: JSON.stringify(info.show_actors), detail: info.detail
        }, {where: {ID: partyID}}).then(function (affectedRows) {
            if (affectedRows == 0) {
                //�޸�ʧ��
                state = 0;


            } else {
                //�޸ĳɹ�
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
        //typeΪ0ʱ��������,1ʱ�ǵ�Ļ



        if(type==1){
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

            his.msgDb.create({
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
            //��Ļ,һ��ȡ��û����ʾ�ĵ�Ļ
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
            this.msgDb.findAll({where:{partyID:partyID,type:type},offset:obtainedRows,limit:row,oder:[['updatedAt','ASC']]}).then(function(results){
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


    }


}

);


module.exports = partyclass ;