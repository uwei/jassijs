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
        async testServersideFile(name, context = undefined) {
            if (!name.startsWith("$serverside/"))
                throw new Classes_1.JassiError(name + " i not a serverside file");
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
                var test = (await new Promise((resolve_9, reject_9) => { require([name.replaceAll("$serverside/", "")], resolve_9, reject_9); })).test;
                if (test)
                    Server_1.lastTestServersideFileResult = await test();
                return Server_1.lastTestServersideFileResult;
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
                //@ts-ignore
                var fs = await new Promise((resolve_10, reject_10) => { require(["jassijs/server/Filesystem"], resolve_10, reject_10); });
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
                var fs = await new Promise((resolve_11, reject_11) => { require(["jassijs/server/Filesystem"], resolve_11, reject_11); });
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
                var fs = await new Promise((resolve_12, reject_12) => { require(["jassijs/server/Filesystem"], resolve_12, reject_12); });
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
                var fs = await new Promise((resolve_13, reject_13) => { require(["jassijs/server/Filesystem"], resolve_13, reject_13); });
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
                var fs = await new Promise((resolve_14, reject_14) => { require(["jassijs/server/Filesystem"], resolve_14, reject_14); });
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
                var fs = await new Promise((resolve_15, reject_15) => { require(["jassijs/server/Filesystem"], resolve_15, reject_15); });
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
    Server.lastTestServersideFileResult = undefined;
    //files found in js.map of modules in the jassijs.json
    Server.filesInMap = undefined;
    Server = Server_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
    exports.Server = Server;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy9yZW1vdGUvU2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBVUEsSUFBYSxNQUFNLGNBQW5CLE1BQWEsTUFBTyxTQUFRLDJCQUFZO1FBS3BDO1lBQ0ksS0FBSyxFQUFFLENBQUM7UUFFWixDQUFDO1FBQ08sZ0JBQWdCLENBQUMsSUFBYztZQUNuQyxJQUFJLEdBQUcsR0FBYSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztvQkFDdkQsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDdEUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FB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TyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2hEOztnQkFDRyxPQUFPLEVBQUUsQ0FBQyxDQUFBLDBCQUEwQjtRQUM1QyxDQUFDO0tBQ0osQ0FBQTtJQS9aa0IsZUFBUSxHQUFxQixTQUFVLENBQUE7SUFDL0MsbUNBQTRCLEdBQUMsU0FBUyxDQUFDO0lBQzlDLHNEQUFzRDtJQUN4QyxpQkFBVSxHQUFzRCxTQUFVLENBQUE7SUFKL0UsTUFBTTtRQURsQixJQUFBLGlCQUFNLEVBQUMsdUJBQXVCLENBQUM7O09BQ25CLE1BQU0sQ0FnYWxCO0lBaGFZLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBDb250ZXh0LCBSZW1vdGVPYmplY3QgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVtb3RlT2JqZWN0XCI7XHJcbmltcG9ydCB7IEZpbGVOb2RlIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0ZpbGVOb2RlXCI7XHJcbmltcG9ydCB7IGNsYXNzZXMsIEphc3NpRXJyb3IgfSBmcm9tIFwiLi9DbGFzc2VzXCI7XHJcblxyXG5cclxuXHJcblxyXG5AJENsYXNzKFwiamFzc2lqcy5yZW1vdGUuU2VydmVyXCIpXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXIgZXh0ZW5kcyBSZW1vdGVPYmplY3Qge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaXNvbmxpbmU6IFByb21pc2U8Ym9vbGVhbj4gPSB1bmRlZmluZWQ7XHJcbiAgICBzdGF0aWMgbGFzdFRlc3RTZXJ2ZXJzaWRlRmlsZVJlc3VsdD11bmRlZmluZWQ7XHJcbiAgICAvL2ZpbGVzIGZvdW5kIGluIGpzLm1hcCBvZiBtb2R1bGVzIGluIHRoZSBqYXNzaWpzLmpzb25cclxuICAgIHB1YmxpYyBzdGF0aWMgZmlsZXNJbk1hcDogeyBbbmFtZTogc3RyaW5nXTogeyBtb2R1bDogc3RyaW5nLCBpZDogbnVtYmVyIH0gfSA9IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7IFxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgX2NvbnZlcnRGaWxlTm9kZShub2RlOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgICAgICB2YXIgcmV0OiBGaWxlTm9kZSA9IG5ldyBGaWxlTm9kZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCBub2RlKTtcclxuICAgICAgICBpZiAocmV0LmZpbGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCByZXQuZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XS5wYXJlbnQgPSByZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgcyA9IHJldC5mdWxscGF0aCA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHJldC5mdWxscGF0aDtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XS5mdWxscGF0aCA9IHMgKyAocyA9PT0gXCJcIiA/IFwiXCIgOiBcIi9cIikgKyByZXQuZmlsZXNbeF0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XSA9IHRoaXMuX2NvbnZlcnRGaWxlTm9kZShyZXQuZmlsZXNbeF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBhc3luYyBmaWxsRmlsZXNJbk1hcElmTmVlZGVkKCkge1xyXG4gICAgICAgIGlmIChTZXJ2ZXIuZmlsZXNJbk1hcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBtb2QgaW4gamFzc2lqcy5tb2R1bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKGphc3NpanM/Lm9wdGlvbnM/LlNlcnZlcj8uZmlsdGVyTW9kdWxJbkZpbGVtYXApe1xyXG4gICAgICAgICAgICAgICAgaWYoamFzc2lqcz8ub3B0aW9ucz8uU2VydmVyPy5maWx0ZXJNb2R1bEluRmlsZW1hcC5pbmRleE9mKG1vZCk9PT0tMSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoamFzc2lqcy5tb2R1bGVzW21vZF0uZW5kc1dpdGgoXCIuanNcIikgfHwgamFzc2lqcy5tb2R1bGVzW21vZF0uaW5kZXhPZihcIi5qcz9cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcG5hbWUgPSBqYXNzaWpzLm1vZHVsZXNbbW9kXS5zcGxpdChcIj9cIilbMF0gKyBcIi5tYXBcIjtcclxuICAgICAgICAgICAgICAgIGlmIChqYXNzaWpzLm1vZHVsZXNbbW9kXS5pbmRleE9mKFwiLmpzP1wiKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hcG5hbWUgPSBtYXBuYW1lICsgXCI/XCIgKyBqYXNzaWpzLm1vZHVsZXNbbW9kXS5zcGxpdChcIj9cIilbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgY29kZSA9IGF3YWl0ICQuYWpheCh7IHVybDogbWFwbmFtZSwgZGF0YVR5cGU6IFwidGV4dFwiIH0pXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoY29kZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsZXMgPSBkYXRhLnNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGZpbGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZuYW1lID0gZmlsZXNbeF0uc3Vic3RyaW5nKGZpbGVzW3hdLmluZGV4T2YobW9kICsgXCIvXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihqYXNzaWpzPy5vcHRpb25zPy5TZXJ2ZXI/LmZpbHRlclN5dGVtZmlsZXNJbkZpbGVtYXA9PT10cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZm5hbWUuZW5kc1dpdGgoXCIvbW9kdWwuanNcIil8fGZuYW1lLmVuZHNXaXRoKFwiL3JlZ2lzdHJ5LmpzXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZuYW1lLmVuZHNXaXRoKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldFtmbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bDogbW9kXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBTZXJ2ZXIuZmlsZXNJbk1hcCA9IHJldDtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBhZGRGaWxlc0Zyb21NYXAocm9vdDogRmlsZU5vZGUpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmZpbGxGaWxlc0luTWFwSWZOZWVkZWQoKTtcclxuICAgICAgICBmb3IgKHZhciBmbmFtZSBpbiBTZXJ2ZXIuZmlsZXNJbk1hcCkge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZuYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGF0aC5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgKyAxIDwgcGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlybmFtZSA9IHBhdGhbcF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgcGFyZW50LmZpbGVzLmxlbmd0aDsgZisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuZmlsZXNbZl0ubmFtZSA9PT0gZGlybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gcGFyZW50LmZpbGVzW2ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZzogXCJmcm9tTWFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkaXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LmZpbGVzLnB1c2goZm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBmb3VuZDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5maWxlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZzogXCJmcm9tTWFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBhdGhbcF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICogZ2V0cyBhbGxzIHRzL2pzLWZpbGVzIGZyb20gc2VydmVyXHJcbiAgICAqIEBwYXJhbSB7UHJvbWlzZTxzdHJpbmc+fSBbYXN5bmNdIC0gcmV0dXJucyBhIFByb21pc2UgZm9yIGFzeW5jaHJvcyBoYW5kbGluZ1xyXG4gICAgKiBAcmV0dXJucyB7c3RyaW5nW119IC0gbGlzdCBvZiBmaWxlc1xyXG4gICAgKi9cclxuICAgIGFzeW5jIGRpcih3aXRoRGF0ZTogYm9vbGVhbiA9IGZhbHNlLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxGaWxlTm9kZT4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJldDogRmlsZU5vZGU7XHJcbiAgICAgICAgICAgIGlmICgoYXdhaXQgU2VydmVyLmlzT25saW5lKGNvbnRleHQpKSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIHJldCA9IDxGaWxlTm9kZT5hd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5kaXIsIHdpdGhEYXRlLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0ID0geyBuYW1lOiBcIlwiLCBmaWxlczogW10gfTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hZGRGaWxlc0Zyb21NYXAocmV0KTtcclxuICAgICAgICAgICAgcmV0LmZ1bGxwYXRoID0gXCJcIjsvL3Jvb3RcclxuICAgICAgICAgICAgbGV0IHIgPSB0aGlzLl9jb252ZXJ0RmlsZU5vZGUocmV0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmcyA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcbiAgICAgICAgICAgIHZhciByZXR0OiBGaWxlTm9kZSA9IGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuZGlyKFwiXCIsIHdpdGhEYXRlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldHQ7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBbXCJqYXNzaWpzL2Jhc2UvQ2hyb21lRGVidWdnZXIudHNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFzeW5jIHppcChkaXJlY3RvcnluYW1lOiBzdHJpbmcsIHNlcnZlcmRpcjogYm9vbGVhbiA9IHVuZGVmaW5lZCwgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDx7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0+YXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuemlwLCBkaXJlY3RvcnluYW1lLCBzZXJ2ZXJkaXIsIGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnMgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3NlcnZlci9GaWxlc3lzdGVtXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS56aXAoZGlyZWN0b3J5bmFtZSwgc2VydmVyZGlyKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIFtcImphc3NpanMvYmFzZS9DaHJvbWVEZWJ1Z2dlci50c1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIGZyb20gc2VydmVyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWV3XHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IG9mIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRGaWxlcyhmaWxlTmFtZXM6IHN0cmluZ1tdLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8eyBbaWQ6IHN0cmluZ106IHN0cmluZyB9PmF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmxvYWRGaWxlcywgZmlsZU5hbWVzLCBjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGZzID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBmcy5kZWZhdWx0KCkubG9hZEZpbGVzKGZpbGVOYW1lcyk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBbXCJqYXNzaWpzL2Jhc2UvQ2hyb21lRGVidWdnZXIudHNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBjb250ZW50IG9mIGEgZmlsZSBmcm9tIHNlcnZlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IG9mIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIHZhciBmcm9tU2VydmVyZGlyZWN0b3J5PWZpbGVOYW1lLnN0YXJ0c1dpdGgoXCIkc2VydmVyc2lkZS9cIik7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZpbGxGaWxlc0luTWFwSWZOZWVkZWQoKTtcclxuICAgICAgICAgICAgaWYgKCFmcm9tU2VydmVyZGlyZWN0b3J5ICYmIFNlcnZlci5maWxlc0luTWFwW2ZpbGVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgLy9wZXJoYWJzIHRoZSBmaWxlcyBhciBpbiBsb2NhbHNlcnZlcj9cclxuICAgICAgICAgICAgICAgIHZhciBGaWxlc3N5c3RlbSA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2xvY2Fsc2VydmVyLkZpbGVzc3lzdGVtXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEZpbGVzc3lzdGVtICYmIChhd2FpdCBuZXcgRmlsZXNzeXN0ZW0oKS5sb2FkRmlsZUVudHJ5KGZpbGVOYW1lKSAhPT0gdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdXNlIGFqYXhcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gU2VydmVyLmZpbGVzSW5NYXBbZmlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXBuYW1lID0gamFzc2lqcy5tb2R1bGVzW2ZvdW5kLm1vZHVsXS5zcGxpdChcIj9cIilbMF0gKyBcIi5tYXBcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoamFzc2lqcy5tb2R1bGVzW2ZvdW5kLm1vZHVsXS5pbmRleE9mKFwiLmpzP1wiKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBuYW1lID0gbWFwbmFtZSArIFwiP1wiICsgamFzc2lqcy5tb2R1bGVzW2ZvdW5kLm1vZHVsXS5zcGxpdChcIj9cIilbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBhd2FpdCB0aGlzLmxvYWRGaWxlKG1hcG5hbWUsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShjb2RlKS5zb3VyY2VzQ29udGVudFtmb3VuZC5pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmcm9tU2VydmVyZGlyZWN0b3J5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmxvYWRGaWxlLCBmaWxlTmFtZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7IHVybDogZmlsZU5hbWUsIGRhdGFUeXBlOiBcInRleHRcIiB9KTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gYXdhaXQgdGhpcy5jYWxsKHRoaXMsXCJsb2FkRmlsZVwiLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnJlcXVlc3QudXNlci5pc0FkbWluKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IoXCJvbmx5IGFkbWlucyBjYW4gbG9hZEZpbGUgZnJvbSBTZXJ2ZXJkaXJlY3RvcnlcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG5cclxuICAgICAgICAgICAgdmFyIGZzID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuICAgICAgICAgICAgdmFyIHJldHQ6IHN0cmluZyA9IG5ldyBmcy5kZWZhdWx0KCkubG9hZEZpbGUoZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIHB1dCB0aGUgY29udGVudCB0byBhIGZpbGVcclxuICAgICogQHBhcmFtIFt7c3RyaW5nfV0gZmlsZU5hbWVzIC0gdGhlIG5hbWUgb2YgdGhlIGZpbGVcclxuICAgICogQHBhcmFtIFt7c3RyaW5nfV0gY29udGVudHNcclxuICAgICovXHJcbiAgICBhc3luYyBzYXZlRmlsZXMoZmlsZU5hbWVzOiBzdHJpbmdbXSwgY29udGVudHM6IHN0cmluZ1tdLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxmaWxlTmFtZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICAgIHZhciBhbGxjb250ZW50czogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgdmFyIGFsbHRzZmlsZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGYgPSAwOyBmIDwgZmlsZU5hbWVzLmxlbmd0aDsgZisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGZpbGVOYW1lc1tmXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gY29udGVudHNbZl07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVOYW1lLnN0YXJ0c1dpdGgoXCIkc2VydmVyc2lkZS9cIikgJiYgKGZpbGVOYW1lLmVuZHNXaXRoKFwiLnRzXCIpIHx8IGZpbGVOYW1lLmVuZHNXaXRoKFwiLmpzXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0c3MgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHMgPSBhd2FpdCB0c3MuZGVmYXVsdC50cmFuc3BpbGUoZmlsZU5hbWUsIGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGZpbGVOYW1lcyA9IGFsbGZpbGVOYW1lcy5jb25jYXQocmV0cy5maWxlTmFtZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGNvbnRlbnRzID0gYWxsY29udGVudHMuY29uY2F0KHJldHMuY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbHRzZmlsZXMucHVzaChmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGZpbGVOYW1lcy5wdXNoKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGxjb250ZW50cy5wdXNoKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5zYXZlRmlsZXMsIGFsbGZpbGVOYW1lcywgYWxsY29udGVudHMsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcyA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBpbXBvcnQgKFwiamFzc2lqcy91aS9Ob3RpZnlcIikudGhlbigoZWwpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgZWwubm90aWZ5KGZpbGVOYW1lICsgXCIgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vaWYgKCFmcm9tU2VydmVyZGlyZWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGx0c2ZpbGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0ICQuYWpheCh7IHVybDogYWxsdHNmaWxlc1t4XSwgZGF0YVR5cGU6IFwidGV4dFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgaW1wb3J0IChcImphc3NpanMvdWkvTm90aWZ5XCIpLnRoZW4oKGVsKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICBlbC5ub3RpZnkoZmlsZU5hbWUgKyBcIiBub3Qgc2F2ZWRcIiwgXCJlcnJvclwiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IocmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIHNhdmVGaWxlc1wiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuc2F2ZUZpbGVzKGZpbGVOYW1lcywgY29udGVudHMsIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBwdXQgdGhlIGNvbnRlbnQgdG8gYSBmaWxlXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlTmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBmaWxlXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XHJcbiAgICAqL1xyXG4gICAgYXN5bmMgc2F2ZUZpbGUoZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAvKmF3YWl0IHRoaXMuZmlsbEZpbGVzSW5NYXBJZk5lZWRlZCgpO1xyXG4gICAgICAgIGlmIChTZXJ2ZXIuZmlsZXNJbk1hcFtmaWxlTmFtZV0pIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICBub3RpZnkoZmlsZU5hbWUgKyBcIiBjb3VsZCBub3QgYmUgc2F2ZWQgb24gc2VydmVyXCIsIFwiZXJyb3JcIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNhdmVGaWxlcyhbZmlsZU5hbWVdLCBbY29udGVudF0sIGNvbnRleHQpO1xyXG4gICAgICAgIC8qIGlmICghamFzc2lqcy5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IHRoaXMuY2FsbCh0aGlzLCBcInNhdmVGaWxlc1wiLCBmaWxlTmFtZXMsIGNvbnRlbnRzKTtcclxuICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgdmFyIGZzOiBhbnkgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3NlcnZlci9GaWxlc3lzdGVtXCIpO1xyXG4gICAgICAgICAgICAgcmV0dXJuIG5ldyBmcy5kZWZhdWx0KCkuc2F2ZUZpbGVzKGZpbGVOYW1lcywgY29udGVudHMpO1xyXG4gICAgICAgICB9Ki9cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAqIGRlbGV0ZXMgYSBzZXJ2ZXIgbW9kdWxcclxuICAgKiovXHJcbiAgICBhc3luYyB0ZXN0U2VydmVyc2lkZUZpbGUobmFtZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBpZighbmFtZS5zdGFydHNXaXRoKFwiJHNlcnZlcnNpZGUvXCIpKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihuYW1lK1wiIGkgbm90IGEgc2VydmVyc2lkZSBmaWxlXCIpO1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLnRlc3RTZXJ2ZXJzaWRlRmlsZSwgbmFtZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnJlcXVlc3QudXNlci5pc0FkbWluKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGRlbGV0ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIHRlc3Q9KGF3YWl0IGltcG9ydChuYW1lLnJlcGxhY2VBbGwoXCIkc2VydmVyc2lkZS9cIixcIlwiKSkpLnRlc3Q7XHJcbiAgICAgICAgICAgIGlmKHRlc3QpXHJcbiAgICAgICAgICAgICAgICBTZXJ2ZXIubGFzdFRlc3RTZXJ2ZXJzaWRlRmlsZVJlc3VsdD1hd2FpdCB0ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU2VydmVyLmxhc3RUZXN0U2VydmVyc2lkZUZpbGVSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICogZGVsZXRlcyBhIHNlcnZlciBtb2R1bFxyXG4gICAqKi9cclxuICAgIGFzeW5jIHJlbW92ZVNlcnZlck1vZHVsKG5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMucmVtb3ZlU2VydmVyTW9kdWwsIG5hbWUsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGRlbGV0ZVwiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuZXcgZnMuZGVmYXVsdCgpLnJlbW92ZVNlcnZlck1vZHVsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBkZWxldGVzIGEgZmlsZSBvciBkaXJlY3RvcnlcclxuICAgICoqL1xyXG4gICAgYXN5bmMgZGVsZXRlKG5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuZGVsZXRlLCBuYW1lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAkLm5vdGlmeShmaWxlTmFtZXNbMF0gKyBcIiBhbmQgbW9yZSBzYXZlZFwiLCBcImluZm9cIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51c2VyLmlzQWRtaW4pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIm9ubHkgYWRtaW5zIGNhbiBkZWxldGVcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5yZW1vdmUobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW5hbWVzIGEgZmlsZSBvciBkaXJlY3RvcnlcclxuICAgICAqKi9cclxuICAgIGFzeW5jIHJlbmFtZShvbGRuYW1lOiBzdHJpbmcsIG5ld25hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMucmVuYW1lLCBvbGRuYW1lLCBuZXduYW1lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAkLm5vdGlmeShmaWxlTmFtZXNbMF0gKyBcIiBhbmQgbW9yZSBzYXZlZFwiLCBcImluZm9cIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51c2VyLmlzQWRtaW4pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIm9ubHkgYWRtaW5zIGNhbiByZW5hbWVcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5yZW5hbWUob2xkbmFtZSwgbmV3bmFtZSk7O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBpcyB0aGUgbm9kZXMgc2VydmVyIHJ1bm5pbmcgXHJcbiAgICAqKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgaXNPbmxpbmUoY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgIC8vbm8gc2VydmljZXdvcmtlciBubyBzZXJ2ZXJzaWRlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICAgIGlmKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXI9PT1udWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNvbmxpbmUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBTZXJ2ZXIuaXNvbmxpbmUgPSBhd2FpdCB0aGlzLmNhbGwodGhpcy5pc09ubGluZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgU2VydmVyLmlzb25saW5lO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlcyBhIGZpbGUgXHJcbiAgICAgKiovXHJcbiAgICBhc3luYyBjcmVhdGVGaWxlKGZpbGVuYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlRmlsZSwgZmlsZW5hbWUsIGNvbnRlbnQsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGNyZWF0ZUZpbGVcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5jcmVhdGVGaWxlKGZpbGVuYW1lLCBjb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogY3JlYXRlcyBhIGZpbGUgXHJcbiAgICAqKi9cclxuICAgIGFzeW5jIGNyZWF0ZUZvbGRlcihmb2xkZXJuYW1lOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmNyZWF0ZUZvbGRlciwgZm9sZGVybmFtZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnJlcXVlc3QudXNlci5pc0FkbWluKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IoXCJvbmx5IGFkbWlucyBjYW4gY3JlYXRlRm9sZGVyXCIpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGZzOiBhbnkgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3NlcnZlci9GaWxlc3lzdGVtXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuY3JlYXRlRm9sZGVyKGZvbGRlcm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIGNyZWF0ZU1vZHVsZShtb2R1bG5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlTW9kdWxlLCBtb2R1bG5hbWUsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGNyZWF0ZUZvbGRlclwiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuZXcgZnMuZGVmYXVsdCgpLmNyZWF0ZU1vZHVsZShtb2R1bG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBteXRlc3QoY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLm15dGVzdCwgY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAxNDsvL3RoaXMgaXMgY2FsbGVkIG9uIHNlcnZlclxyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=