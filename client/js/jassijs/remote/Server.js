var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/RemoteObject", "jassijs/remote/FileNode", "./Classes"], function (require, exports, Jassi_1, RemoteObject_1, FileNode_1, Classes_1) {
    "use strict";
    var Server_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Server = void 0;
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
                var fs = await new Promise((resolve_6, reject_6) => { require(["jassijs/server/Filesystem"], resolve_6, reject_6); });
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
                var fs = await new Promise((resolve_7, reject_7) => { require(["jassijs/server/Filesystem"], resolve_7, reject_7); });
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
                var fs = await new Promise((resolve_8, reject_8) => { require(["jassijs/server/Filesystem"], resolve_8, reject_8); });
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
                var fs = await new Promise((resolve_9, reject_9) => { require(["jassijs/server/Filesystem"], resolve_9, reject_9); });
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
                var fs = await new Promise((resolve_10, reject_10) => { require(["jassijs/server/Filesystem"], resolve_10, reject_10); });
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
                var fs = await new Promise((resolve_11, reject_11) => { require(["jassijs/server/Filesystem"], resolve_11, reject_11); });
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
                var fs = await new Promise((resolve_12, reject_12) => { require(["jassijs/server/Filesystem"], resolve_12, reject_12); });
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy9yZW1vdGUvU2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBU0EsSUFBYSxNQUFNLGNBQW5CLE1BQWEsTUFBTyxTQUFRLDJCQUFZO1FBSXBDO1lBQ0ksS0FBSyxFQUFFLENBQUM7UUFFWixDQUFDO1FBQ08sZ0JBQWdCLENBQUMsSUFBYztZQUNuQyxJQUFJLEdBQUcsR0FBYSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztvQkFDdkQsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDdEUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN0RDthQUNKO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ0QsS0FBSyxDQUFDLHNCQUFzQjtZQUN4QixJQUFJLFFBQU0sQ0FBQyxVQUFVO2dCQUNqQixPQUFPO1lBQ1gsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsS0FBSyxJQUFJLEdBQUcsSUFBSSxlQUFPLENBQUMsT0FBTyxFQUFFO2dCQUM3QixJQUFJLGVBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLGVBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUNuRixJQUFJLE9BQU8sR0FBRyxlQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQzFELElBQUksZUFBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxPQUFPLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxlQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtvQkFDM0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ25DLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDNUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHOzRCQUNULEVBQUUsRUFBRSxDQUFDOzRCQUNMLEtBQUssRUFBRSxHQUFHO3lCQUNiLENBQUM7cUJBQ0w7aUJBQ0o7YUFDSjtZQUNELFFBQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBRTVCLENBQUM7UUFDRCxLQUFLLENBQUMsZUFBZSxDQUFDLElBQWM7WUFDaEMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNwQyxLQUFLLElBQUksS0FBSyxJQUFJLFFBQU0sQ0FBQyxVQUFVLEVBQUU7Z0JBQ2pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNyQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQzt3QkFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUMxQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU87Z0NBQ2hDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMvQjt3QkFDRCxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUNSLEtBQUssR0FBRztnQ0FDSixJQUFJLEVBQUUsU0FBUztnQ0FDZixJQUFJLEVBQUUsT0FBTztnQ0FDYixLQUFLLEVBQUUsRUFBRTs2QkFDWixDQUFBOzRCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUM1Qjt3QkFDRCxNQUFNLEdBQUcsS0FBSyxDQUFDO3FCQUVsQjt5QkFBTTt3QkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs0QkFDZCxJQUFJLEVBQUUsU0FBUzs0QkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDYixJQUFJLEVBQUUsU0FBUzt5QkFDbEIsQ0FBQyxDQUFDO3FCQUNOO2lCQUNKO2FBQ0o7UUFDTCxDQUFDO1FBR0Q7Ozs7VUFJRTtRQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBb0IsS0FBSyxFQUFFLFVBQW1CLFNBQVM7WUFDN0QsSUFBSSxFQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLENBQUEsRUFBRTtnQkFDcEIsSUFBSSxHQUFhLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxNQUFNLFFBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxJQUFJO29CQUN6QyxHQUFHLEdBQWEsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7b0JBRW5FLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUEsTUFBTTtnQkFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLENBQUMsQ0FBQzthQUNaO2lCQUFNO2dCQUNILFlBQVk7Z0JBQ1osSUFBSSxFQUFFLEdBQUcsc0RBQWEsMkJBQTJCLDJCQUFDLENBQUM7Z0JBQ25ELElBQUksSUFBSSxHQUFhLE1BQU0sSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsT0FBTyxJQUFJLENBQUM7Z0JBQ1osNkNBQTZDO2FBQ2hEO1FBQ0wsQ0FBQztRQUNNLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBcUIsRUFBRSxZQUFxQixTQUFTLEVBQUUsVUFBbUIsU0FBUztZQUNoRyxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFpQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN2RztpQkFBTTtnQkFDSCxZQUFZO2dCQUNaLElBQUksRUFBRSxHQUFHLHNEQUFhLDJCQUEyQiwyQkFBQyxDQUFDO2dCQUNuRCxPQUFPLE1BQU0sSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUQsNkNBQTZDO2FBQ2hEO1FBQ0wsQ0FBQztRQUNEOzs7O1dBSUc7UUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQW1CLEVBQUUsVUFBbUIsU0FBUztZQUM3RCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFpQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzlGO2lCQUFNO2dCQUNILFlBQVk7Z0JBQ1osSUFBSSxFQUFFLEdBQUcsc0RBQWEsMkJBQTJCLDJCQUFDLENBQUM7Z0JBQ25ELE9BQU8sSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM3Qyw2Q0FBNkM7YUFDaEQ7UUFDTCxDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0IsRUFBRSxzQkFBK0IsU0FBUyxFQUFFLFVBQW1CLFNBQVM7WUFDbkcsSUFBSSxFQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLENBQUEsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLFFBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3JELHNDQUFzQztvQkFDdEMsSUFBSSxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDdEUsSUFBSSxXQUFXLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxFQUFFO3dCQUNoRixVQUFVO3FCQUNiO3lCQUFNO3dCQUNILElBQUksS0FBSyxHQUFHLFFBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3hDLElBQUksT0FBTyxHQUFHLGVBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7d0JBQ2xFLElBQUksZUFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDakQsT0FBTyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsZUFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6RSxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUN0RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3JELE9BQU8sSUFBSSxDQUFDO3FCQUNmO2lCQUVKO2dCQUNELElBQUksbUJBQW1CLEVBQUU7b0JBRXJCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDdkY7O29CQUNHLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3ZELG9EQUFvRDthQUN2RDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDN0IsTUFBTSxJQUFJLG9CQUFVLENBQUMsK0NBQStDLENBQUMsQ0FBQztnQkFDMUUsWUFBWTtnQkFFWixJQUFJLEVBQUUsR0FBRyxzREFBYSwyQkFBMkIsMkJBQUMsQ0FBQztnQkFDbkQsSUFBSSxJQUFJLEdBQVcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLElBQUksQ0FBQzthQUNmO1FBQ0wsQ0FBQztRQUVEOzs7O1VBSUU7UUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLFNBQW1CLEVBQUUsUUFBa0IsRUFBRSxzQkFBK0IsU0FBUyxFQUFFLFVBQW1CLFNBQVM7WUFFM0gsSUFBSSxFQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLENBQUEsRUFBRTtnQkFDcEIsSUFBSSxZQUFZLEdBQWEsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7Z0JBQy9CLElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztnQkFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztvQkFFakIsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQzlFLFlBQVk7d0JBQ1osSUFBSSxHQUFHLEdBQUcsc0RBQWEsZ0NBQWdDLDJCQUFDLENBQUM7d0JBQ3pELElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUMxRCxZQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ25ELFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDaEQsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDN0I7eUJBQU07d0JBQ0gsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDNUIsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0o7Z0JBQ0QsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBRXpHLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtvQkFDWixZQUFZO29CQUNaLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO3dCQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDeEMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzt5QkFDMUQ7cUJBQ0o7aUJBQ0o7cUJBQU07b0JBQ0gsWUFBWTtvQkFDWixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxZQUFZLEVBQUUsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7b0JBQ3pFLE1BQU0sSUFBSSxvQkFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QjtnQkFDRCxPQUFPLEdBQUcsQ0FBQzthQUNkO2lCQUFNO2dCQUNILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUM3QixNQUFNLElBQUksb0JBQVUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUN0RCxZQUFZO2dCQUNaLElBQUksRUFBRSxHQUFRLHNEQUFhLDJCQUEyQiwyQkFBQyxDQUFDO2dCQUN4RCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxRixPQUFPLEdBQUcsQ0FBQzthQUNkO1FBQ0wsQ0FBQztRQUNEOzs7O1VBSUU7UUFDRixLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWdCLEVBQUUsT0FBZSxFQUFDLHNCQUErQixTQUFTLEVBQUUsVUFBbUIsU0FBUztZQUNuSDs7Ozs7ZUFLRztZQUNILE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxtQkFBbUIsRUFBQyxPQUFPLENBQUMsQ0FBQztZQUNoRjs7Ozs7Ozs7O2dCQVNJO1FBQ1IsQ0FBQztRQUNEOztVQUVFO1FBQ0YsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQVksRUFBRSxVQUFtQixTQUFTO1lBQzlELElBQUksRUFBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFBLEVBQUU7Z0JBQ3BCLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdkUsWUFBWTtnQkFDWixxRkFBcUY7Z0JBQ3JGLE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQzdCLE1BQU0sSUFBSSxvQkFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ25ELFlBQVk7Z0JBQ1osSUFBSSxFQUFFLEdBQVEsc0RBQWEsMkJBQTJCLDJCQUFDLENBQUM7Z0JBRXhELE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6RDtRQUNMLENBQUM7UUFDRDs7V0FFRztRQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBWSxFQUFFLFVBQW1CLFNBQVM7WUFDbkQsSUFBSSxFQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRLENBQUEsRUFBRTtnQkFDcEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDNUQsWUFBWTtnQkFDWixxRkFBcUY7Z0JBQ3JGLE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQzdCLE1BQU0sSUFBSSxvQkFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ25ELFlBQVk7Z0JBQ1osSUFBSSxFQUFFLEdBQVEsc0RBQWEsMkJBQTJCLDJCQUFDLENBQUM7Z0JBRXhELE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUM7UUFDTCxDQUFDO1FBQ0Q7O1lBRUk7UUFDSixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQWUsRUFBRSxPQUFlLEVBQUUsVUFBbUIsU0FBUztZQUN2RSxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEUsWUFBWTtnQkFDWixxRkFBcUY7Z0JBQ3JGLE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQzdCLE1BQU0sSUFBSSxvQkFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ25ELFlBQVk7Z0JBQ1osSUFBSSxFQUFFLEdBQVEsc0RBQWEsMkJBQTJCLDJCQUFDLENBQUM7Z0JBRXhELE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUFBLENBQUM7YUFDM0Q7UUFDTCxDQUFDO1FBQ0Q7O1dBRUc7UUFDSyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFtQixTQUFTO1lBQ3RELElBQUksRUFBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFBLEVBQUU7Z0JBQ3BCLElBQUk7b0JBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7d0JBQzNCLFFBQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzlELE9BQU8sTUFBTSxRQUFNLENBQUMsUUFBUSxDQUFDO2lCQUNoQztnQkFBQyxXQUFNO29CQUNKLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtnQkFDRCxZQUFZO2dCQUNaLHFGQUFxRjthQUN4RjtpQkFBTTtnQkFDSCxPQUFPLElBQUksQ0FBQzthQUNmO1FBQ0wsQ0FBQztRQUNEOztZQUVJO1FBQ0osS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFnQixFQUFFLE9BQWUsRUFBRSxVQUFtQixTQUFTO1lBQzVFLElBQUksRUFBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFBLEVBQUU7Z0JBQ3BCLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM3RSxZQUFZO2dCQUNaLHFGQUFxRjtnQkFDckYsT0FBTyxHQUFHLENBQUM7YUFDZDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDN0IsTUFBTSxJQUFJLG9CQUFVLENBQUMsNEJBQTRCLENBQUMsQ0FBQztnQkFDdkQsWUFBWTtnQkFDWixJQUFJLEVBQUUsR0FBUSx3REFBYSwyQkFBMkIsNkJBQUMsQ0FBQztnQkFFeEQsT0FBTyxNQUFNLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDL0Q7UUFDTCxDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQWtCLEVBQUUsVUFBbUIsU0FBUztZQUMvRCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RSxZQUFZO2dCQUNaLHFGQUFxRjtnQkFDckYsT0FBTyxHQUFHLENBQUM7YUFDZDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDN0IsTUFBTSxJQUFJLG9CQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDekQsWUFBWTtnQkFDWixJQUFJLEVBQUUsR0FBUSx3REFBYSwyQkFBMkIsNkJBQUMsQ0FBQztnQkFFeEQsT0FBTyxNQUFNLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMxRDtRQUNMLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsVUFBbUIsU0FBUztZQUM5RCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RSxZQUFZO2dCQUNaLHFGQUFxRjtnQkFDckYsT0FBTyxHQUFHLENBQUM7YUFDZDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDN0IsTUFBTSxJQUFJLG9CQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDekQsWUFBWTtnQkFDWixJQUFJLEVBQUUsR0FBUSx3REFBYSwyQkFBMkIsNkJBQUMsQ0FBQztnQkFFeEQsT0FBTyxNQUFNLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN6RDtRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFtQixTQUFTO1lBQzVDLElBQUksRUFBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFBLEVBQUU7Z0JBQ3BCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDaEQ7O2dCQUNHLE9BQU8sRUFBRSxDQUFDLENBQUEsMEJBQTBCO1FBQzVDLENBQUM7S0FDSixDQUFBO0lBdlhrQixlQUFRLEdBQXFCLFNBQVMsQ0FBQztJQUN0RCxzREFBc0Q7SUFDeEMsaUJBQVUsR0FBc0QsU0FBUyxDQUFDO0lBSC9FLE1BQU07UUFEbEIsY0FBTSxDQUFDLHVCQUF1QixDQUFDOztPQUNuQixNQUFNLENBd1hsQjtJQXhYWSx3QkFBTTtJQTJYWixLQUFLLFVBQVUsSUFBSTtJQUUxQixDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IENvbnRleHQsIFJlbW90ZU9iamVjdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZW1vdGVPYmplY3RcIjtcclxuaW1wb3J0IHsgRmlsZU5vZGUgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvRmlsZU5vZGVcIjtcclxuaW1wb3J0IHsgY2xhc3NlcywgSmFzc2lFcnJvciB9IGZyb20gXCIuL0NsYXNzZXNcIjtcclxuXHJcblxyXG5cclxuQCRDbGFzcyhcImphc3NpanMucmVtb3RlLlNlcnZlclwiKVxyXG5leHBvcnQgY2xhc3MgU2VydmVyIGV4dGVuZHMgUmVtb3RlT2JqZWN0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGlzb25saW5lOiBQcm9taXNlPGJvb2xlYW4+ID0gdW5kZWZpbmVkO1xyXG4gICAgLy9maWxlcyBmb3VuZCBpbiBqcy5tYXAgb2YgbW9kdWxlcyBpbiB0aGUgamFzc2lqcy5qc29uXHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbGVzSW5NYXA6IHsgW25hbWU6IHN0cmluZ106IHsgbW9kdWw6IHN0cmluZywgaWQ6IG51bWJlciB9IH0gPSB1bmRlZmluZWQ7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgX2NvbnZlcnRGaWxlTm9kZShub2RlOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgICAgICB2YXIgcmV0OiBGaWxlTm9kZSA9IG5ldyBGaWxlTm9kZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCBub2RlKTtcclxuICAgICAgICBpZiAocmV0LmZpbGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCByZXQuZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XS5wYXJlbnQgPSByZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgcyA9IHJldC5mdWxscGF0aCA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHJldC5mdWxscGF0aDtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XS5mdWxscGF0aCA9IHMgKyAocyA9PT0gXCJcIiA/IFwiXCIgOiBcIi9cIikgKyByZXQuZmlsZXNbeF0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHJldC5maWxlc1t4XSA9IHRoaXMuX2NvbnZlcnRGaWxlTm9kZShyZXQuZmlsZXNbeF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBhc3luYyBmaWxsRmlsZXNJbk1hcElmTmVlZGVkKCkge1xyXG4gICAgICAgIGlmIChTZXJ2ZXIuZmlsZXNJbk1hcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBtb2QgaW4gamFzc2lqcy5tb2R1bGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChqYXNzaWpzLm1vZHVsZXNbbW9kXS5lbmRzV2l0aChcIi5qc1wiKSB8fCBqYXNzaWpzLm1vZHVsZXNbbW9kXS5pbmRleE9mKFwiLmpzP1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWFwbmFtZSA9IGphc3NpanMubW9kdWxlc1ttb2RdLnNwbGl0KFwiP1wiKVswXSArIFwiLm1hcFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGphc3NpanMubW9kdWxlc1ttb2RdLmluZGV4T2YoXCIuanM/XCIpID4gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwbmFtZSA9IG1hcG5hbWUgKyBcIj9cIiArIGphc3NpanMubW9kdWxlc1ttb2RdLnNwbGl0KFwiP1wiKVsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gYXdhaXQgJC5hamF4KHsgdXJsOiBtYXBuYW1lLCBkYXRhVHlwZTogXCJ0ZXh0XCIgfSlcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShjb2RlKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxlcyA9IGRhdGEuc291cmNlcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5hbWUgPSBmaWxlc1t4XS5zdWJzdHJpbmcoZmlsZXNbeF0uaW5kZXhPZihtb2QgKyBcIi9cIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldFtmbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bDogbW9kXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBTZXJ2ZXIuZmlsZXNJbk1hcCA9IHJldDtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBhZGRGaWxlc0Zyb21NYXAocm9vdDogRmlsZU5vZGUpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmZpbGxGaWxlc0luTWFwSWZOZWVkZWQoKTtcclxuICAgICAgICBmb3IgKHZhciBmbmFtZSBpbiBTZXJ2ZXIuZmlsZXNJbk1hcCkge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZuYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGF0aC5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgKyAxIDwgcGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlybmFtZSA9IHBhdGhbcF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgcGFyZW50LmZpbGVzLmxlbmd0aDsgZisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuZmlsZXNbZl0ubmFtZSA9PT0gZGlybmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gcGFyZW50LmZpbGVzW2ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZzogXCJmcm9tTWFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkaXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LmZpbGVzLnB1c2goZm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBmb3VuZDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5maWxlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZzogXCJmcm9tTWFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBhdGhbcF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICogZ2V0cyBhbGxzIHRzL2pzLWZpbGVzIGZyb20gc2VydmVyXHJcbiAgICAqIEBwYXJhbSB7UHJvbWlzZTxzdHJpbmc+fSBbYXN5bmNdIC0gcmV0dXJucyBhIFByb21pc2UgZm9yIGFzeW5jaHJvcyBoYW5kbGluZ1xyXG4gICAgKiBAcmV0dXJucyB7c3RyaW5nW119IC0gbGlzdCBvZiBmaWxlc1xyXG4gICAgKi9cclxuICAgIGFzeW5jIGRpcih3aXRoRGF0ZTogYm9vbGVhbiA9IGZhbHNlLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxGaWxlTm9kZT4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJldDogRmlsZU5vZGU7XHJcbiAgICAgICAgICAgIGlmICgoYXdhaXQgU2VydmVyLmlzT25saW5lKGNvbnRleHQpKSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIHJldCA9IDxGaWxlTm9kZT5hd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5kaXIsIHdpdGhEYXRlLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0ID0geyBuYW1lOiBcIlwiLCBmaWxlczogW10gfTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hZGRGaWxlc0Zyb21NYXAocmV0KTtcclxuICAgICAgICAgICAgcmV0LmZ1bGxwYXRoID0gXCJcIjsvL3Jvb3RcclxuICAgICAgICAgICAgbGV0IHIgPSB0aGlzLl9jb252ZXJ0RmlsZU5vZGUocmV0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmcyA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcbiAgICAgICAgICAgIHZhciByZXR0OiBGaWxlTm9kZSA9IGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuZGlyKFwiXCIsIHdpdGhEYXRlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldHQ7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBbXCJqYXNzaWpzL2Jhc2UvQ2hyb21lRGVidWdnZXIudHNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFzeW5jIHppcChkaXJlY3RvcnluYW1lOiBzdHJpbmcsIHNlcnZlcmRpcjogYm9vbGVhbiA9IHVuZGVmaW5lZCwgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDx7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0+YXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuemlwLCBkaXJlY3RvcnluYW1lLCBzZXJ2ZXJkaXIsIGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnMgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3NlcnZlci9GaWxlc3lzdGVtXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS56aXAoZGlyZWN0b3J5bmFtZSwgc2VydmVyZGlyKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIFtcImphc3NpanMvYmFzZS9DaHJvbWVEZWJ1Z2dlci50c1wiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIGZyb20gc2VydmVyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWV3XHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IG9mIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRGaWxlcyhmaWxlTmFtZXM6IHN0cmluZ1tdLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8eyBbaWQ6IHN0cmluZ106IHN0cmluZyB9PmF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmxvYWRGaWxlcywgZmlsZU5hbWVzLCBjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGZzID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBmcy5kZWZhdWx0KCkubG9hZEZpbGVzKGZpbGVOYW1lcyk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBbXCJqYXNzaWpzL2Jhc2UvQ2hyb21lRGVidWdnZXIudHNcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBjb250ZW50IG9mIGEgZmlsZSBmcm9tIHNlcnZlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50IG9mIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGZyb21TZXJ2ZXJkaXJlY3Rvcnk6IGJvb2xlYW4gPSB1bmRlZmluZWQsIGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5maWxsRmlsZXNJbk1hcElmTmVlZGVkKCk7XHJcbiAgICAgICAgICAgIGlmICghZnJvbVNlcnZlcmRpcmVjdG9yeSAmJiBTZXJ2ZXIuZmlsZXNJbk1hcFtmaWxlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIC8vcGVyaGFicyB0aGUgZmlsZXMgYXIgaW4gbG9jYWxzZXJ2ZXI/XHJcbiAgICAgICAgICAgICAgICB2YXIgRmlsZXNzeXN0ZW0gPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19sb2NhbHNlcnZlci5GaWxlc3N5c3RlbVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChGaWxlc3N5c3RlbSAmJiAoYXdhaXQgbmV3IEZpbGVzc3lzdGVtKCkubG9hZEZpbGVFbnRyeShmaWxlTmFtZSkgIT09IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3VzZSBhamF4XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IFNlcnZlci5maWxlc0luTWFwW2ZpbGVOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWFwbmFtZSA9IGphc3NpanMubW9kdWxlc1tmb3VuZC5tb2R1bF0uc3BsaXQoXCI/XCIpWzBdICsgXCIubWFwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGphc3NpanMubW9kdWxlc1tmb3VuZC5tb2R1bF0uaW5kZXhPZihcIi5qcz9cIikgPiAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwbmFtZSA9IG1hcG5hbWUgKyBcIj9cIiArIGphc3NpanMubW9kdWxlc1tmb3VuZC5tb2R1bF0uc3BsaXQoXCI/XCIpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlID0gYXdhaXQgdGhpcy5sb2FkRmlsZShtYXBuYW1lLCBmcm9tU2VydmVyZGlyZWN0b3J5LCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoY29kZSkuc291cmNlc0NvbnRlbnRbZm91bmQuaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZnJvbVNlcnZlcmRpcmVjdG9yeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5sb2FkRmlsZSwgZmlsZU5hbWUsIGZyb21TZXJ2ZXJkaXJlY3RvcnksIGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoeyB1cmw6IGZpbGVOYW1lLCBkYXRhVHlwZTogXCJ0ZXh0XCIgfSk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLFwibG9hZEZpbGVcIiwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGxvYWRGaWxlIGZyb20gU2VydmVyZGlyZWN0b3J5XCIpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuXHJcbiAgICAgICAgICAgIHZhciBmcyA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcbiAgICAgICAgICAgIHZhciByZXR0OiBzdHJpbmcgPSBuZXcgZnMuZGVmYXVsdCgpLmxvYWRGaWxlKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBwdXQgdGhlIGNvbnRlbnQgdG8gYSBmaWxlXHJcbiAgICAqIEBwYXJhbSBbe3N0cmluZ31dIGZpbGVOYW1lcyAtIHRoZSBuYW1lIG9mIHRoZSBmaWxlXHJcbiAgICAqIEBwYXJhbSBbe3N0cmluZ31dIGNvbnRlbnRzXHJcbiAgICAqL1xyXG4gICAgYXN5bmMgc2F2ZUZpbGVzKGZpbGVOYW1lczogc3RyaW5nW10sIGNvbnRlbnRzOiBzdHJpbmdbXSwgZnJvbVNlcnZlcmRpcmVjdG9yeTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIGFsbGZpbGVOYW1lczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgdmFyIGFsbGNvbnRlbnRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgYWxsdHNmaWxlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgZiA9IDA7IGYgPCBmaWxlTmFtZXMubGVuZ3RoOyBmKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZmlsZU5hbWVzW2ZdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjb250ZW50c1tmXTtcclxuICAgICAgICAgICAgICAgIGlmICghZnJvbVNlcnZlcmRpcmVjdG9yeSAmJiBmaWxlTmFtZS5lbmRzV2l0aChcIi50c1wiKSB8fCBmaWxlTmFtZS5lbmRzV2l0aChcIi5qc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0c3MgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHMgPSBhd2FpdCB0c3MuZGVmYXVsdC50cmFuc3BpbGUoZmlsZU5hbWUsIGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGZpbGVOYW1lcyA9IGFsbGZpbGVOYW1lcy5jb25jYXQocmV0cy5maWxlTmFtZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGNvbnRlbnRzID0gYWxsY29udGVudHMuY29uY2F0KHJldHMuY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbHRzZmlsZXMucHVzaChmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbGZpbGVOYW1lcy5wdXNoKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGxjb250ZW50cy5wdXNoKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5zYXZlRmlsZXMsIGFsbGZpbGVOYW1lcywgYWxsY29udGVudHMsIGZyb21TZXJ2ZXJkaXJlY3RvcnksIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcyA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAkLm5vdGlmeShmaWxlTmFtZSArIFwiIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmcm9tU2VydmVyZGlyZWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGx0c2ZpbGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0ICQuYWpheCh7IHVybDogYWxsdHNmaWxlc1t4XSwgZGF0YVR5cGU6IFwidGV4dFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgJC5ub3RpZnkoZmlsZU5hbWUgKyBcIiBub3Qgc2F2ZWRcIiwgXCJlcnJvclwiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IocmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIHNhdmVGaWxlc1wiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuc2F2ZUZpbGVzKGZpbGVOYW1lcywgY29udGVudHMsZnJvbVNlcnZlcmRpcmVjdG9yeSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHB1dCB0aGUgY29udGVudCB0byBhIGZpbGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGZpbGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcclxuICAgICovXHJcbiAgICBhc3luYyBzYXZlRmlsZShmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsZnJvbVNlcnZlcmRpcmVjdG9yeTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgLyphd2FpdCB0aGlzLmZpbGxGaWxlc0luTWFwSWZOZWVkZWQoKTtcclxuICAgICAgICBpZiAoU2VydmVyLmZpbGVzSW5NYXBbZmlsZU5hbWVdKSB7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgJC5ub3RpZnkoZmlsZU5hbWUgKyBcIiBjb3VsZCBub3QgYmUgc2F2ZWQgb24gc2VydmVyXCIsIFwiZXJyb3JcIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNhdmVGaWxlcyhbZmlsZU5hbWVdLCBbY29udGVudF0sIGZyb21TZXJ2ZXJkaXJlY3RvcnksY29udGV4dCk7XHJcbiAgICAgICAgLyogaWYgKCFqYXNzaWpzLmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIFwic2F2ZUZpbGVzXCIsIGZpbGVOYW1lcywgY29udGVudHMpO1xyXG4gICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcbiAgICAgICAgICAgICByZXR1cm4gbmV3IGZzLmRlZmF1bHQoKS5zYXZlRmlsZXMoZmlsZU5hbWVzLCBjb250ZW50cyk7XHJcbiAgICAgICAgIH0qL1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICogZGVsZXRlcyBhIHNlcnZlciBtb2R1bFxyXG4gICAqKi9cclxuICAgIGFzeW5jIHJlbW92ZVNlcnZlck1vZHVsKG5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMucmVtb3ZlU2VydmVyTW9kdWwsIG5hbWUsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgLy8gICQubm90aWZ5KGZpbGVOYW1lc1swXSArIFwiIGFuZCBtb3JlIHNhdmVkXCIsIFwiaW5mb1wiLCB7IHBvc2l0aW9uOiBcImJvdHRvbSByaWdodFwiIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0LnVzZXIuaXNBZG1pbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwib25seSBhZG1pbnMgY2FuIGRlbGV0ZVwiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuZXcgZnMuZGVmYXVsdCgpLnJlbW92ZVNlcnZlck1vZHVsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBkZWxldGVzIGEgZmlsZSBvciBkaXJlY3RvcnlcclxuICAgICoqL1xyXG4gICAgYXN5bmMgZGVsZXRlKG5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuZGVsZXRlLCBuYW1lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAkLm5vdGlmeShmaWxlTmFtZXNbMF0gKyBcIiBhbmQgbW9yZSBzYXZlZFwiLCBcImluZm9cIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51c2VyLmlzQWRtaW4pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIm9ubHkgYWRtaW5zIGNhbiBkZWxldGVcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5yZW1vdmUobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW5hbWVzIGEgZmlsZSBvciBkaXJlY3RvcnlcclxuICAgICAqKi9cclxuICAgIGFzeW5jIHJlbmFtZShvbGRuYW1lOiBzdHJpbmcsIG5ld25hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMucmVuYW1lLCBvbGRuYW1lLCBuZXduYW1lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAkLm5vdGlmeShmaWxlTmFtZXNbMF0gKyBcIiBhbmQgbW9yZSBzYXZlZFwiLCBcImluZm9cIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51c2VyLmlzQWRtaW4pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIm9ubHkgYWRtaW5zIGNhbiByZW5hbWVcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5yZW5hbWUob2xkbmFtZSwgbmV3bmFtZSk7O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBpcyB0aGUgbm9kZXMgc2VydmVyIHJ1bm5pbmcgXHJcbiAgICAqKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGlzT25saW5lKGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc29ubGluZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIFNlcnZlci5pc29ubGluZSA9IGF3YWl0IHRoaXMuY2FsbCh0aGlzLmlzT25saW5lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBTZXJ2ZXIuaXNvbmxpbmU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGVzIGEgZmlsZSBcclxuICAgICAqKi9cclxuICAgIGFzeW5jIGNyZWF0ZUZpbGUoZmlsZW5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5jcmVhdGVGaWxlLCBmaWxlbmFtZSwgY29udGVudCwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnJlcXVlc3QudXNlci5pc0FkbWluKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IoXCJvbmx5IGFkbWlucyBjYW4gY3JlYXRlRmlsZVwiKTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBmczogYW55ID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvRmlsZXN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBuZXcgZnMuZGVmYXVsdCgpLmNyZWF0ZUZpbGUoZmlsZW5hbWUsIGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBjcmVhdGVzIGEgZmlsZSBcclxuICAgICoqL1xyXG4gICAgYXN5bmMgY3JlYXRlRm9sZGVyKGZvbGRlcm5hbWU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuY3JlYXRlRm9sZGVyLCBmb2xkZXJuYW1lLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIC8vICAkLm5vdGlmeShmaWxlTmFtZXNbMF0gKyBcIiBhbmQgbW9yZSBzYXZlZFwiLCBcImluZm9cIiwgeyBwb3NpdGlvbjogXCJib3R0b20gcmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51c2VyLmlzQWRtaW4pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIm9ubHkgYWRtaW5zIGNhbiBjcmVhdGVGb2xkZXJcIik7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnM6IGFueSA9IGF3YWl0IGltcG9ydChcImphc3NpanMvc2VydmVyL0ZpbGVzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IGZzLmRlZmF1bHQoKS5jcmVhdGVGb2xkZXIoZm9sZGVybmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgY3JlYXRlTW9kdWxlKG1vZHVsbmFtZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy5jcmVhdGVNb2R1bGUsIG1vZHVsbmFtZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAvLyAgJC5ub3RpZnkoZmlsZU5hbWVzWzBdICsgXCIgYW5kIG1vcmUgc2F2ZWRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwiYm90dG9tIHJpZ2h0XCIgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZXh0LnJlcXVlc3QudXNlci5pc0FkbWluKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IoXCJvbmx5IGFkbWlucyBjYW4gY3JlYXRlRm9sZGVyXCIpO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGZzOiBhbnkgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3NlcnZlci9GaWxlc3lzdGVtXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBmcy5kZWZhdWx0KCkuY3JlYXRlTW9kdWxlKG1vZHVsbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIG15dGVzdChjb250ZXh0OiBDb250ZXh0ID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsKHRoaXMubXl0ZXN0LCBjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIDE0Oy8vdGhpcyBpcyBjYWxsZWQgb24gc2VydmVyXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHJcbn0iXX0=