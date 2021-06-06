var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/util/Reloader", "jassijs/server/DBManager", "jassijs/remote/Registry", "jassijs/remote/Server"], function (require, exports, jassijs_1, Reloader_1, DBManager_1, Registry_1, Server_1) {
    "use strict";
    var Filessystem_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class FileEntry {
    }
    let Filessystem = Filessystem_1 = class Filessystem {
        static async getDB() {
            if (Filessystem_1.db)
                return Filessystem_1.db;
            var req = window.indexedDB.open("jassi", 1);
            req.onupgradeneeded = function (event) {
                var db = event.target["result"];
                var objectStore = db.createObjectStore("files", { keyPath: "id" });
            };
            Filessystem_1.db = await new Promise((resolve) => {
                req.onsuccess = (ev) => { resolve(ev.target["result"]); };
            });
            return Filessystem_1.db;
        }
        /**
         * exists a directory?
         * @param path
         */
        async existsDirectory(path) {
            var test = await this.dirEntry(path);
            return test.length > 0;
        }
        async dirFiles(dir, extensions, ignore = []) {
            var ret = [];
            var all = await this.dirEntry(dir);
            for (let x = 0; x < all.length; x++) {
                let fname = all[x].id;
                var include = true;
                if (extensions) {
                    include = false;
                    extensions.forEach((ent) => {
                        if (fname.endsWith(ent))
                            include = true;
                    });
                }
                if (ignore) {
                    ignore.forEach((ent) => {
                        if (fname === ent)
                            include = false;
                    });
                }
                if (include && !all[x].isDirectory)
                    ret.push(fname);
            }
            return ret;
        }
        async dirEntry(curdir = "") {
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readonly');
            const store = transaction.objectStore('files');
            var ret = await store.openCursor();
            var all = [];
            await new Promise((resolve) => {
                ret.onsuccess = ev => {
                    var el = ev.target["result"];
                    if (el) {
                        if (curdir === "" || el.value.id === curdir || el.value.id.startsWith(curdir + "/"))
                            all.push(el.value);
                        el.continue();
                    }
                    else
                        resolve(undefined);
                };
                ret.onerror = ev => {
                    resolve(undefined);
                };
            });
            return all;
        }
        /**
         * @returns  [{name:"hallo",date:1566554},{name:"demo",files:[]}]
         */
        async dir(curdir = "", appendDate = false) {
            var root = { name: "", files: [] };
            var all = await this.dirEntry(curdir);
            var keys = {
                "": root
            };
            for (let x = 0; x < all.length; x++) {
                var entr = all[x];
                var paths = entr.id.split("/");
                var parent = root;
                var currentpath = [];
                for (let p = 0; p < paths.length; p++) {
                    let name = paths[p];
                    currentpath.push(name);
                    let scurrentpath = currentpath.join("/");
                    if (p < paths.length - 1) { //the parentfolders
                        if (!keys[scurrentpath]) {
                            let nf = {
                                name: name,
                                files: []
                            };
                            parent.files.push(nf);
                            keys[scurrentpath] = nf;
                        }
                        parent = keys[scurrentpath];
                    }
                    else {
                        if (entr.isDirectory) {
                            if (keys[scurrentpath] === undefined) {
                                let nf = {
                                    name: name,
                                    files: []
                                };
                                keys[scurrentpath] = nf;
                                parent.files.push(nf);
                            }
                        }
                        else {
                            var newitem = {
                                name: name
                            };
                            if (appendDate)
                                newitem.date = entr.date;
                            parent.files.push(newitem);
                        }
                    }
                }
            }
            return root;
        }
        async createFile(filename, content) {
            return await this.saveFiles([filename], [content], false);
        }
        async saveFile(filename, content) {
            return await this.saveFiles([filename], [content]);
        }
        async saveFiles(fileNames, contents, rollbackonerror = true) {
            var db = await Filessystem_1.getDB();
            var rollbackcontents = [];
            var tsfiles = [];
            var dbschemaHasChanged = false;
            var dbobjects = await Registry_1.default.getJSONData("$DBObject");
            for (let x = 0; x < fileNames.length; x++) {
                let fname = fileNames[x];
                if (fname.endsWith(".ts"))
                    tsfiles.push(fname.replace(".ts", ""));
                dbobjects.forEach((test) => {
                    if (test.filename === fname)
                        dbschemaHasChanged = true;
                });
                let exists = await this.loadFileEntry(fname);
                if (exists) {
                    rollbackcontents.push(exists.data);
                }
                else {
                    rollbackcontents.push(undefined); //this file would be killed at revert
                }
                if (contents[x] === undefined)
                    await this.remove(fname); //remove file on revert
                else {
                    let data = contents[x];
                    let transaction = db.transaction('files', 'readwrite');
                    const store = transaction.objectStore('files');
                    var el = new FileEntry();
                    el.id = fname;
                    el.data = data;
                    el.date = Date.now();
                    if (exists)
                        store.put(el);
                    else
                        store.add(el);
                    await new Promise((resolve) => { transaction.oncomplete = resolve; });
                }
            }
            if (fileNames.length === 1 && fileNames[0].endsWith("/registry.js")) //no indexer save recurse
                return;
            var RegistryIndexer = (await new Promise((resolve_1, reject_1) => { require(["jassijs_localserver/RegistryIndexer"], resolve_1, reject_1); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            if (rollbackonerror) {
                try {
                    await Reloader_1.Reloader.instance.reloadJSAll(tsfiles);
                    /*  if (dbschemaHasChanged) {
                          var man = await DBManager.destroyConnection();
                          await DBManager.get();
                      }*/
                }
                catch (err) {
                    console.error(err);
                    if (dbschemaHasChanged) {
                        await DBManager_1.DBManager.destroyConnection();
                    }
                    var restore = await this.saveFiles(fileNames, rollbackcontents, false);
                    if (dbschemaHasChanged) {
                        await DBManager_1.DBManager.get();
                    }
                    return err + "DB corrupt changes are reverted " + restore;
                }
            }
            return "";
        }
        async loadFileEntry(fileName) {
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readonly');
            const store = transaction.objectStore('files');
            var ret = await store.get(fileName);
            var r = await new Promise((resolve) => {
                ret.onsuccess = ev => { resolve(ret.result); };
                ret.onerror = ev => { resolve(undefined); };
            });
            return r;
        }
        /**
        * create a folder
        * @param filename - the name of the new file
        * @param content - then content
        */
        async createFolder(filename) {
            var test = await this.loadFileEntry(filename);
            if (test)
                return filename + " allready exists";
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readwrite');
            const store = transaction.objectStore('files');
            var el = {
                data: undefined,
                id: filename,
                isDirectory: true,
                date: Date.now()
            };
            store.add(el);
            transaction.onerror = (en) => {
                debugger;
            };
            await new Promise((resolve) => { transaction.oncomplete = resolve; });
            return "";
        }
        /**
         * create a module
         * @param modulname - the name of the module
      
         */
        async createModule(modulename) {
            if (!(await this.existsDirectory(modulename))) {
                await this.createFolder(modulename);
            }
            if (!(await this.existsDirectory(modulename + "/remote"))) {
                await this.createFolder(modulename + "/remote");
            }
            if ((await this.dirEntry(modulename + "/registry.js")).length === 0) {
                await this.saveFiles([modulename + "/registry.js", "js/" + modulename + "/registry.js"], ['define("' + modulename + '/registry",["require"], function(require) { return {  default: {	} } } );',
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );'], false);
            }
            if ((await this.dirEntry(modulename + "/modul.ts")).length === 0) {
                await this.saveFiles([modulename + "/modul.ts", "js/" + modulename + "/modul.js"], ["export default {}",
                    'define(["require", "exports"], function (require, exports) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = {};});'], false);
            }
            var json = await new Server_1.Server().loadFile("jassijs.json");
            var ob = JSON.parse(json);
            if (!ob.modules[modulename]) {
                ob.modules[modulename] = modulename;
                await this.saveFile("jassijs.json", JSON.stringify(ob, undefined, "\t"));
            }
            return "";
        }
        async loadFile(fileName) {
            var r = await this.loadFileEntry(fileName);
            return (r ? r.data : undefined);
        }
        /**
        * deletes a file or directory
        * @param file - old filename
        */
        async remove(file) {
            var entr = await this.dirEntry(file);
            if (entr.length === 0) {
                return file + " not exists";
            }
            var db = await Filessystem_1.getDB();
            for (let i = 0; i < entr.length; i++) {
                let transaction = db.transaction('files', 'readwrite');
                const store = transaction.objectStore('files');
                store.delete(entr[i].id);
                await new Promise((resolve) => { transaction.oncomplete = resolve; });
            }
            //update client jassijs.json if removing client module 
            var json = await this.loadFile("jassijs.json");
            var ob = JSON.parse(json);
            if (ob.modules[file]) {
                delete ob.modules[file];
                this.saveFile("jassijs.json", JSON.stringify(ob, undefined, "\t"));
            }
            var RegistryIndexer = (await new Promise((resolve_2, reject_2) => { require(["jassijs_localserver/RegistryIndexer"], resolve_2, reject_2); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            //entr = await this.dirEntry(file);
            return "";
        }
        /**
         * zip a directory
         */
        async zip(directoryname, serverdir = undefined, context = undefined) {
            //@ts-ignore
            var JSZip = (await new Promise((resolve_3, reject_3) => { require(["jassijs_localserver/ext/jszip"], resolve_3, reject_3); })).default;
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
        /**
         * renames a file or directory
         * @param oldfile - old filename
         * @param newfile - new filename
         */
        async rename(oldfile, newfile) {
            var oldf = await this.dirEntry(oldfile);
            var newf = await this.dirEntry(newfile);
            if (oldf.length < 1)
                return oldfile + " not exists";
            if (newf.length > 0)
                return newfile + " already exists";
            for (let i = 0; i < oldf.length; i++) {
                await this.remove(oldf[i].id);
                oldf[i].id = newfile + oldf[i].id.substring(oldfile.length);
                if (oldf[i].isDirectory)
                    await this.createFolder(oldf[i].id);
                else
                    await this.createFile(oldf[i].id, oldf[i].data);
            }
            var RegistryIndexer = (await new Promise((resolve_4, reject_4) => { require(["jassijs_localserver/RegistryIndexer"], resolve_4, reject_4); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            return "";
        }
    };
    Filessystem = Filessystem_1 = __decorate([
        jassijs_1.$Class("jassijs_localserver.Filessystem")
    ], Filessystem);
    exports.default = Filessystem;
    async function test() {
        var fs = new Filessystem();
        var hh = await fs.dir("local");
        /*await fs.createFolder("demo");
        await fs.createFile("demo/hallo", "");
        await fs.createFile("demo/hallo2", "");
        await fs.rename("demo","demo1");
        var hh=await fs.dirEntry();
        await fs.remove("demo1");*/
        return;
        await new Filessystem().saveFiles(["hallo.js"], ["alert(2)"]);
        var s1 = await new Filessystem().remove("hallo.js");
        var test = await new Filessystem().loadFile("hallo.js");
        var s2 = await new Filessystem().remove("hallo.js");
        var s = await new Filessystem().createFolder("demo");
        var s3 = await new Filessystem().remove("demo");
        await new Filessystem().saveFiles(["local/modul.ts"], [`export default {
    "require":{ 
        
    }
}`]);
        await new Filessystem().saveFiles(["local/registry.js"], [`//this file is autogenerated don't modify
define("local/registry",["require"], function(require) {
 return {
  default: {
	"local/modul.ts": {
		"date": 1614616375403
	}
}
 }
});`]);
    }
    exports.test = test;
});
//# sourceMappingURL=Filesystem.js.map