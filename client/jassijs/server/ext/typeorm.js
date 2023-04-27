

/*

/// <amd-dependency path="typeorm/index" name="to"/>
/// <amd-dependency path="typeorm/platform/PlatformTools" name="pf"/>
/// <amd-dependency path="window.SQL" name="sql"/>
/// <amd-dependency path="reflect-metadata" name="buffer"/>
declare var to;

//define("typeorm",["typeorm/index","typeorm/platform/PlatformTools","window.SQL","reflect-metadata"],function(to,pf,sql,buffer){



//"buffer":"https://cdn.jsdelivr.net/npm/buffer@6.0.3/index",
window.Buffer=class Buffer{
    static isBuffer(ob){
        return false;
    }
}
window.global=window;

   pf.PlatformTools.type="browser";
    window.SQL=sql;
    
    export {to};

*/






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
