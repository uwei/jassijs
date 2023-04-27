import { beforeServiceLoad, serverservices } from "jassijs/remote/Serverservice";
import { messageReceived } from "./LocalProtocol";

//

 
var load=serverservices;
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
        var man=(await import("jassijs/server/DBManagerExt"))
        man.extendDBManager();
    }
});
var ret={
    //search for file in local-DB and undefine this files 
    //so this files could be loaded from local-DB
    autostart: async function () {
        var Filesystem=(await import("jassijs/server/Filesystem")).default;
        var files = await new Filesystem().dirFiles("", ["js", "ts"]);
        files.forEach((fname) => {
            if (!fname.startsWith("js/")) {
                var name = fname.substring(0, fname.length - 3);
                requirejs.undef(name);
            }

        });
    }
}
export default {ret};
requirejs.undef("jassijs/util/DatabaseSchema");

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