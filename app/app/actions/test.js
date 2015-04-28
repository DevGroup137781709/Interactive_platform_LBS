var server = rapid.use("rapid-httpserver");
server.defineAction("test", function(){
    //äÖÈ¾index.html
    var content = this.render("/register");
    //·¢ËÍµ½Ç°¶Ë
    
    this.send(content);
});