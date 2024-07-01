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
var checkdir = async function (dir: string) {
    var fs = new FS()
    var files = await fs.readdir(dir);
    for (var x = 0; x < files.length; x++) {
        var fullname = dir + "/" + files[x];
        if ((await fs.stat(fullname)).isDirectory()) {
            await checkdir(fullname);
        } else {
            if (fullname.startsWith("./client/")) {
                fullname = fullname.replace("./client/", "");
                if (!fullname.startsWith("js/")) {
                    var name = fullname.substring(0, fullname.length - 3);
                    config.clientrequire.undef(name);
                    config.serverrequire.undef(name);

                }
            }else{
                if (!fullname.startsWith("js/")) {
                    var name = fullname.substring(0, fullname.length - 3);
                    config.serverrequire.undef(name);
                    config.clientrequire.undef(name);
                }
            }
        }
    }
}
var autostart = async function () {
    await checkdir(".");
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