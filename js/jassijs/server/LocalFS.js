"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.testLF = exports.exists = exports.FS = void 0;
const Classes_1 = require("jassijs/remote/Classes");
class Stats {
}
class FileEntry {
}
class FS {
    constructor() {
    }
    static async getDB() {
        if (FS.db)
            return FS.db;
        var req = window.indexedDB.open("handles", 3);
        FS.db = await new Promise((resolve) => {
            req.onupgradeneeded = function (event) {
                var db = event.target["result"];
                var objectStore = db.createObjectStore("handles");
            };
            req.onsuccess = (ev) => {
                resolve(ev.target["result"]);
            };
            req.onblocked = (ev) => {
                resolve(ev.target["result"]);
            };
            req.onerror = (ev) => {
                resolve(ev.target["result"]);
            };
        });
        return FS.db;
    }
    static async _readdir(db, folder, withSubfolders = false, fullPath = false) {
        let transaction = db.transaction("handles", 'readonly');
        const store = transaction.objectStore("handles");
        var ret = await store.openCursor(IDBKeyRange.bound(folder + "/", folder + "0", true, true)); //0 is the first char after /
        var all = [];
        if (!folder.endsWith("/"))
            folder = folder + "/";
        await new Promise((resolve) => {
            ret.onsuccess = ev => {
                var el = ev.target["result"];
                if (el) {
                    if (el.value.id.startsWith(folder)) {
                        var test = el.value.id.substring(folder.length);
                        if (test.indexOf("/") === -1 || withSubfolders === true) { //no sub folders
                            if (fullPath)
                                all.push(el.value.id.substring(folder.length));
                            else
                                all.push(el.value.id.substring(folder.length));
                        }
                    }
                    //if (curdir === "" || el.value.id === curdir || el.value.id.startsWith(curdir + "/"))
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
    async readdir(folder) {
        var db = await FS.getDB();
        return await FS._readdir(db, folder);
    }
    ;
    async readFile(file, format, fallback = true) {
        var ret = await this.loadFileEntry(file);
        //fallback to Server
        if (fallback && ret === undefined) {
            var test = await downloadFile(file);
            if (test !== undefined || test === "Unauthorized")
                ret = { data: test, date: undefined, id: "" };
        }
        if (ret === undefined)
            throw new Classes_1.JassiError(file + " not exists");
        if (ret.isDirectory)
            throw new Classes_1.JassiError("could notz read file" + file + " ...is a directory");
        return ret.data;
    }
    ;
    async stat(file) {
        var ret = await this.loadFileEntry(file);
        return {
            isDirectory() { return ret.isDirectory; },
            mtimeMs: ret.date
        };
    }
    ;
    getDirectoryname(path) {
        return path.substring(0, path.lastIndexOf("/"));
    }
    static async _mkdir(db, filename) {
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
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
    }
    async mkdir(filename, options) {
        var test = await this.loadFileEntry(filename);
        if (test)
            throw new Classes_1.JassiError(filename + " allready exists");
        var parent = this.getDirectoryname(filename);
        if (parent === "")
            return;
        if ((options === null || options === void 0 ? void 0 : options.recursive) && (!await exists(parent)))
            await this.mkdir(parent, options);
        if (!await exists(parent))
            throw new Classes_1.JassiError("parentfolder not exists: " + parent);
        var db = await FS.getDB();
        await FS._mkdir(db, filename);
    }
    ;
    async loadFileEntry(fileName) {
        var db = await FS.getDB();
        return await FS._loadFileEntry(db, fileName);
    }
    static async _loadFileEntry(db, fileName) {
        let transaction = db.transaction("handles", 'readonly');
        const store = transaction.objectStore("handles");
        var ret = await store.get(fileName);
        var r = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result); };
            ret.onerror = ev => { resolve(undefined); };
        });
        return r;
    }
    async loadHandle() {
        var db = await FS.getDB();
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var ret = await store.get("handle");
        var r = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result); };
            ret.onerror = ev => { resolve(undefined); };
        });
        return r;
    }
    async saveHandle(handle) {
        var db = await FS.getDB();
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var ret = await store.get(handle.name);
        var r = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result); };
            ret.onerror = ev => { resolve(undefined); };
        });
        if (r)
            store.put(handle);
        else
            store.add(handle, "handle");
    }
    async writeFile(file, data) {
        var db = await FS.getDB();
        let exists = await this.loadFileEntry(file);
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var el = new FileEntry();
        el.id = file;
        el.data = data;
        el.isDirectory = false;
        el.date = Date.now();
        if (exists)
            store.put(el);
        else
            store.add(el);
        await new Promise((resolve) => { transaction.oncomplete = resolve; });
    }
    ;
    async rename(oldPath, newPath) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(oldPath);
        if (entr === undefined)
            throw new Classes_1.JassiError("Error rename src not exists " + oldPath);
        var dest = await this.loadFileEntry(newPath);
        if (dest !== undefined)
            throw new Classes_1.JassiError("Error rename dest already exists " + newPath);
        if (entr.isDirectory === false) {
            await this.unlink(entr.id);
            await this.writeFile(newPath, entr.data);
        }
        else {
            var all = await FS._readdir(db, oldPath, true, true);
            all.push(oldPath);
            all = all.sort((a, b) => a.localeCompare(b));
            for (var x = 0; x < all.length; x++) {
                var fe = await this.loadFileEntry(all[x]);
                var newname = all[x].replace(oldPath, newPath);
                if (fe.isDirectory)
                    await this.mkdir(newname);
                else
                    await this.writeFile(newname, fe.data);
                await FS._removeEntry(db, fe);
            }
        }
    }
    static async _removeEntry(db, entr) {
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        store.delete(entr.id);
        await new Promise((resolve) => { transaction.oncomplete = resolve; });
    }
    async unlink(file) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(file);
        if (entr === undefined)
            throw new Classes_1.JassiError("could not delete " + file + " - file not exists");
        if (entr.isDirectory)
            throw new Classes_1.JassiError("could not delete directory " + file + " - use rmdir ");
        return await FS._removeEntry(db, entr);
    }
    async rmdir(dirName, options) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(dirName);
        if (entr === undefined)
            throw new Classes_1.JassiError("could not delete " + file + " - directory not exists");
        if (!entr.isDirectory)
            throw new Classes_1.JassiError("could not delete file " + file + " - use unlink");
        var files = await FS._readdir(FS.db, dirName, true, true);
        if (options === null || options === void 0 ? void 0 : options.recursive) {
        }
        else {
            if (files.length > 0)
                throw new Classes_1.JassiError("could not delete " + dirName + " directory is not empty");
        }
        for (var x = 0; x < files.length; x++) {
            var file = files[x];
            var entr = await this.loadFileEntry(file);
            await FS._removeEntry(db, entr);
        }
        /*var db = await FS.getDB();
        var entr = await this.loadFileEntry(file);
        if (entr === undefined)
            throw new JassiError("could not delete " + file + " - file not exists");
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        store.delete(entr.id);
        await new Promise((resolve) => { transaction.oncomplete = resolve })*/
    }
    async exists(filename) {
        var db = await FS.getDB();
        let exists = await new FS().loadFileEntry(filename);
        return exists !== undefined;
    }
}
exports.FS = FS;
async function downloadFile(file) {
    return await new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', file.replace("./client", ""), true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status === 200)
                    resolve(xmlHttp.responseText);
                else
                    resolve(undefined);
            }
            ;
        };
        xmlHttp.onerror = (err) => {
            resolve(undefined);
        };
        xmlHttp.send(null);
    });
}
;
async function exists(filename) {
    return new FS()["exists"](filename);
}
exports.exists = exists;
async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}
async function testLF() {
    var handle = await new FS().loadHandle();
    handle = await window.showDirectoryPicker();
    var instance = await new FS().saveHandle(handle);
}
exports.testLF = testLF;
async function test() {
    //window.dirhandle = await window.showDirectoryPicker();
    var handle = await new FS().loadHandle();
    if (handle === undefined) {
        handle = await window.showDirectoryPicker();
        var instance = await new FS().saveHandle(handle);
    }
    await verifyPermission(handle, true);
    var e = await handle.entries().next();
    console.log(e.value[0]);
    // var instance = await new FS().saveHandle(window.dirhandle);
}
exports.test = test;
//# sourceMappingURL=LocalFS.js.map