/**
 * ���ڰ�װ���к�����йصĺ���class
 */
var partyclass=function(){
    var Cparties =require('./party/model_parties.js');
   this.partyDB=new Cparties();


}


partyclass.prototype.addParty=function(json){
    this.partyDb.create({name:json.name,time:json.time,location:json.location}).then();

}


module.exports = partyclass ;