rapid.config.define({
    "rapid-httpserver" : {
        autoStart : true,
        port : 8080,
        loading_dir : ["/app/actions/"],

        mapping : [{
            url:"/uesrsControl.js",
            doAction : "uesrsControl"
        },{
            url:"/test",
            doAction : 'test'



        }]
    }
});