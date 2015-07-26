/**
 * Created by qianzise on 2015/7/22.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('host_data', 'root', '1237891379', {host : '127.0.0.1', port : '3306', dialect : 'mysql'} );
// 定义

var msg = sequelize.define('comment', {

    ID : {type : Sequelize.INTEGER(5), autoIncrement : true, primaryKey : true, unique : true},
    userName : {type : Sequelize.STRING(15), allowNull : false, comment : 'username',validate:{len:[2,15]}},
    partyID : {type : Sequelize.INTEGER(5), allowNull:true},
    content:{type:Sequelize.TEXT,allowNull:false,validate:{len:[0,100]}}, //type为0时候是评论,1时是弹幕
    type:{type : Sequelize.INTEGER(1),allowNull:false,validate:{min:0,max:1},defaultValue:0},
    danmuType:{type : Sequelize.INTEGER(1),validate:{min:1,max:4},allowNull:true,defaultValue:1},
    danmuSize:{type : Sequelize.INTEGER(1),validate:{min:1,max:3},allowNull:true,defaultValue:2},
    danmuColor:{type : Sequelize.STRING(6),validate:{len:[6,6]},allowNull:true,defaultValue:'FFFFFF'},
    getatable:{type : Sequelize.BOOLEAN(),defaultValue:true},
    time:{type:Sequelize.DATE,allowNull:true,defaultValue:Sequelize.NOW}


},{},{ timestamps: true,freezeTableName: true});

msg.sync().catch(function(err){
    console.error('后台数据库未开启');
});



module.exports = msg;