/**
 * Created by qianzise on 2015/6/8.
 */
var tool=function(){



}
tool.prototype.uploadPoster=function(){



}


tool.prototype.dealPoster=function(ID,address,callback){
   var fs=require('fs');
    var readStream=fs.createReadStream(address);
    fs.mkdirSync(__dirname+'/../../public/images/parties/'+ID);//提前新建文件夹,否则报错
    var writeStream=fs.createWriteStream(__dirname+'/../../public/images/parties/'+ID+'/poster.jpg');
    readStream.pipe(writeStream);
    readStream.on('end',function(){
        fs.unlinkSync(address);
        callback(1);

    })

    readStream.on('error',function(err){
        console.error(err);
        fs.unlinkSync(address);
        callback(0);

    })


}





module.exports = tool;;