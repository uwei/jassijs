var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/util/Reloader", "jassi_localserver/RegistyIndexer", "jassi_localserver/DBManager"], function (require, exports, Jassi_1, Reloader_1, RegistyIndexer_1, DBManager_1) {
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
                    extensions.forEach((ent) => {
                        if (fname.endsWith(ent))
                            include = false;
                    });
                }
                if (ignore) {
                    ignore.forEach((ent) => {
                        if (fname === ent)
                            include = false;
                    });
                    if (include)
                        ret.push(fname);
                }
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
                ret.onerror = ev => { resolve(undefined); };
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
            return await this.saveFile(filename, content);
        }
        async saveFile(filename, content) {
            return await this.saveFiles([filename], [content]);
        }
        async saveFiles(fileNames, contents, rollbackonerror = true) {
            var db = await Filessystem_1.getDB();
            var rollbackcontents = [];
            var tsfiles = [];
            for (let x = 0; x < fileNames.length; x++) {
                let fname = fileNames[x];
                if (fname.endsWith(".js"))
                    tsfiles.push(fname);
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
                var spath = fname.split("/");
                if (spath.length > 1 && spath[1].toLowerCase() === "remote" && fname.toLowerCase().endsWith(".ts")) {
                    var man = await DBManager_1.DBManager.destroyConnection();
                }
            }
            await new RegistyIndexer_1.RegistryIndexer().updateRegistry();
            if (rollbackonerror) {
                try {
                    //reloadjs
                    for (let x = 0; x < tsfiles.length; x++) {
                        var f = tsfiles[x].replace(".ts", "");
                        new Reloader_1.Reloader().reloadJS(f);
                    }
                    await DBManager_1.DBManager.get();
                }
                catch (err) {
                    console.error(err);
                    var restore = await this.saveFiles(fileNames, rollbackcontents, false);
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
            await new Promise((resolve) => { transaction.oncomplete = resolve; });
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
            //entr = await this.dirEntry(file);
            return "";
        }
        /**
         * zip a directory
         */
        async zip(directoryname, serverdir = undefined, context = undefined) {
            //@ts-ignore
            var JSZip = (await new Promise((resolve_1, reject_1) => { require(["jassi_localserver/ext/jszip"], resolve_1, reject_1); })).default;
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
            return "";
        }
    };
    Filessystem = Filessystem_1 = __decorate([
        Jassi_1.$Class("jassi_localserver.Filessystem")
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
//# sourceMappingURL=Filessystem.js.map
//# sourceMappingURL=Filessystem.js.map