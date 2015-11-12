/**
 * Created by qianzise on 2015/6/8.
 */
var tool=function(){



}
tool.prototype.uploadPoster=function(){



}


tool.prototype.dealPoster=function(ID,type,address,callback){
   var fs=require('fs');
    var readStream=fs.createReadStream(address);
    fs.mkdirSync(__dirname+'/../../public/images/'+type+'/'+ID);//��ǰ�½��ļ���,���򱨴�
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


},

tool.prototype.getDistance=function(point1,point2){
    var EARTH_RADIUS = 6378.137;
    function rad(d){
        return d * Math.PI / 180.0;

    }


    var lat1=point1.lat;
    var lng1=point1.lng;
    var lat2=point2.lat;
    var lng2=point2.lng;


    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);


    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;

    return s*1000;





},


    tool.prototype.SimpleDateFormat=function(date){

        var format="";
        format+=date.getUTCFullYear()+"年"
        format+=(date.getMonth()+1)+"月"
        format+=date.getDate()+"日"
        format+=date.getHours()+":"
        format+=date.getMinutes()+":"
        format+=date.getSeconds()
        return format;

    }




module.exports = tool;;