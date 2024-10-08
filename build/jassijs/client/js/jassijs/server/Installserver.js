define(["require", "exports", "jassijs/remote/Serverservice", "./LocalProtocol", "jassijs/remote/Config", "./FS"], function (require, exports, Serverservice_1, LocalProtocol_1, Config_1, FS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autostart = void 0;
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
    var checkdir = async function (dir) {
        var fs = new FS_1.FS();
        var files = await fs.readdir(dir);
        for (var x = 0; x < files.length; x++) {
            if ((await fs.stat(files[x])).isDirectory) {
                await checkdir(files[x]);
            }
            else {
                var fname = files[x];
                fname = fname.replace("./client/", "");
                if (!fname.startsWith("./client/js/")) {
                    var name = fname.substring(0, fname.length - 3);
                    Config_1.config.serverrequire.undef(name);
                }
            }
        }
    };
    var autostart = async function () {
        checkdir("./client");
    };
    exports.autostart = autostart;
    Config_1.config.serverrequire.undef("jassijs/util/DatabaseSchema");
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