import { JassiError } from "jassijs/remote/Classes";
import { Test } from "jassijs/remote/Test";
import { config } from "jassijs/remote/Config";
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

export class LocalFS {
    private static db: any;
    private static async getDB() {
        if (LocalFS.db)
            return LocalFS.db;
        var req = window.indexedDB.open("handles", 3);
        var db = <any>await new Promise((resolve) => {
            req.onupgradeneeded = function (event) {
                var db = event.target["result"];
                var objectStore = db.createObjectStore("handles");
            }

            req.onsuccess = (ev) => {
                resolve(ev.target["result"])
            };

        })
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var ret = await store.get("handle");
        var r: any = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result) }
            ret.onerror = ev => { resolve(undefined) }
        });
        return r;
    }
    constructor() {

    }
   
    async readdir(folder: string): Promise<string[]> {
        var handle = await this.loadFileEntry(folder);
        var ret = [];
        if(handle===undefined)
            return ret;
        var entries = await handle.entries();
        var en = await entries.next();
        while (!en.done) {
            ret.push(en.value[0]);
            en = await entries.next();
        }

        return ret;
        //return await FS._readdir(db, folder);
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
        if (ret.kind !== "file")
            throw new JassiError("could notz read file" + file + " ...is a directory");
        var ff = await ret.getFile();
        var text:any;
        if(format==="binary")
            text = new Uint8Array(await ff.arrayBuffer());
        else
             text = await ff.text();

        return text;
    };
    async stat(file: string): Promise<Stats> {
        var ret = await this.loadFileEntry(file);
        if (ret.getFile !== undefined) {
            var st = await ret.getFile();
            return {
                isDirectory() { return false; },
                mtimeMs: st.lastModified
            }
        } else {
            return {
                isDirectory() { return true; },
                mtimeMs: undefined
            }
        }


    };


    getDirectoryname(path) {
        return path.substring(0, path.lastIndexOf("/"));
    }
  
    async mkdir(filename: string, options?: { recursive?: boolean }) {
        var test = await this.loadFileEntry(filename);
        if (test)
            throw new JassiError(filename + " allready exists");
        var parent = this.getDirectoryname(filename);
        if (parent === "")
            return;
        var parentDir = await this.loadFileEntry(parent);
        if (options?.recursive && (!await exists(parent))) {
            //recursive
            await this.mkdir(parent, options);
            parentDir = await this.loadFileEntry(parent);
        }
        if (!await exists(parent))
            throw new JassiError("parentfolder not exists: " + parent);
        var simpleFilename = filename.substring(parent.length + 1);
        await parentDir.getDirectoryHandle(simpleFilename, { create: true });
    };
    private async loadFileEntry(fileName: string): Promise<any> {
        var handle = await LocalFS.getDB();
        if (fileName.startsWith("./"))
            fileName = fileName.substring(2);
        if (fileName.startsWith("."))
            fileName = fileName.substring(1);
        if (fileName === "")
            return handle;
        var paths = fileName.split("/");

        var ret = handle;
        for (var x = 0; x < paths.length; x++) {
            try {
                ret = await ret.getDirectoryHandle(paths[x]);
            } catch {
                try {
                    ret = await ret.getFileHandle(paths[x]);
                } catch {
                    return undefined;
                }
            }
        }
        return ret;
    }

    async saveHandle(handle) {
        var db = await LocalFS.getDB();
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var ret = await store.get(handle.name);
        var r: any = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result) }
            ret.onerror = ev => { resolve(undefined) }
        });
        if (r)
            store.put(handle);
        else
            store.add(handle, "handle");
    }
    async writeFile(file: string, data: string) {
        var folder = this.getDirectoryname(file);
        var simpleFilename = file.substring(folder.length + 1);
        var handle = await this.loadFileEntry(folder);
        var writer = await handle.getFileHandle(simpleFilename, { create: true });
        var writable = await writer.createWritable();
        await writable.write(data);
        await writable.close();
    };
    async rename(oldPath: string, newPath: string) {
        var entr = await this.loadFileEntry(oldPath);
        if (entr === undefined)
            throw new JassiError("Error rename src not exists " + oldPath);
        var dest = await this.loadFileEntry(newPath);
        if (dest !== undefined)
            throw new JassiError("Error rename dest already exists " + newPath);
        if (entr.kind === "file") {
            var file = await entr.getFile();
            var text = await this.readFile(oldPath);
            await this.writeFile(newPath, text);
            await this.unlink(oldPath);
        } else {
            throw new JassiError("is not Supported");

        }
    }

    async unlink(file: string) {

        var entr = await this.loadFileEntry(file);
        if (entr === undefined)
            throw new JassiError("could not delete " + file + " - file not exists");
        if (entr.isDirectory)
            throw new JassiError("could not delete directory " + file + " - use rmdir ");
        var sdir = this.getDirectoryname(file)
        var folder = await this.loadFileEntry(sdir);
        var simpleFilename = file.substring(sdir.length + 1);

        await folder.removeEntry(simpleFilename);
        //await entr.remove();
    }

    async rmdir(dirName, options?: { recursive?: boolean }) {
        var entr = await this.loadFileEntry(dirName);
        if (entr === undefined)
            throw new JassiError("could not delete " + dirName + " - directory not exists");
        if (entr.kind != "directory")
            throw new JassiError("could not delete file " + dirName + " - use unlink");

        var folder = this.getDirectoryname(dirName);
        var simpleFilename = dirName.substring(folder.length + 1);
        var folderEntr = await this.loadFileEntry(folder);
        await folderEntr.removeEntry(simpleFilename, options);
    }
    private async exists(filename: string): Promise<boolean> {
        var db = await LocalFS.getDB();
        let exists = await this.loadFileEntry(filename);
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
    return await new LocalFS()["exists"](filename);
}
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
export async function deleteHandle() {
    var req = window.indexedDB.open("handles", 3);
    var db = <any>await new Promise((resolve) => {
        req.onupgradeneeded = function (event) {
            var db = event.target["result"];
            var objectStore = db.createObjectStore("handles");
        }
        req.onsuccess = (ev) => {
            resolve(ev.target["result"])
        };
    });
    let transaction = db.transaction('handles', 'readwrite');
    const store = transaction.objectStore('handles');
    store.delete("handle");
    await new Promise((resolve) => { transaction.oncomplete = resolve })
    
}
export async function createHandle() {
    var handle = await window.showDirectoryPicker();
    if (handle === undefined)
        return;
    if (!await verifyPermission(handle, true))
        return;
    var req = window.indexedDB.open("handles", 3);
    var db = <any>await new Promise((resolve) => {
        req.onupgradeneeded = function (event) {
            var db = event.target["result"];
            var objectStore = db.createObjectStore("handles");
        }
        req.onsuccess = (ev) => {
            resolve(ev.target["result"])
        };
    });
    let transaction = db.transaction("handles", 'readwrite');
    const store = transaction.objectStore("handles");
    var ret = await store.get(handle.name);
    var r: any = await new Promise((resolve) => {
        ret.onsuccess = ev => { resolve(ret.result) }
        ret.onerror = ev => { resolve(undefined) }
    });
    if (r)
        store.put(handle);
    else
        store.add(handle, "handle");
}
export async function test(tt: Test) {
     if(!config.isLocalFolderMapped)
        return;
    var fs = new LocalFS();
    // var hh = await fs.readdir(".");
    var testfolder = "./dasisteinfestfolder";
    var testfile = "./dasisteintestfile.js";
    await fs.writeFile(testfile, "var a=10;");
    tt.expectEqual(await exists(testfile));
    tt.expectEqual(!await exists(testfile + "lkjkljh"));
    tt.expectEqual(!(await fs.stat(testfile)).isDirectory());
    tt.expectEqual((await fs.stat(".")).isDirectory());
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
    await fs.rmdir(testfolder, { recursive: true });
  //  await fs.rename(testfolder, testfolder + "1");
    //tt.expectEqual(await exists(testfolder + "1"));
    //tt.expectEqual(!await exists(testfolder));
   // await fs.rename(testfolder + "1", testfolder);
   // tt.expectEqual(!await exists(testfolder + "1"));
   // tt.expectEqual(await exists(testfolder));
    debugger;
}
