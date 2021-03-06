define("jassi_localserver/Installserver",["jassi_localserver/Filesystem"],function(Filesystem){
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

define("jassi/util/DatabaseSchema", ["jassi_localserver/DatabaseSchema"], function (to) {
    return to;
});
define("jassi/server/DoRemoteProtocol",["jassi_localserver/LocalProtocol"],function(locprot){
    return{
        _execute: async function (protext,request,context){
            var prot=JSON.parse(protext);
            return await locprot.localExec(prot,context);
        }
    }
})

define("jassi/server/Filesystem",["jassi_localserver/Filesystem"],function(fs){
    return        fs
    
})
define("jassi/server/DBManager", ["jassi_localserver/DBManager", "jassi/remote/Classes", "jassi/remote/Registry","jassi_localserver/DBManager","jassi_localserver/TypeORMListener","typeorm","jassi/remote/Database"], function (db, Classes_1, Registry_1,dbman,TypeORMListener,to,Database) {
    
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
        var tcl=await Classes_1.classes.loadClass("jassi_localserver.TypeORMListener");
        to.EventSubscriber()(tcl);
        var Filessystem=await Classes_1.classes.loadClass("jassi_localserver.Filessystem");
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