var server = rapid.use("rapid-httpserver");
server.defineAction("test", function(){
    //��Ⱦindex.html
    var content = this.render("/register");
    //���͵�ǰ��
    
    this.send(content);
});