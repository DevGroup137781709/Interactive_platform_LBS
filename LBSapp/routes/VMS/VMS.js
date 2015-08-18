/**
 * Created by qianzise on 2015/6/16.
 */



var VMS=function(){



}


VMS.prototype.isLogin=function(session,permission){


    if(permission==undefined){
        permission='all';
        return (session.isLogin=='yes'&&session.userID!=undefined&&session.userName!=undefined&&session.userType!=undefined);
    }

    var perm;
    if(permission=='host'){
        perm=0;
    }else if(permission=='user'){
        perm=1;

    }

    return (session.isLogin=='yes'&&session.userID!=undefined&&session.userName!=undefined&&session.userType==perm);


}


VMS.prototype.isPartyPublicer=function(userName,PartyID,callback){
// 返回1有权限 0无权限
    var dataParty = require('../party/party/model_parties.js');

    dataParty.findOne({where:{ID:PartyID}})
        .then(function(partyInfo){

            var hostList=[];
            hostList=JSON.parse(partyInfo.hostname);
            var able=0;

            hostList.forEach(function(data){

                if(data==userName){
                    able=1;
                    return ;
                }


            });

            callback(able);

        }).catch(function(err){
            console.error(err);
            callback(0);
        })




}




module.exports = VMS;;