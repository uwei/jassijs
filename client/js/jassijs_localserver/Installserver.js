define("jassijs_localserver/Installserver", ["jassijs_localserver/Filesystem", "jassijs_localserver/DatabaseSchema", "jassijs/remote/Serverservice", "jassijs_localserver/DBManagerExt"], function (Filesystem, schema, serverservice, dbmanext) {
    serverservice.beforeServiceLoad((name, service) => {
        if (name === "db") {
            dbmanext.extendDBManager(service);
        }
    });
    return {
        //search for file in local-DB and undefine this files 
        //so this files could be loaded from local-DB
        autostart: async function () {
            var files = await new Filesystem.default().dirFiles("", ["js", "ts"]);
            files.forEach((fname) => {
                if (!fname.startsWith("js/")) {
                    var name = fname.substring(0, fname.length - 3);
                    requirejs.undef(name);
                }
            });
        }
    };
});
requirejs.undef("jassijs/util/DatabaseSchema");
define("jassijs/util/DatabaseSchema", ["jassijs_localserver/DatabaseSchema"], function (to) {
    return to;
});
define("jassijs/server/DoRemoteProtocol", ["jassijs_localserver/LocalProtocol"], function (locprot) {
    return {
        _execute: async function (protext, request, context) {
            var prot = JSON.parse(protext);
            return await locprot.localExec(prot, context);
        }
    };
});
/*
define("jassijs/server/Filesystem", ["jassijs_localserver/Filesystem"], function (fs) {
    return fs

})*/
//DatabaseSchema
//# sourceMappingURL=Installserver.js.map