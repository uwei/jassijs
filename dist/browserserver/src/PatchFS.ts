interface BrowserServerWorkerInterface {
    patchFS: (fs: any, jrequire: any, app: BrowserServerAppClass) => void
}
browserserverworker.patchFS = (fs: any, jrequire, app: BrowserServerAppClass) => {
    // Globales Array zur Sammlung aller Listener
    var savetimer: any = undefined;
    const watchListeners: { [filename: string]: any[] } = {}; // 

    fs.watch = (filename: string, options: any, listener: any) => {
        let file = filename;
        if (!file.startsWith("./") && !file.startsWith("/"))
            file = "/" + file;
        if (!file.startsWith("."))
            file = "." + file;
        // Parameter-Normalisierung
        if (typeof options === 'function') {
            listener = options;
            options = {};
        } else if (typeof options === 'string') {
            options = { encoding: options };
        } else {
            options = options || {};
        }

        const persistent = options.persistent !== false;
        const recursive = !!options.recursive;
        const encoding = options.encoding || 'utf8';

        // Listener-Wrapper
        const wrappedListener = (eventType: string, changedFile: any) => {
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
            on(event: string, cb: any) {
                const extraListener = {
                    original: cb,
                    wrapped: (eventType: string, changedFile: any) => {
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
                    if (index !== -1) list.splice(index, 1);
                    if (list.length === 0) delete watchListeners[file];
                }
            }
        };

        return watcher;
    }
    fs.fschanged = (path: string, event: string) => {
        //after 300ms without fileacivity we save data to indexdb
        //TODO save also if long time period - beacause if there a timer which permanent save files
        if (savetimer) {
            clearTimeout(savetimer);
            savetimer = undefined;
        }
        savetimer = setTimeout(() => {
            let data = fs.getRootFS().store.store;

            browserserverworker.writeIndexDB("browserserver", app.name, "files", data);//save Memory filesystem in indexdb
           // console.log("save Files");
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
    }
    var orgappendFileSync = fs.appendFileSync.bind(fs);
    fs.appendFileSync = (file: string, ...params: any) => {
        var ret = orgappendFileSync(file, ...params);

        fs.fschanged(file, "change");
        return ret;
    }

    var orgappendFile = fs.appendFile.bind(fs);
    fs.appendFile = (file: string, data: any, opts: any, cb: any) => {

        let ncb = () => {
            if (cb)
                cb();
            else {
                opts();
            }
            fs.fschanged(file, "change");
        }
        return orgappendFile(file, data, opts, ncb);
    }
    fs.copyFileSync = function (src: string, dest: string, flags = 0) {
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
    fs.copyFile = function (src: string, dest: string, flags = 0, callback: any) {
        if (typeof flags === 'function') {
            callback = flags;
            flags = 0;
        }
        try {
            fs.copyFileSync(src, dest, flags);
            callback(null);
        } catch (err) {
            callback(err);
        }
    }


    var orgreaddirSync = fs.readdirSync.bind(fs);;
    fs.readdirSync = (pfad: string, options: any) => {
        const names = orgreaddirSync(pfad, options);
        if (options?.withFileTypes) {
            return names.map((name: string) => {
                const fullPath = pfad + "/" + name;
                const stat = fs.statSync(fullPath);

                return {
                    name,
                    path: fullPath,
                    isFile: () => stat.isFile(),
                    isDirectory: () => stat.isDirectory()
                }

            });
        } else
            return names;
    }
    var orgexistsSync = fs.existsSync.bind(fs);;
    fs.existsSync = (pfad: string, options: any) => {
        try {
            return orgexistsSync(pfad, options);
        } catch {
            return false;
        }
    }
    var orgmkdirSync = fs.mkdirSync.bind(fs);;
    fs.mkdirSync = (pfad: string, options: any) => {
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
    }
    //var orgmkdir = fs.mkdir.bind(fs);;
    fs.mkdir = (pfad: string, options: any, callback: any) => {
        if (!callback)
            callback = options;
        try {
            var ret = fs.mkdirSync(pfad, options);
            callback();
        } catch (err) {
            callback(err);
        }
    }

    
    const { Writable } = jrequire('stream-browserify');
    fs.WriteStream=Writable;//not sure
    fs.createWriteStream = function (path: string, options = {}) {
        let chunks: any[] = [];

        const writable = new Writable({
            write(chunk: any, encoding: any, callback: any) {
                const bufferChunk = globalThis.Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
                chunks.push(bufferChunk);
                callback();
            }
        });
        const originalEnd = writable.end.bind(writable);
        writable.end = function (...args: any) {
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
            } catch (err) {
                console.error("Fehler beim Schreiben:", err);
            }

            originalEnd(...args);
            fs.fschanged(path, "change");
        };

        return writable;
    };
    const { Readable } = jrequire('stream-browserify');
    fs.ReadStream=Readable;//not sure
    //console.log("set stream");
    fs.createReadStream = function (path: string, options = {}) {
        let position = 0;
        let buffer: any;

        try {
            buffer = fs.readFileSync(path); // Datei synchron lesen
        } catch (err) {
            buffer = Buffer.alloc(0); // Leerer Buffer bei Fehler
        }

        const readable = new Readable({
            read(size: number) {
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
    fs.rename = (old: string, nw: string, cb: any) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(old, "rename");
            fs.fschanged(nw, "rename");
            fs.fschanged(nw, "change");
        }
        return orgrename(old, nw, ncb);
    }
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
    fs.readFileSync = (path: string, opts: any) => {
        if (opts === null)
            opts = undefined;
        return orgreadFileSync(path, opts);
    }
    var orgreadFile = fs.readFile.bind(fs);
    fs.readFile = (path: string, opts: any, cb: any) => {
        if (opts === null)
            opts = undefined;
        if (cb === null)
            cb = undefined;
        return orgreadFile(path, opts, cb);
    }

    var orgrmdirSync = fs.rmdirSync.bind(fs);
    fs.rmdirSync = (pfad: any, options: any, ...params: any) => {
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
    }


    var orgrmdir = fs.rmdir.bind(fs);
    fs.rmdir = (old: any, opt: any, cb: any) => {
        let mopt = opt;
        if (cb === undefined)
            mopt = undefined;
        fs.rmdirSync(old, mopt);
        fs.fschanged(old, "rename");

        if (cb === undefined) {
            opt();
        } else {
            cb();
        }

    }
    fs.rm = fs.rmdir;
    fs.rmSync = fs.rmdirSync;
    var orgstat = fs.stat.bind(fs);
    fs.stat = (path: any, opt: any, cb: any) => {
        let mopt = opt;
        if (cb === undefined) {
            mopt = undefined;
            cb = opt;
        }

        try {
            var ret = fs.statSync(path, mopt);
            cb(undefined, ret);
        } catch (err) {
            cb(err, undefined);
        }


    }
    var orgstatSync = fs.statSync.bind(fs);
    fs.statSync = (name: any, opt: any) => {
        var ret = orgstatSync(name, opt);

        ret.atimeMs = ret.atime.getTime();
        ret.ctimeMs = ret.ctime.getTime();
        ret.mtimeMs = ret.mtime.getTime();

        return ret;
    }
    var orgunlinkSync = fs.unlinkSync.bind(fs);
    fs.unlinkSync = (old: any, ...params: any) => {
        var ret = orgunlinkSync(old, ...params);
        fs.fschanged(old, "rename");
        return ret;
    }

    var orgunlink = fs.unlink.bind(fs);
    fs.unlink = (old: any, cb: any) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(old, "rename");
        }
        return orgunlink(old, ncb);
    }

    var orgwriteFileSync = fs.writeFileSync.bind(fs);
    fs.writeFileSync = (path: any, ...params: any) => {
        var ret = orgwriteFileSync(path, ...params);
        fs.fschanged(path, "change");
        return ret;
    }

    var orgwriteFile = fs.writeFile.bind(fs);
    fs.writeFile = (path: any, data: any, opts: any, cb: any) => {
        let ncb = () => {
            if (cb)
                cb();
            else
                opts();
            fs.fschanged(path, "rename");
        }
        if (cb === null)
            cb = undefined;
        if (opts === null)
            opts = undefined;

        return orgwriteFile(path, data, opts, ncb);
    }
    fs.promises = {
        appendFile: async (...args: any) => fs.appendFileSync(...args),
        link: async (...args: any) => fs.linkSync(...args),
        mkdir:async (...args: any) => fs.mkdirSync(...args),
        readdir: async (...args: any) => fs.readdirSync(...args),
        readFile: async (...args: any) => fs.readFileSync(...args),
        readlink: async (...args: any) => fs.readlinkSync(...args),
        rename: async (...args: any) => fs.renameSync(...args),
        rmdir: async (...args: any) => fs.rmdirSync(...args),
        stat: async (...args: any) => fs.statSync(...args),
        symlink: async (...args: any) => fs.symlinkSync(...args),
        lstat: async (...args: any) => fs.lstatSync(...args),
        unlink: async (...args: any) => fs.unlinkSync(...args),
        writeFile: async (...args: any) => fs.writeFileSync(...args)

    }

}
