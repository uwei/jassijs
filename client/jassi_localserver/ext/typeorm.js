define("sha.js",[],()=>{return {};});
define("dotenv",[],()=>{return {};});
define("chalk",[],()=>{return {};});
define("cli-highlight",[],()=>{return {};});
define("events",[],()=>{return {};});
define("stream",[],()=>{return {};});
define("mkdirp",[],()=>{return {};});
define("glob",[],()=>{return {};});
define("app-root-path",[],()=>{return {};});
define("debug",[],()=>{return {};});
define("js-yaml",[],()=>{return {};});
define("xml2js",[],()=>{return {};});
define("path",[],()=>{return {};});
define("fs",[],()=>{return {};});

//"buffer":"https://cdn.jsdelivr.net/npm/buffer@6.0.3/index",
window.Buffer=class Buffer{
    static isBuffer(ob){
        return false;
    }
}
window.global=window;

define("typeorm",["typeorm/index","typeorm/platform/PlatformTools","window.SQL","reflect-metadata"],function(to,pf,sql,buffer){
    pf.PlatformTools.type="browser";
    window.SQL=sql;
    
    return to;

});


/*
define("jassi_localserver/ext/typeorm-browser",["typeorm"], function(sql){
   
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',

});*/