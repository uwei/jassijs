"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Server = void 0;
const Jassi_1 = require("jassi/remote/Jassi");
const RemoteObject_1 = require("jassi/remote/RemoteObject");
const FileNode_1 = require("jassi/remote/FileNode");
let Server = class Server extends RemoteObject_1.RemoteObject {
    constructor() {
        super(...arguments);
        this.filesInMap = undefined;
    }
    _convertFileNode(node) {
        var ret = new FileNode_1.FileNode();
        Object.assign(ret, node);
        if (ret.files !== undefined) {
            for (let x = 0; x < ret.files.length; x++) {
                ret.files[x].parent = ret;
                var s = ret.fullpath === undefined ? "" : ret.fullpath;
                ret.files[x].fullpath = s + (s === "" ? "" : "/") + ret.files[x].name;
                ret.files[x] = this._convertFileNode(ret.files[x]);
            }
        }
        return ret;
    }
    async fillFilesInMapIfNeeded() {
        if (this.filesInMap)
            return;
        this.filesInMap = {};
        for (var mod in Jassi_1.default.modules) {
            if (Jassi_1.default.modules[mod].endsWith(".js")) {
                var code = await this.loadFile(Jassi_1.default.modules[mod] + ".map");
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(mod + "/"));
                    this.filesInMap[fname] = {
                        id: x,
                        modul: mod
                    };
                }
            }
        }
    }
    async addFilesFromMap(root) {
        if (Jassi_1.default.isServer)
            throw Error("only on client");
        await this.fillFilesInMapIfNeeded();
        for (var fname in this.filesInMap) {
            let path = fname.split("/");
            var parent = root;
            for (let p = 0; p < path.length; p++) {
                if (p + 1 < path.length) {
                    let dirname = path[p];
                    var found = undefined;
                    for (let f = 0; f < parent.files.length; f++) {
                        if (parent.files[f].name === dirname)
                            found = parent.files[f];
                    }
                    if (!found) {
                        found = {
                            name: dirname,
                            files: []
                        };
                        parent.files.push(found);
                    }
                    parent = found;
                }
                else {
                    parent.files.push({
                        name: path[p],
                        date: undefined
                    });
                }
            }
        }
    }
    /**
    * gets alls ts/js-files from server
    * @param {Promise<string>} [async] - returns a Promise for asynchros handling
    * @returns {string[]} - list of files
    */
    async dir(withDate = false) {
        if (!Jassi_1.default.isServer) {
            var ret = await this.call(this, "dir", withDate);
            await this.addFilesFromMap(ret);
            ret.fullpath = ""; //root
            return this._convertFileNode(ret);
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            var rett = new fs.default().dir("", withDate);
            return rett;
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileNamew
     * @returns {string} content of the file
     */
    async loadFiles(fileNames) {
        if (!Jassi_1.default.isServer) {
            return await this.call(this, "loadFiles", fileNames);
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            return new fs.default().loadFiles(fileNames);
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    async loadFile(fileName) {
        if (!Jassi_1.default.isServer) {
            await this.fillFilesInMapIfNeeded();
            if (this.filesInMap[fileName]) {
                var found = this.filesInMap[fileName];
                var code = await this.loadFile(Jassi_1.default.modules[found.modul] + ".map");
                var data = JSON.parse(code).sourcesContent[found.id];
                return data;
            }
            return $.ajax({ url: fileName, dataType: "text" });
            //return await this.call(this,"loadFile", fileName);
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            var rett = new fs.default().loadFile(fileName);
            return rett;
        }
    }
    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    async saveFiles(fileNames, contents) {
        if (!Jassi_1.default.isServer) {
            var allfileNames = [];
            var allcontents = [];
            var alltsfiles = [];
            for (var f = 0; f < fileNames.length; f++) {
                var _this = this;
                var fileName = fileNames[f];
                var content = contents[f];
                if (fileName.endsWith(".ts")) {
                    //@ts-ignore
                    var tss = await Promise.resolve().then(() => require("jassi_editor/util/Typescript"));
                    var rets = await tss.default.transpile(fileName, content);
                    allfileNames = allfileNames.concat(rets.fileNames);
                    allcontents = allcontents.concat(rets.contents);
                    alltsfiles.push(fileName);
                }
                else {
                    allfileNames.push(fileName);
                    allcontents.push(content);
                }
            }
            var res = await this.call(this, "saveFiles", allfileNames, allcontents);
            if (res === "") {
                //@ts-ignore
                $.notify(fileName + " saved", "info", { position: "bottom right" });
                for (var x = 0; x < alltsfiles.length; x++) {
                    await $.ajax({ url: alltsfiles[x], dataType: "text" });
                }
            }
            else {
                //@ts-ignore
                $.notify(fileName + " not saved", "error", { position: "bottom right" });
                throw Error(res);
            }
            return res;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            var ret = await new fs.default().saveFiles(fileNames, contents, true);
            return ret;
        }
    }
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    async saveFile(fileName, content) {
        await this.fillFilesInMapIfNeeded();
        if (this.filesInMap[fileName]) {
            //@ts-ignore
            $.notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
            return;
        }
        return await this.saveFiles([fileName], [content]);
        /* if (!jassi.isServer) {
             var ret = await this.call(this, "saveFiles", fileNames, contents);
             //@ts-ignore
             //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
             return ret;
         } else {
             //@ts-ignore
             var fs: any = await import("jassi/server/Filessystem");
             return new fs.default().saveFiles(fileNames, contents);
         }*/
    }
    /**
    * renames a file or directory
    **/
    async delete(name) {
        if (!Jassi_1.default.isServer) {
            var ret = await this.call(this, "delete", name);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            return await new fs.default().remove(name);
        }
    }
    /**
     * renames a file or directory
     **/
    async rename(oldname, newname) {
        if (!Jassi_1.default.isServer) {
            var ret = await this.call(this, "rename", oldname, newname);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            return await new fs.default().rename(oldname, newname);
            ;
        }
    }
    /**
     * creates a file
     **/
    async createFile(filename, content) {
        if (!Jassi_1.default.isServer) {
            var ret = await this.call(this, "createFile", filename, content);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            return await new fs.default().createFile(filename, content);
        }
    }
    /**
    * creates a file
    **/
    async createFolder(foldername) {
        if (!Jassi_1.default.isServer) {
            var ret = await this.call(this, "createFolder", foldername);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassi/server/Filessystem"));
            return await new fs.default().createFolder(foldername);
        }
    }
    static async mytest() {
        if (!Jassi_1.default.isServer) {
            return await this.call("mytest");
        }
        else
            return 14; //this is called on server
    }
};
Server = __decorate([
    Jassi_1.$Class("jassi.remote.Server")
], Server);
exports.Server = Server;
async function test() {
    console.log(await Server.mytest());
}
exports.test = test;
//# sourceMappingURL=Server.js.map