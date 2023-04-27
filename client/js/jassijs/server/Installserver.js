define(["require", "exports", "jassijs/remote/Serverservice", "./LocalProtocol"], function (require, exports, Serverservice_1, LocalProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //
    var load = Serverservice_1.serverservices;
    //throw new Error("Kkk"); 
    navigator.serviceWorker.controller.postMessage({
        type: 'ACTIVATE_REMOTEPROTCOL'
    });
    navigator.serviceWorker.addEventListener("message", (evt) => {
        var _a;
        if (((_a = evt.data) === null || _a === void 0 ? void 0 : _a.type) === "REQUEST_REMOTEPROTCOL") {
            (0, LocalProtocol_1.messageReceived)(evt);
        }
    });
    (0, Serverservice_1.beforeServiceLoad)(async (name, service) => {
        if (name === "db") {
            var man = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DBManagerExt"], resolve_1, reject_1); }));
            man.extendDBManager();
        }
    });
    var ret = {
        //search for file in local-DB and undefine this files 
        //so this files could be loaded from local-DB
        autostart: async function () {
            var Filesystem = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/Filesystem"], resolve_2, reject_2); })).default;
            var files = await new Filesystem().dirFiles("", ["js", "ts"]);
            files.forEach((fname) => {
                if (!fname.startsWith("js/")) {
                    var name = fname.substring(0, fname.length - 3);
                    requirejs.undef(name);
                }
            });
        }
    };
    exports.default = { ret };
    requirejs.undef("jassijs/util/DatabaseSchema");
    define("jassijs/util/DatabaseSchema", ["jassijs/server/DatabaseSchema"], function (to) {
        return to;
    });
});
/*define("jassijs/server/DoRemoteProtocol", ["jassijs/server/LocalProtocol"], function (locprot) {
    return {
        _execute: async function (protext, request, context) {
            var prot = JSON.parse(protext);
            return await locprot.localExec(prot, context);
        }
    }
})*/
/*
define("jassijs/server/Filesystem", ["jassijs/server/Filesystem"], function (fs) {
    return fs

})*/
//DatabaseSchema
//# sourceMappingURL=Installserver.js.map