/**
 * 用于包装所有和晚会有关的函数class
 */
var partyclass=function(){
    var Cparties =require('./party/model_parties.js');
   this.partyDB=new Cparties();


}


partyclass.prototype.addParty=function(json){
    this.partyDb.create({name:json.name,time:json.time,location:json.location}).then();

}


module.exports = partyclass ;