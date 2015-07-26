/**
 * Created by qianzise on 2015/5/15.
 */
// 链接

var Sequelize = require('sequelize');
var sequelize = new Sequelize('host_data', 'root', '1237891379', {host : '127.0.0.1', port : '3306', dialect : 'mysql'} );
// 定义
var user = sequelize.define('user_basedata', {
    // auto increment, primaryKey, unique
    ID : {type : Sequelize.INTEGER(5), autoIncrement : true, primaryKey : true, unique : true},
    type : {type : Sequelize.INTEGER(1), allowNull : false, defaultValue : 1},
    name : {type : Sequelize.STRING(15), allowNull : false, comment : 'name'},
    email : {type : Sequelize.STRING(50), allowNull : false,validate:{isEmail:true}},
    password : {type : Sequelize.STRING(15), allowNull : false,validate:{len:[6,15]}},
    sex : {type : Sequelize.INTEGER(1), allowNull : false},  //0女 1男
    host_holdingpartys : {type : Sequelize.TEXT, allowNull : true},
    host_holdedpartys : {type : Sequelize.TEXT, allowNull : true},
    user_takenpartys : {type : Sequelize.TEXT, allowNull : true},
    registerTime : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}

},{ timestamps: false,freezeTableName: true});

user.sync().catch(function(err){
    console.error('后台数据库未开启');


});


module.exports = user;