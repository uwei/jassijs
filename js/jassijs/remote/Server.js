"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Server_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Server = void 0;
const Jassi_1 = require("jassijs/remote/Jassi");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const FileNode_1 = require("jassijs/remote/FileNode");
const Classes_1 = require("./Classes");
let Server = Server_1 = class Server extends RemoteObject_1.RemoteObject {
    constructor() {
        super();
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
        if (Server_1.filesInMap)
            return;
        var ret = {};
        for (var mod in Jassi_1.default.modules) {
            if (Jassi_1.default.modules[mod].endsWith(".js") || Jassi_1.default.modules[mod].indexOf(".js?") > -1) {
                let mapname = Jassi_1.default.modules[mod].split("?")[0] + ".map";
                if (Jassi_1.default.modules[mod].indexOf(".js?") > -1)
                    mapname = mapname + "?" + Jassi_1.default.modules[mod].split("?")[1];
                var code = await $.ajax({ url: mapname, dataType: "text" });
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(mod + "/"));
                    ret[fname] = {
                        id: x,
                        modul: mod
                    };
                }
            }
        }
        Server_1.filesInMap = ret;
    }
    async addFilesFromMap(root) {
        await this.fillFilesInMapIfNeeded();
        for (var fname in Server_1.filesInMap) {
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
                            flag: "fromMap",
                            name: dirname,
                            files: []
                        };
                        parent.files.push(found);
                    }
                    parent = found;
                }
                else {
                    parent.files.push({
                        flag: "fromMap",
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
    async dir(withDate = false, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret;
            if ((await Server_1.isOnline(context)) === true)
                ret = await this.call(this, this.dir, withDate, context);
            else
                ret = { name: "", files: [] };
            await this.addFilesFromMap(ret);
            ret.fullpath = ""; //root
            let r = this._convertFileNode(ret);
            return r;
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            var rett = await new fs.default().dir("", withDate);
            return rett;
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    async zip(directoryname, serverdir = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.zip, directoryname, serverdir, context);
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().zip(directoryname, serverdir);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileNamew
     * @returns {string} content of the file
     */
    async loadFiles(fileNames, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.loadFiles, fileNames, context);
        }
        else {
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return new fs.default().loadFiles(fileNames);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    async loadFile(fileName, fromServerdirectory = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            await this.fillFilesInMapIfNeeded();
            if (!fromServerdirectory && Server_1.filesInMap[fileName]) {
                //perhabs the files ar in localserver?
                var Filessystem = Classes_1.classes.getClass("jassijs_localserver.Filessystem");
                if (Filessystem && (await new Filessystem().loadFileEntry(fileName) !== undefined)) {
                    //use ajax
                }
                else {
                    var found = Server_1.filesInMap[fileName];
                    let mapname = Jassi_1.default.modules[found.modul].split("?")[0] + ".map";
                    if (Jassi_1.default.modules[found.modul].indexOf(".js?") > -1)
                        mapname = mapname + "?" + Jassi_1.default.modules[found.modul].split("?")[1];
                    var code = await this.loadFile(mapname, fromServerdirectory, context);
                    var data = JSON.parse(code).sourcesContent[found.id];
                    return data;
                }
            }
            if (fromServerdirectory) {
                return await this.call(this, this.loadFile, fileName, fromServerdirectory, context);
            }
            else
                return $.ajax({ url: fileName, dataType: "text" });
            //return await this.call(this,"loadFile", fileName);
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can loadFile from Serverdirectory");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            var rett = new fs.default().loadFile(fileName);
            return rett;
        }
    }
    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    async saveFiles(fileNames, contents, fromServerdirectory = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var allfileNames = [];
            var allcontents = [];
            var alltsfiles = [];
            for (var f = 0; f < fileNames.length; f++) {
                var _this = this;
                var fileName = fileNames[f];
                var content = contents[f];
                if (!fromServerdirectory && fileName.endsWith(".ts") || fileName.endsWith(".js")) {
                    //@ts-ignore
                    var tss = await Promise.resolve().then(() => require("jassijs_editor/util/Typescript"));
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
            var res = await this.call(this, this.saveFiles, allfileNames, allcontents, fromServerdirectory, context);
            if (res === "") {
                //@ts-ignore
                $.notify(fileName + " saved", "info", { position: "bottom right" });
                if (!fromServerdirectory) {
                    for (var x = 0; x < alltsfiles.length; x++) {
                        await $.ajax({ url: alltsfiles[x], dataType: "text" });
                    }
                }
            }
            else {
                //@ts-ignore
                $.notify(fileName + " not saved", "error", { position: "bottom right" });
                throw new Classes_1.JassiError(res);
            }
            return res;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can saveFiles");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            var ret = await new fs.default().saveFiles(fileNames, contents, fromServerdirectory, true);
            return ret;
        }
    }
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    async saveFile(fileName, content, fromServerdirectory = undefined, context = undefined) {
        /*await this.fillFilesInMapIfNeeded();
        if (Server.filesInMap[fileName]) {
            //@ts-ignore
             $.notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
            return;
        }*/
        return await this.saveFiles([fileName], [content], fromServerdirectory, context);
        /* if (!jassijs.isServer) {
             var ret = await this.call(this, "saveFiles", fileNames, contents);
             //@ts-ignore
             //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
             return ret;
         } else {
             //@ts-ignore
             var fs: any = await import("jassijs/server/Filesystem");
             return new fs.default().saveFiles(fileNames, contents);
         }*/
    }
    /**
   * deletes a server modul
   **/
    async removeServerModul(name, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.removeServerModul, name, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can delete");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().removeServerModul(name);
        }
    }
    /**
    * deletes a file or directory
    **/
    async delete(name, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.delete, name, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can delete");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().remove(name);
        }
    }
    /**
     * renames a file or directory
     **/
    async rename(oldname, newname, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.rename, oldname, newname, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can rename");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().rename(oldname, newname);
            ;
        }
    }
    /**
    * is the nodes server running
    **/
    static async isOnline(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            try {
                if (this.isonline === undefined)
                    Server_1.isonline = await this.call(this.isOnline, context);
                return await Server_1.isonline;
            }
            catch (_a) {
                return false;
            }
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
        }
        else {
            return true;
        }
    }
    /**
     * creates a file
     **/
    async createFile(filename, content, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.createFile, filename, content, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can createFile");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().createFile(filename, content);
        }
    }
    /**
    * creates a file
    **/
    async createFolder(foldername, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.createFolder, foldername, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can createFolder");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().createFolder(foldername);
        }
    }
    async createModule(modulname, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.createModule, modulname, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can createFolder");
            //@ts-ignore
            var fs = await Promise.resolve().then(() => require("jassijs/server/Filesystem"));
            return await new fs.default().createModule(modulname);
        }
    }
    static async mytest(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this.mytest, context);
        }
        else
            return 14; //this is called on server
    }
};
Server.isonline = undefined;
//files found in js.map of modules in the jassijs.json
Server.filesInMap = undefined;
Server = Server_1 = __decorate([
    Jassi_1.$Class("jassijs.remote.Server"),
    __metadata("design:paramtypes", [])
], Server);
exports.Server = Server;
async function test() {
}
exports.test = test;
//# sourceMappingURL=Server.js.map