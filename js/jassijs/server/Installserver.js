"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autostart = void 0;
const Serverservice_1 = require("jassijs/remote/Serverservice");
const LocalProtocol_1 = require("./LocalProtocol");
const Config_1 = require("jassijs/remote/Config");
const FS_1 = require("./FS");
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
        var man = (await Promise.resolve().then(() => require("jassijs/server/DBManagerExt")));
        man.extendDBManager();
    }
});
var autostart = async function () {
    var files = await new FS_1.FS().readdir("./client");
    for (var x = 0; x < files.length; x++) {
        var fname = files[x];
        fname = fname.replace("./client/", "");
        if (!fname.startsWith("./client/js/")) {
            var name = fname.substring(0, fname.length - 3);
            Config_1.config.serverrequire.undef(name);
        }
    }
};
exports.autostart = autostart;
Config_1.config.serverrequire.undef("jassijs/util/DatabaseSchema");
define("jassijs/util/DatabaseSchema", ["jassijs/server/DatabaseSchema"], function (to) {
    return to;
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