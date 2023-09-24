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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Server_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const FileNode_1 = require("jassijs/remote/FileNode");
const Classes_1 = require("./Classes");
const Serverservice_1 = require("./Serverservice");
const Validator_1 = require("jassijs/remote/Validator");
const Config_1 = require("./Config");
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
    async fillMapModules(ret, serverModules) {
        var _a, _b, _c, _d, _e, _f, _g;
        var modules = Config_1.config.modules;
        if (serverModules === true)
            modules = (_a = Config_1.config.server) === null || _a === void 0 ? void 0 : _a.modules;
        if (modules === undefined)
            return;
        for (var mod in modules) {
            if ((_c = (_b = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _b === void 0 ? void 0 : _b.Server) === null || _c === void 0 ? void 0 : _c.filterModulInFilemap) {
                if (((_e = (_d = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _d === void 0 ? void 0 : _d.Server) === null || _e === void 0 ? void 0 : _e.filterModulInFilemap.indexOf(mod)) === -1)
                    continue;
            }
            if (modules[mod].endsWith(".js") || modules[mod].indexOf(".js?") > -1) {
                let mapname = modules[mod].split("?")[0] + ".map";
                if (modules[mod].indexOf(".js?") > -1)
                    mapname = mapname + "?" + modules[mod].split("?")[1];
                var code = await $.ajax({ url: mapname, dataType: "text" });
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(mod + "/"));
                    if (((_g = (_f = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _f === void 0 ? void 0 : _f.Server) === null || _g === void 0 ? void 0 : _g.filterSytemfilesInFilemap) === true) {
                        if (fname.endsWith("/modul.js") || fname.endsWith("/registry.js"))
                            continue;
                    }
                    if (fname.endsWith)
                        ret[(serverModules ? "$serverside/" : "") + fname] = {
                            id: x,
                            modul: mod
                        };
                }
            }
        }
    }
    async fillFilesInMapIfNeeded() {
        if (Server_1.filesInMap)
            return;
        var ret = {};
        await this.fillMapModules(ret, false);
        await this.fillMapModules(ret, true);
        Server_1.filesInMap = ret;
    }
    async addFilesFromMap(root) {
        await this.fillFilesInMapIfNeeded();
        for (var fname in Server_1.filesInMap) {
            if (fname.startsWith("$serverside"))
                continue;
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
            var rett = await (await Serverservice_1.serverservices.filesystem).dir("", withDate);
            return rett;
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    async zip(directoryname, serverdir = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.zip, directoryname, serverdir, context);
        }
        else {
            return (await Serverservice_1.serverservices.filesystem).zip(directoryname, serverdir);
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
            return (await Serverservice_1.serverservices.filesystem).loadFiles(fileNames);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    async loadFile(fileName, context = undefined) {
        var fromServerdirectory = fileName.startsWith("$serverside/");
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            await this.fillFilesInMapIfNeeded();
            if (Server_1.filesInMap[fileName]) {
                var foundOnLocalserver = false;
                if (Config_1.config.serverrequire) {
                    var r = await new Promise((resolve) => {
                        Config_1.config.serverrequire(["jassijs/server/NativeAdapter"], (adapter) => {
                            resolve(adapter);
                        });
                    });
                    var fname = "./client/" + fileName;
                    if (fromServerdirectory)
                        fname = fileName.replace("$serverside/", "./");
                    if (r.exists && await r.exists(fname)) {
                        foundOnLocalserver = true;
                    }
                }
                if (foundOnLocalserver) {
                    //use ajax
                }
                else {
                    var found = Server_1.filesInMap[fileName];
                    let mapname = Config_1.config.modules[found.modul].split("?")[0] + ".map";
                    if (fromServerdirectory)
                        mapname = Config_1.config.server.modules[found.modul].split("?")[0] + ".map";
                    if (Config_1.config.modules[found.modul].indexOf(".js?") > -1)
                        mapname = mapname + "?" + Config_1.config.modules[found.modul].split("?")[1];
                    var code = await this.loadFile(mapname, context);
                    var data = JSON.parse(code).sourcesContent[found.id];
                    return data;
                }
            }
            if (fromServerdirectory) {
                return await this.call(this, this.loadFile, fileName, context);
            }
            else
                return $.ajax({ url: fileName, dataType: "text" });
            //return await this.call(this,"loadFile", fileName);
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can loadFile from Serverdirectory");
            var rett = await (await Serverservice_1.serverservices.filesystem).loadFile(fileName);
            return rett;
        }
    }
    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    async saveFiles(fileNames, contents, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var allfileNames = [];
            var allcontents = [];
            var alltsfiles = [];
            for (var f = 0; f < fileNames.length; f++) {
                var _this = this;
                var fileName = fileNames[f];
                var content = contents[f];
                if (!fileName.startsWith("$serverside/") && (fileName.endsWith(".tsx") || fileName.endsWith(".ts") || fileName.endsWith(".js"))) {
                    //var tss = await import("jassijs_editor/util/Typescript");
                    var tss = await Classes_1.classes.loadClass("jassijs_editor.util.Typescript");
                    var rets = await tss.instance.transpile(fileName, content);
                    allfileNames = allfileNames.concat(rets.fileNames);
                    allcontents = allcontents.concat(rets.contents);
                    alltsfiles.push(fileName);
                }
                else {
                    allfileNames.push(fileName);
                    allcontents.push(content);
                }
            }
            var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);
            if (res === "") {
                //@ts-ignore
                Promise.resolve().then(() => require("jassijs/ui/Notify")).then((el) => {
                    el.notify(fileName + " saved", "info", { position: "bottom right" });
                });
                //if (!fromServerdirectory) {
                for (var x = 0; x < alltsfiles.length; x++) {
                    await $.ajax({ url: alltsfiles[x], dataType: "text" });
                }
                // }
            }
            else {
                //@ts-ignore
                Promise.resolve().then(() => require("jassijs/ui/Notify")).then((el) => {
                    el.notify(fileName + " not saved", "error", { position: "bottom right" });
                });
                throw new Classes_1.JassiError(res);
            }
            return res;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can saveFiles");
            var ret = (await Serverservice_1.serverservices.filesystem).saveFiles(fileNames, contents, true);
            return ret;
        }
    }
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    async saveFile(fileName, content, context = undefined) {
        /*await this.fillFilesInMapIfNeeded();
        if (Server.filesInMap[fileName]) {
            //@ts-ignore
             notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
            return;
        }*/
        return await this.saveFiles([fileName], [content], context);
    }
    /**
   * deletes a server modul
   **/
    async testServersideFile(name, context = undefined) {
        if (!name.startsWith("$serverside/"))
            throw new Classes_1.JassiError(name + " is not a serverside file");
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.testServersideFile, name, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin) {
                throw new Classes_1.JassiError("only admins can delete");
            }
            //@ts-ignore
            var test = (await Promise.resolve().then(() => require(name.replaceAll("$serverside/", "")))).test;
            var ret;
            if (test)
                ret = await test();
            return ret;
        }
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
            return (await Serverservice_1.serverservices.filesystem).removeServerModul(name);
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
            return (await Serverservice_1.serverservices.filesystem).remove(name);
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
            return (await Serverservice_1.serverservices.filesystem).rename(oldname, newname);
            ;
        }
    }
    /**
    * is the nodes server running
    **/
    static async isOnline(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            //no serviceworker no serverside implementation
            //@ts-ignore
            if (navigator.serviceWorker.controller === null)
                return false;
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
            return (await Serverservice_1.serverservices.filesystem).createFile(filename, content);
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
            return (await Serverservice_1.serverservices.filesystem).createFolder(foldername);
        }
    }
    async createModule(modulename, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            var ret = await this.call(this, this.createModule, modulename, context);
            if (!Config_1.config.modules[modulename]) {
                //config.jsonData.modules[modulename] = modulename;
                await Config_1.config.reload();
            }
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        }
        else {
            if (!context.request.user.isAdmin)
                throw new Classes_1.JassiError("only admins can createFolder");
            return (await Serverservice_1.serverservices.filesystem).createModule(modulename);
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
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsBoolean({ optional: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "dir", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __param(1, Validator_1.ValidateIsBoolean({ optional: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "zip", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsArray({ type: tp => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "loadFiles", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "loadFile", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsArray({ type: type => String })),
    __param(1, Validator_1.ValidateIsArray({ type: type => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "saveFiles", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __param(1, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "saveFile", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "testServersideFile", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "removeServerModul", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "delete", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __param(1, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "rename", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "createFile", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "createFolder", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Server.prototype, "createModule", null);
Server = Server_1 = __decorate([
    Registry_1.$Class("jassijs.remote.Server"),
    __metadata("design:paramtypes", [])
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map