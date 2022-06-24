var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/FileNode", "./Classes"], function (require, exports, Registry_1, RemoteObject_1, FileNode_1, Classes_1) {
    "use strict";
    var Server_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Server = void 0;
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
            var _a, _b, _c, _d, _e, _f;
            if (Server_1.filesInMap)
                return;
            var ret = {};
            for (var mod in jassijs.modules) {
                if ((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterModulInFilemap) {
                    if (((_d = (_c = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _c === void 0 ? void 0 : _c.Server) === null || _d === void 0 ? void 0 : _d.filterModulInFilemap.indexOf(mod)) === -1)
                        continue;
                }
                if (jassijs.modules[mod].endsWith(".js") || jassijs.modules[mod].indexOf(".js?") > -1) {
                    let mapname = jassijs.modules[mod].split("?")[0] + ".map";
                    if (jassijs.modules[mod].indexOf(".js?") > -1)
                        mapname = mapname + "?" + jassijs.modules[mod].split("?")[1];
                    var code = await $.ajax({ url: mapname, dataType: "text" });
                    var data = JSON.parse(code);
                    var files = data.sources;
                    for (let x = 0; x < files.length; x++) {
                        let fname = files[x].substring(files[x].indexOf(mod + "/"));
                        if (((_f = (_e = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _e === void 0 ? void 0 : _e.Server) === null || _f === void 0 ? void 0 : _f.filterSytemfilesInFilemap) === true) {
                            if (fname.endsWith("/modul.js") || fname.endsWith("/registry.js"))
                                continue;
                        }
                        if (fname.endsWith)
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
                var fs = await new Promise((resolve_1, reject_1) => { require(["jassijs/server/Filesystem"], resolve_1, reject_1); });
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
                var fs = await new Promise((resolve_2, reject_2) => { require(["jassijs/server/Filesystem"], resolve_2, reject_2); });
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
                var fs = await new Promise((resolve_3, reject_3) => { require(["jassijs/server/Filesystem"], resolve_3, reject_3); });
                return new fs.default().loadFiles(fileNames);
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
                if (!fromServerdirectory && Server_1.filesInMap[fileName]) {
                    //perhabs the files ar in localserver?
                    var Filessystem = Classes_1.classes.getClass("jassijs_localserver.Filessystem");
                    if (Filessystem && (await new Filessystem().loadFileEntry(fileName) !== undefined)) {
                        //use ajax
                    }
                    else {
                        var found = Server_1.filesInMap[fileName];
                        let mapname = jassijs.modules[found.modul].split("?")[0] + ".map";
                        if (jassijs.modules[found.modul].indexOf(".js?") > -1)
                            mapname = mapname + "?" + jassijs.modules[found.modul].split("?")[1];
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
                //@ts-ignore
                var fs = await new Promise((resolve_4, reject_4) => { require(["jassijs/server/Filesystem"], resolve_4, reject_4); });
                var rett = new fs.default().loadFile(fileName);
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
                    if (!fileName.startsWith("$serverside/") && (fileName.endsWith(".ts") || fileName.endsWith(".js"))) {
                        //@ts-ignore
                        var tss = await new Promise((resolve_5, reject_5) => { require(["jassijs_editor/util/Typescript"], resolve_5, reject_5); });
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
                var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);
                if (res === "") {
                    //@ts-ignore
                    new Promise((resolve_6, reject_6) => { require(["jassijs/ui/Notify"], resolve_6, reject_6); }).then((el) => {
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
                    new Promise((resolve_7, reject_7) => { require(["jassijs/ui/Notify"], resolve_7, reject_7); }).then((el) => {
                        el.notify(fileName + " not saved", "error", { position: "bottom right" });
                    });
                    throw new Classes_1.JassiError(res);
                }
                return res;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_1.JassiError("only admins can saveFiles");
                //@ts-ignore
                var fs = await new Promise((resolve_8, reject_8) => { require(["jassijs/server/Filesystem"], resolve_8, reject_8); });
                var ret = await new fs.default().saveFiles(fileNames, contents, true);
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
                var fs = await new Promise((resolve_9, reject_9) => { require(["jassijs/server/Filesystem"], resolve_9, reject_9); });
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
                var fs = await new Promise((resolve_10, reject_10) => { require(["jassijs/server/Filesystem"], resolve_10, reject_10); });
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
                var fs = await new Promise((resolve_11, reject_11) => { require(["jassijs/server/Filesystem"], resolve_11, reject_11); });
                return await new fs.default().rename(oldname, newname);
                ;
            }
        }
        /**
        * is the nodes server running
        **/
        static async isOnline(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //no serviceworker no serverside implementation
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
                //@ts-ignore
                var fs = await new Promise((resolve_12, reject_12) => { require(["jassijs/server/Filesystem"], resolve_12, reject_12); });
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
                var fs = await new Promise((resolve_13, reject_13) => { require(["jassijs/server/Filesystem"], resolve_13, reject_13); });
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
                var fs = await new Promise((resolve_14, reject_14) => { require(["jassijs/server/Filesystem"], resolve_14, reject_14); });
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
        (0, Registry_1.$Class)("jassijs.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
    exports.Server = Server;
});
//# sourceMappingURL=Server.js.map