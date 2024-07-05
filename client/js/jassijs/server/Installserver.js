var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
            var man = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DBManagerExt"], resolve_1, reject_1); }).then(__importStar));
            man.extendDBManager();
        }
    });
    var checkdir = async function (dir) {
        var fs = new FS_1.FS();
        var files = await fs.readdir(dir);
        for (var x = 0; x < files.length; x++) {
            var fullname = dir + "/" + files[x];
            if ((await fs.stat(fullname)).isDirectory()) {
                await checkdir(fullname);
            }
            else {
                if (fullname.startsWith("./client/")) {
                    fullname = fullname.replace("./client/", "");
                    if (!fullname.startsWith("js/")) {
                        var name = fullname.substring(0, fullname.length - 3);
                        Config_1.config.clientrequire.undef(name);
                        Config_1.config.serverrequire.undef(name);
                    }
                }
                else {
                    if (!fullname.startsWith("js/")) {
                        var name = fullname.substring(0, fullname.length - 3);
                        Config_1.config.serverrequire.undef(name);
                        Config_1.config.clientrequire.undef(name);
                    }
                }
            }
        }
    };
    var autostart = async function () {
        await checkdir(".");
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