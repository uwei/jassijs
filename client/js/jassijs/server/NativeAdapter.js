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
define(["require", "exports", "jassijs/remote/Config", "./FS", "./LocalFS", "./Reloader"], function (require, exports, Config_1, FS_1, LocalFS_1, Reloader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.doNotReloadModule = exports.transpile = exports.reloadJSAll = exports.dozip = exports.myfs = exports.exists = exports.ts = void 0;
    //@ts-ignore
    Config_1.config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
        //@ts-ignore
        require("jassijs/server/NativeAdapter").ts = window.ts;
    });
    //@ts-ignore;
    const ts = window.ts;
    var exists = FS_1.exists;
    exports.exists = exists;
    var myfs = new FS_1.FS();
    exports.myfs = myfs;
    if (Config_1.config.isLocalFolderMapped) {
        exports.myfs = myfs = new LocalFS_1.LocalFS();
        exports.exists = exists = LocalFS_1.exists;
    }
    async function dozip(directoryname, serverdir = undefined) {
        //@ts-ignore
        var JSZip = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/ext/jszip"], resolve_1, reject_1); }).then(__importStar)).default;
        if (serverdir)
            throw new Error("serverdir is unsupported on localserver");
        var zip = new JSZip();
        var files = await this.dirEntry(directoryname);
        for (let x = 0; x < files.length; x++) {
            if (files[x].isDirectory)
                zip.folder(files[x].id);
            else
                zip.file(files[x].id, files[x].data);
        }
        var ret = await zip.generateAsync({ type: "base64" });
        //var ret = await zip.generateAsync({ type: "base64" });
        return ret;
    }
    exports.dozip = dozip;
    async function reloadJSAll(filenames, afterUnload) {
        return Reloader_1.Reloader.instance.reloadJSAll(filenames, afterUnload, true);
        /*var Reloader=<any>await new Promise((resolve)=>{
            config.clientrequire(["jassijs/util/Reloader"], r => {
                resolve(r);
            })
        });
        return Reloader.Reloader.instance.reloadJSAll(filenames, afterUnload,true);*/
    }
    exports.reloadJSAll = reloadJSAll;
    async function transpile(fileName, inServerdirectory = undefined) {
        var tp = await new Promise((resolve) => {
            Config_1.config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
                resolve(ts1);
            });
        });
        var content = await myfs.readFile(fileName);
        var data = await tp.Typescript.instance.transpile(fileName, content);
        for (var x = 0; x < data.fileNames.length; x++) {
            var fname = "./" + data.fileNames[x];
            if (!await exists(myfs.getDirectoryname(fname)))
                await myfs.mkdir(myfs.getDirectoryname(fname), { recursive: true });
            await myfs.writeFile(fname, data.contents[x]);
        }
    }
    exports.transpile = transpile;
    var doNotReloadModule = true;
    exports.doNotReloadModule = doNotReloadModule;
});
//# sourceMappingURL=NativeAdapter.js.map