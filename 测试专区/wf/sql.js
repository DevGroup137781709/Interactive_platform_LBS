/*
 * 本js用于和数据库进行数据交互
 * 用于
 *      1.注册时候对用户名的检测
                1.策划人【编写完毕】【未测试】
                2.用户【编写完毕】【未测试】
 *      2.登录的验证
 *      3................
 *      
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 接收json格式：
 * {
 *  method*:'register','login','addparty','sendmsg'
 *  uesrdatas:{
 *      uesr_type: 0代表策划者 1代表用户 默认1 
 *      uesr*:
 *      pw*:
 *      email;
 *      }
 * }
 * 
 * 
 * 发送json格式：
 * ｛
 *   regres：｛
                type: 0代表策划者 1代表用户 默认1 
                succeed：0代表注册失败,即用户名冲突 1代表成功
 *              ｝
 * 
 * 
 * 
 * 
 *   ｝
 * 
 * 
 * 
 * 
 * 
 * 
 * */


var server = rapid.use("rapid-httpserver");

server.defineAction("datacenter",['default_request','default_response','cookie'] ,function (req, res, cookie) {
    var succeed;//判断请求操作是否成功
    var db_IP='127.0.0.1';
    var db_uesr='root';
    var db_pw='1237891379';
    var db_po='3306';
    var db_base = 'host_data';

    var data_json;
    var db;//定义一个连接数据库对象

    req.on('data', function (data) { 
        
        //接收到请求信息
        if (req.method != 'POST') {
            //一律使用POST方法请求，其余全部错误

            
            res.end('error you must ues post');
            server.close();
        } else {
            data_json = eval('(' + data + ')');//转换成json对象记得加（）这对括号，才是js语句，eval返回一个对象
           
            linksql();
         
        }
       
    });
    
    function linksql() {

        var result;
      db =  require('rapid-mysql').instance({
							  host: 'localhost',
							  port: 3306,
							  user: 'root',
							  password: '1237891379',
							  resource: 'host_data'
							});
      
        switch (data_json.method) {
            /*
            注册处理 第一次编写 2015年4月25日 13:39:51
            
            */
            case 'register':

                if (data_json.uesrdatas.uesrtype == 0) {
                    //如果注册的是策划者
                    
                    db.query('SELECT host_name from basedata_host ', function (err, rows) {
                        if (err) {
                            console.log(err);
                        }

                        succeed = 1;
                        for (var i = 0; i < rows.length; i++) {
                            if (son.uesrdatas.user == row[i]) {
                                succeed = 0;
                                break;
                            }

                        }
                        
                       

                    });

                } else {
                    //如果注册的是用户
                    db.query('SELECT user_name from basedata_user ', function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        succeed = 1;
                        for (var i = 0; i < rows.length; i++) {
                            
                            if (json.uesrdatas.user == row[i]) {
                                succeed = 0;
                                break;
                            }


                        }
                       
                       


                    });

                }

                result = "{'regres':{'type':" + data_json.uesrdatas.uesr_type + ",'succeed':" + succeed + "}}";
                res.write(result);
                res.end();

                break;

            case 'login':


            case 'addparty':



            case 'sendmsg':

        }
        
       
    }


    
   
    
    
    
});



