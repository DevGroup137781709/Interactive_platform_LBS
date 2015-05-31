/**
 * Created by qianzise on 2015/5/27.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('host_data', 'root', '1237891379', {host : '127.0.0.1', port : '3306', dialect : 'mysql'} );
// ∂®“Â
var party = sequelize.define('party', {

    ID : {type : Sequelize.INTEGER(5), autoIncrement : true, primaryKey : true, unique : true},
    name : {type : Sequelize.STRING(15), allowNull : false, comment : 'name',validate:{len:[2,15]}},
    time:{type:Sequelize.DATE,allowNull:false},
    location:{type:Sequelize.TEXT,allowNull:false},
    location_lo_la:{type:Sequelize.CHAR(20),allowNull:true},
    type:{type:Sequelize.INTEGER(1),allowNull:false,defaultValue:1,validate:{isIn:[[0,1]]}},
    programs_actor:{type:Sequelize.TEXT,allowNull:true},
    hostname:{type:Sequelize.CHAR(20),allowNull:false},
    poster:{type:Sequelize.TEXT,allowNull:true},
    detail:{type:Sequelize.TEXT,allowNull:true}

},{
    classMethods: {
        method1: function(){
            console.log('wwww') ;
        }
    }},{ timestamps: true,freezeTableName: true});

party.sync();

//
//user.findOne({where:{id:2}}).then(function(user){
//    if(user==null){
//        console.log('ss')
//
//    }
//
//
//});

module.exports = party;