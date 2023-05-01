import { beforeServiceLoad, serverservices } from "jassijs/remote/Serverservice";
import { messageReceived } from "./LocalProtocol";
import { config } from "jassijs/remote/Config";
import { FS } from "./FS";
//


var load = serverservices;
//throw new Error("Kkk"); 
navigator.serviceWorker.controller.postMessage({
    type: 'ACTIVATE_REMOTEPROTCOL'
});
navigator.serviceWorker.addEventListener("message", (evt) => {
    var _a;
    if (((_a = evt.data) === null || _a === void 0 ? void 0 : _a.type) === "REQUEST_REMOTEPROTCOL") {

        messageReceived(evt);


    }
});
beforeServiceLoad(async (name, service) => {
    if (name === "db") {
        var man = (await import("jassijs/server/DBManagerExt"))
        man.extendDBManager();
    }
});
var autostart = async function () {
    var files = await new FS().readdir("./client");
    for (var x = 0; x < files.length; x++) {
        var fname = files[x];
        fname = fname.replace("./client/", "");
        if (!fname.startsWith("./client/js/")) {
            var name = fname.substring(0, fname.length - 3);
            config.serverrequire.undef(name);
        }
    }
}



export { autostart };
config.serverrequire.undef("jassijs/util/DatabaseSchema");

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