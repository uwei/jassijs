define("jassijs_localserver/Installserver",["jassijs_localserver/Filesystem","jassijs_localserver/DatabaseSchema"],function(Filesystem,schema){
    return{
        autostart:async function(){
            var files=await new Filesystem.default().dirFiles("",["js","ts"]);
            files.forEach((fname)=>{
                if(!fname.startsWith("js/")){
                    var name=fname.substring(0,fname.length-3);
                    requirejs.undef(name);
                }

            });
        }
    }
});
requirejs.undef("jassijs/util/DatabaseSchema");

define("jassijs/util/DatabaseSchema", ["jassijs_localserver/DatabaseSchema"], function (to) {
    return to;
});
define("jassijs/server/DoRemoteProtocol",["jassijs_localserver/LocalProtocol"],function(locprot){
    return{
        _execute: async function (protext,request,context){
            var prot=JSON.parse(protext);
            return await locprot.localExec(prot,context);
        }
    }
})

define("jassijs/server/Filesystem",["jassijs_localserver/Filesystem"],function(fs){
    return        fs
    
})
define("jassijs/server/DBManager", ["jassijs_localserver/DBManager", "jassijs/remote/Classes", "jassijs/remote/Registry","jassijs_localserver/DBManager","jassijs_localserver/TypeORMListener","typeorm","jassijs/remote/Database"], function (db, Classes_1, Registry_1,dbman,TypeORMListener,to,Database) {
    
    db.DBManager["getConOpts"] = async function () {
        var dbclasses = [];
        const initSqlJs = window["SQL"];
        const SQL = await window["SQL"]({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/${file}`
        });

        var dbobjects = await Registry_1.default.getJSONData("$DBObject");
        var dbfiles=[];
        for (var o = 0; o < dbobjects.length; o++) {
            var clname = dbobjects[o].classname;
            try {
                dbfiles.push(dbobjects[o].filename.replace(".ts",""));
                dbclasses.push(await Classes_1.classes.loadClass(clname));
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        db.DBManager.clearMetadata();
        Database.db.fillDecorators();
        var tcl=await Classes_1.classes.loadClass("jassijs_localserver.TypeORMListener");
        to.EventSubscriber()(tcl);
        var Filessystem=await Classes_1.classes.loadClass("jassijs_localserver.Filessystem");
        var data=await new Filessystem().loadFile("__default.db");
        var opt = {
            database:data,
            type: "sqljs",
            subscribers:[TypeORMListener.TypeORMListener],
            "entities": dbclasses
        };
        return opt;
    }
    return db;
});
//DatabaseSchema