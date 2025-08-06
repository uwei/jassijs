"use strict";
browserserverworker.patchFS = (fs, jrequire, app) => {
    // Globales Array zur Sammlung aller Listener
    var savetimer = undefined;
    const watchListeners = {}; // 
    fs.watch = (filename, options, listener) => {
        let file = filename;
        if (!file.startsWith("./") && !file.startsWith("/"))
            file = "/" + file;
        if (!file.startsWith("."))
            file = "." + file;
        // Parameter-Normalisierung
        if (typeof options === 'function') {
            listener = options;
            options = {};
        }
        else if (typeof options === 'string') {
            options = { encoding: options };
        }
        else {
            options = options || {};
        }
        const persistent = options.persistent !== false;
        const recursive = !!options.recursive;
        const encoding = options.encoding || 'utf8';
        // Listener-Wrapper
        const wrappedListener = (eventType, changedFile) => {
            let filenameToUse = changedFile;
            if (encoding === 'buffer') {
                filenameToUse = new TextEncoder().encode(changedFile);
            }
            listener?.(eventType, filenameToUse);
        };
        // Listener-Objekt
        const listenerObj = {
            original: listener,
            wrapped: wrappedListener,
            recursive,
            active: true
        };
        // Registrieren im Hash
        if (!watchListeners[file]) {
            watchListeners[file] = [];
        }
        watchListeners[file].push(listenerObj);
        // Rückgabeobjekt wie FSWatcher
        const watcher = {
            on(event, cb) {
                const extraListener = {
                    original: cb,
                    wrapped: (eventType, changedFile) => {
                        if (eventType === event) {
                            let filenameToUse = changedFile;
                            if (encoding === 'buffer') {
                                filenameToUse = new TextEncoder().encode(changedFile);
                            }
                            cb(filenameToUse);
                        }
                    },
                    recursive,
                    active: true
                };
                watchListeners[file].push(extraListener);
                return this;
            },
            close() {
                listenerObj.active = false;
                const list = watchListeners[file];
                if (list) {
                    const index = list.indexOf(listenerObj);
                    if (index !== -1)
                        list.splice(index, 1);
                    if (list.length === 0)
                        delete watchListeners[file];
                }
            }
        };
        return watcher;
    };
    fs.fschanged = (path, event) => {
        //after 300ms without fileacivity we save data to indexdb
        //TODO save also if long time period - beacause if there a timer which permanent save files
        if (savetimer) {
            clearTimeout(savetimer);
            savetimer = undefined;
        }
        savetimer = setTimeout(() => {
            let data = fs.getRootFS().store.store;
            browserserverworker.writeIndexDB("browserserver", app.name, "files", data); //save Memory filesystem in indexdb
            console.log("save Files");
        }, 300);
        if (watchListeners) {
            for (let key in watchListeners) {
                if (path.startsWith(key)) {
                    for (let x = 0; x < watchListeners[key].length; x++) {
                        watchListeners[key][x].wrapped(event, path);
                    }
                }
            }
        }
    };
    var orgappendFileSync = fs.appendFileSync.bind(fs);
    fs.appendFileSync = (file, ...params) => {
        var ret = orgappendFileSync(file, ...params);
        fs.fschanged(file, "change");
        return ret;
    };
    var orgappendFile = fs.appendFile.bind(fs);
    fs.appendFile = (file, data, opts, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            else {
                opts();
            }
            fs.fschanged(file, "change");
        };
        return orgappendFile(file, data, opts, ncb);
    };
    fs.copyFileSync = function (src, dest, flags = 0) {
        if (!fs.existsSync(src)) {
            throw new Error(`Quelle existiert nicht: ${src}`);
        }
        if ((flags & fs.constants?.COPYFILE_EXCL) && fs.existsSync(dest)) {
            throw new Error(`Zieldatei existiert bereits: ${dest}`);
        }
        const data = fs.readFileSync(src);
        fs.writeFileSync(dest, data);
        fs.fschanged(dest, "rename");
        fs.fschanged(dest, "change");
    };
    fs.copyFile = function (src, dest, flags = 0, callback) {
        if (typeof flags === 'function') {
            callback = flags;
            flags = 0;
        }
        try {
            fs.copyFileSync(src, dest, flags);
            callback(null);
        }
        catch (err) {
            callback(err);
        }
    };
    var orgreaddirSync = fs.readdirSync.bind(fs);
    ;
    fs.readdirSync = (pfad, options) => {
        const names = orgreaddirSync(pfad, options);
        if (options?.withFileTypes) {
            return names.map((name) => {
                const fullPath = pfad + "/" + name;
                const stat = fs.statSync(fullPath);
                return {
                    name,
                    path: fullPath,
                    isFile: () => stat.isFile(),
                    isDirectory: () => stat.isDirectory()
                };
            });
        }
        else
            return names;
    };
    var orgexistsSync = fs.existsSync.bind(fs);
    ;
    fs.existsSync = (pfad, options) => {
        try {
            return orgexistsSync(pfad, options);
        }
        catch {
            return false;
        }
    };
    var orgmkdirSync = fs.mkdirSync.bind(fs);
    ;
    fs.mkdirSync = (pfad, options) => {
        if (options?.recursive) {
            delete options.recursive;
            var dirs = pfad.split("/");
            var ges = "";
            for (var x = 0; x < dirs.length; x++) {
                if (dirs[x] === "")
                    continue;
                ges = ges + (ges === "" ? "" : "/") + dirs[x];
                if (!fs.existsSync(ges)) {
                    var temp = fs.existsSync(ges);
                    var ret = orgmkdirSync(ges, options);
                    if (x === (dirs.length - 1))
                        break;
                }
            }
        }
        fs.fschanged(pfad, "rename");
        return ret;
    };
    //var orgmkdir = fs.mkdir.bind(fs);;
    fs.mkdir = (pfad, options, callback) => {
        if (!callback)
            callback = options;
        try {
            var ret = fs.mkdirSync(pfad, options);
            callback();
        }
        catch (err) {
            callback(err);
        }
    };
    const { Writable } = jrequire('stream-browserify');
    fs.WriteStream = Writable; //not sure
    fs.createWriteStream = function (path, options = {}) {
        let chunks = [];
        const writable = new Writable({
            write(chunk, encoding, callback) {
                const bufferChunk = globalThis.Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
                chunks.push(bufferChunk);
                callback();
            }
        });
        const originalEnd = writable.end.bind(writable);
        writable.end = function (...args) {
            // Optionalen letzten Chunk schreiben
            if (args.length === 1 || args.length === 2) {
                const lastChunk = args[0];
                const encoding = args[1] || 'utf8';
                if (lastChunk != null) {
                    this.writeSync(lastChunk, encoding);
                }
            }
            //@ts-ignore
            const fullData = Buffer.concat(chunks);
            try {
                fs.writeFileSync(path, fullData);
            }
            catch (err) {
                console.error("Fehler beim Schreiben:", err);
            }
            originalEnd(...args);
            fs.fschanged(path, "change");
        };
        return writable;
    };
    const { Readable } = jrequire('stream-browserify');
    fs.ReadStream = Readable; //not sure
    //console.log("set stream");
    fs.createReadStream = function (path, options = {}) {
        let position = 0;
        let buffer;
        try {
            buffer = fs.readFileSync(path); // Datei synchron lesen
        }
        catch (err) {
            buffer = Buffer.alloc(0); // Leerer Buffer bei Fehler
        }
        const readable = new Readable({
            read(size) {
                const chunkSize = size || 64 * 1024; // Standardgröße
                if (position >= buffer.length) {
                    this.push(null); // Ende des Streams
                    return;
                }
                const chunk = buffer.slice(position, position + chunkSize);
                position += chunk.length;
                this.push(chunk);
            }
        });
        return readable;
    };
    var orgrename = fs.rename.bind(fs);
    fs.rename = (old, nw, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(old, "rename");
            fs.fschanged(nw, "rename");
            fs.fschanged(nw, "change");
        };
        return orgrename(old, nw, ncb);
    };
    /* var orgrmSync = fs.rmSync.bind(fs);
     fs.rmSync = (old, ...params) => {
         orgrmSync(old, ...params);
         fs.fschanged(old, "rename");
     
     
     var orgrm = fs.rm.bind(fs);
     fs.rm = (old, opt, cb) => {
         let ncb = () => {
             if (cb)
                 cb();
             fs.fschanged(old, "rename");
         }
         orgrm(old, opt, ncb);
     }
     
     var orgrmSync = fs.rmSync.bind(fs);
     fs.rmSync = (old, ...params) => {
         orgrmSync(old, ...params);
         fs.fschanged(old, "rename");
     }
     
     var orgrm = fs.rm.bind(fs);
     fs.rm = (old, opt, cb) => {
         let ncb = () => {
             if (cb)
                 cb();
             fs.fschanged(old, "rename");
         }
         orgrm(old, opt, ncb);
     }
    */
    var orgreadFileSync = fs.readFileSync.bind(fs);
    fs.readFileSync = (path, opts) => {
        if (opts === null)
            opts = undefined;
        return orgreadFileSync(path, opts);
    };
    var orgreadFile = fs.readFile.bind(fs);
    fs.readFile = (path, opts, cb) => {
        if (opts === null)
            opts = undefined;
        if (cb === null)
            cb = undefined;
        return orgreadFile(path, opts, cb);
    };
    var orgrmdirSync = fs.rmdirSync.bind(fs);
    fs.rmdirSync = (pfad, options, ...params) => {
        //var ret = orgrmdirSync(old, ...params);
        if (options?.recursive) {
            delete options.recursive;
            var files = fs.readdirSync(pfad, { withFileTypes: true });
            for (let x = 0; x < files.length; x++) {
                let entry = files[x];
                if (entry.isFile())
                    fs.unlinkSync(entry.path);
                else
                    fs.rmdirSync(entry.path, { recursive: true });
            }
        }
        var ret = orgrmdirSync(pfad, options);
        fs.fschanged(pfad, "rename");
        return ret;
    };
    var orgrmdir = fs.rmdir.bind(fs);
    fs.rmdir = (old, opt, cb) => {
        let mopt = opt;
        if (cb === undefined)
            mopt = undefined;
        fs.rmdirSync(old, mopt);
        fs.fschanged(old, "rename");
        if (cb === undefined) {
            opt();
        }
        else {
            cb();
        }
    };
    fs.rm = fs.rmdir;
    fs.rmSync = fs.rmdirSync;
    var orgstat = fs.stat.bind(fs);
    fs.stat = (path, opt, cb) => {
        let mopt = opt;
        if (cb === undefined) {
            mopt = undefined;
            cb = opt;
        }
        try {
            var ret = fs.statSync(path, mopt);
            cb(undefined, ret);
        }
        catch (err) {
            cb(err, undefined);
        }
    };
    var orgstatSync = fs.statSync.bind(fs);
    fs.statSync = (name, opt) => {
        var ret = orgstatSync(name, opt);
        ret.atimeMs = ret.atime.getTime();
        ret.ctimeMs = ret.ctime.getTime();
        ret.mtimeMs = ret.mtime.getTime();
        return ret;
    };
    var orgunlinkSync = fs.unlinkSync.bind(fs);
    fs.unlinkSync = (old, ...params) => {
        var ret = orgunlinkSync(old, ...params);
        fs.fschanged(old, "rename");
        return ret;
    };
    var orgunlink = fs.unlink.bind(fs);
    fs.unlink = (old, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(old, "rename");
        };
        return orgunlink(old, ncb);
    };
    var orgwriteFileSync = fs.writeFileSync.bind(fs);
    fs.writeFileSync = (path, ...params) => {
        var ret = orgwriteFileSync(path, ...params);
        fs.fschanged(path, "change");
        return ret;
    };
    var orgwriteFile = fs.writeFile.bind(fs);
    fs.writeFile = (path, data, opts, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            else
                opts();
            fs.fschanged(path, "rename");
        };
        if (cb === null)
            cb = undefined;
        if (opts === null)
            opts = undefined;
        return orgwriteFile(path, data, opts, ncb);
    };
    fs.promises = {
        appendFile: async (...args) => fs.appendFileSync(...args),
        link: async (...args) => fs.linkSync(...args),
        mkdir: async (...args) => fs.mkdirSync(...args),
        readdir: async (...args) => fs.readdirSync(...args),
        readFile: async (...args) => fs.readFileSync(...args),
        readlink: async (...args) => fs.readlinkSync(...args),
        rename: async (...args) => fs.renameSync(...args),
        rmdir: async (...args) => fs.rmdirSync(...args),
        stat: async (...args) => fs.statSync(...args),
        symlink: async (...args) => fs.symlinkSync(...args),
        lstat: async (...args) => fs.lstatSync(...args),
        unlink: async (...args) => fs.unlinkSync(...args),
        writeFile: async (...args) => fs.writeFileSync(...args)
    };
};
//# sourceMappingURL=PatchFS.js.map