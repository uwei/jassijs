import { JassiError } from "jassijs/remote/Classes";
import { Test } from "jassijs/remote/Test";
class Stats {
    mtimeMs: number;
    isDirectory: () => boolean;
}
class FileEntry {
    id: string;
    date: number;
    isDirectory?: boolean;
    data: any;
}

export class FS {
    private static db: IDBDatabase;
    private static async getDB() {
        if (FS.db)
            return FS.db;
        var req = window.indexedDB.open("jassi", 1);
        req.onupgradeneeded = function (event) {
            var db = event.target["result"];
            var objectStore = db.createObjectStore("files", { keyPath: "id" });
        }
        FS.db = await new Promise((resolve) => {
            req.onsuccess = (ev) => { resolve(ev.target["result"]) };
        })
        var root = await FS._loadFileEntry(FS.db, ".");
        if (root === undefined)
            await FS._mkdir(FS.db, ".");
        return FS.db;
    }
    constructor() {

    }
    static async _readdir(db: IDBDatabase, folder: string, withSubfolders = false, fullPath = false): Promise<string[]> {
        let transaction = db.transaction('files', 'readonly');
        const store = transaction.objectStore('files');
        var ret = await store.openCursor(IDBKeyRange.bound(folder + "/", folder + "0", true, true));//0 is the first char after /
        var all = [];
        if (!folder.endsWith("/"))
            folder = folder + "/";
        await new Promise((resolve) => {
            ret.onsuccess = ev => {
                var el = ev.target["result"];
                if (el) {
                    if (el.value.id.startsWith(folder)) {
                        var test = el.value.id.substring(folder.length);
                        if (test.indexOf("/") === -1 || withSubfolders === true) {//no sub folders
                            if (fullPath)
                                all.push(el.value.id.substring(folder.length));
                            else
                                all.push(el.value.id.substring(folder.length));
                        }
                    }
                    //if (curdir === "" || el.value.id === curdir || el.value.id.startsWith(curdir + "/"))

                    el.continue();
                } else
                    resolve(undefined);
            }
            ret.onerror = ev => {

                resolve(undefined)
            }
        });
        return all;
    }
    async readdir(folder: string): Promise<string[]> {
        var db = await FS.getDB();
        return await FS._readdir(db, folder);
    };

    async readFile(file: string, format?: string, fallback = true): Promise<string> {
        var ret = await this.loadFileEntry(file);
        //fallback to Server
        if (fallback && ret === undefined) {
            var test = await downloadFile(file);
            if (test !== undefined || test === "Unauthorized")
                ret = { data: test, date: undefined, id: "" };
        }
        if (ret === undefined)
            throw new JassiError(file + " not exists");
        if (ret.isDirectory)
            throw new JassiError("could notz read file" + file + " ...is a directory");
        return ret.data;
    };
    async stat(file: string): Promise<Stats> {
        var ret = await this.loadFileEntry(file);
        return {
            isDirectory() { return ret.isDirectory },
            mtimeMs: ret.date
        }
    };


    getDirectoryname(path) {
        return path.substring(0, path.lastIndexOf("/"));
    }
    private static async _mkdir(db, filename: string) {
        let transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        var el: FileEntry = {
            data: undefined,
            id: filename,
            isDirectory: true,
            date: Date.now()
        }
        store.add(el);
        transaction.onerror = (en) => {
            debugger;
        };
        await new Promise((resolve) => { transaction.oncomplete = resolve })
    }
    async mkdir(filename: string, options?: { recursive?: boolean }) {
        var test = await this.loadFileEntry(filename);
        if (test)
            throw new JassiError(filename + " allready exists");
        var parent = this.getDirectoryname(filename);
        if (parent === "")
            return;
        if (options?.recursive && (!await exists(parent)))
            await this.mkdir(parent, options);
        if (!await exists(parent))
            throw new JassiError("parentfolder not exists: " + parent);

        var db = await FS.getDB();
        await FS._mkdir(db, filename);
    };
    private async loadFileEntry(fileName: string): Promise<FileEntry> {
        var db = await FS.getDB();
        return await FS._loadFileEntry(db, fileName);
    }
    private static async _loadFileEntry(db: IDBDatabase, fileName: string): Promise<FileEntry> {
        let transaction = db.transaction('files', 'readonly');
        const store = transaction.objectStore('files');
        var ret = await store.get(fileName);
        var r: any = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result) }
            ret.onerror = ev => { resolve(undefined) }
        });
        return r;
    }
    async writeFile(file: string, data: string) {
        var db = await FS.getDB();
        let exists = await this.loadFileEntry(file);
        let transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        var el = new FileEntry();
        el.id = file;
        el.data = data;
        el.isDirectory = false;
        el.date = Date.now();
        if (exists)
            store.put(el);
        else
            store.add(el);
        await new Promise((resolve) => { transaction.oncomplete = resolve })
    };
    async rename(oldPath: string, newPath: string) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(oldPath);
        if (entr === undefined)
            throw new JassiError("Error rename src not exists " + oldPath);
        var dest = await this.loadFileEntry(newPath);
        if (dest !== undefined)
            throw new JassiError("Error rename dest already exists " + newPath);
        if (entr.isDirectory === false) {
            await this.unlink(entr.id);
            await this.writeFile(newPath, entr.data);
        } else {
            var all = await FS._readdir(db, oldPath, true, true);
            all.push(oldPath)
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
    private static async _removeEntry(db: IDBDatabase, entr: FileEntry) {

        let transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        store.delete(entr.id);
        await new Promise((resolve) => { transaction.oncomplete = resolve })
    }
    async unlink(file: string) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(file);
        if (entr === undefined)
            throw new JassiError("could not delete " + file + " - file not exists");
        if (entr.isDirectory)
            throw new JassiError("could not delete directory " + file + " - use rmdir ");
        return await FS._removeEntry(db, entr);

    }

    async rmdir(dirName, options?: { recursive?: boolean }) {
        var db = await FS.getDB();
        var entr = await this.loadFileEntry(dirName);
        if (entr === undefined)
            throw new JassiError("could not delete " + file + " - directory not exists");
        if (!entr.isDirectory)
            throw new JassiError("could not delete file " + file + " - use unlink");

        var files = await FS._readdir(FS.db, dirName, true, true);

        if (options?.recursive) {

        } else {
            if (files.length > 0)
                throw new JassiError("could not delete " + dirName + " directory is not empty");
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
        let transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        store.delete(entr.id);
        await new Promise((resolve) => { transaction.oncomplete = resolve })*/
    }
    private async exists(filename: string): Promise<boolean> {
        var db = await FS.getDB();
        let exists = await new FS().loadFileEntry(filename);
        return exists !== undefined;
    }
}

async function downloadFile(file: string) {
    return await new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', file.replace("./client", ""), true);

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status === 200)
                    resolve(xmlHttp.responseText);
                else
                    resolve(undefined);
            };
        };
        xmlHttp.onerror = (err) => {
            resolve(undefined);
        }
        xmlHttp.send(null);

    })
};

export async function exists(filename: string): Promise<boolean> {
    return new FS()["exists"](filename);
}

export async function test(tt: Test) {
    var fs = new FS();

    var testfolder = "./dasisteinfestfolder";
    var testfile = "./dasisteintestfile.js";

    await fs.writeFile(testfile, "var a=10;");
    tt.expectEqual(!(await fs.stat(testfile)).isDirectory())
    tt.expectEqual(await exists(testfile));
    tt.expectEqual((await fs.readFile(testfile)) === "var a=10;");
    var hh = await fs.readdir(".");
    tt.expectEqual(hh.length > 0);
    await fs.rename(testfile, testfile + ".txt");
    tt.expectEqual(await exists(testfile + ".txt"));
    await fs.rename(testfile + ".txt", testfile);

    await fs.unlink(testfile);
    tt.expectEqual(!await exists(testfile));
    tt.expectErrorAsync(async () => await fs.unlink("./hallo.js"));
    if (await exists(testfolder))
        await fs.rmdir(testfolder, { recursive: true });
    await fs.mkdir(testfolder + "/hh", { recursive: true });
    await fs.writeFile(testfolder + "/hh/h.txt", "Hallo");
    await fs.rename(testfolder, testfolder + "1");
    tt.expectEqual(await exists(testfolder + "1"));
    tt.expectEqual(!await exists(testfolder));
    await fs.rename(testfolder + "1", testfolder);
    tt.expectEqual(!await exists(testfolder + "1"));
    tt.expectEqual(await exists(testfolder));
    //tt.expectErrorAsync(async () => await fs.rmdir(testfolder));
    //await fs.rmdir(testfolder, { recursive: true })
    debugger;
}