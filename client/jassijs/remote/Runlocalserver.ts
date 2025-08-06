

globalThis.modulecache = {};
const textExt = ["js", "ts", "cfg", "xml", "json", "txt", "css", "map", "md", "npmignore", "nycrc", "css", "scss", "yml"]

var servedLocalUrls = [];
debugger;
importScripts('/js/jassijs/remote/Npm.js');
importScripts('/js/jassijs/remote/PatchTTP.js');//mache eigene lib mit export.defined
self.addEventListener('fetch', event => {

    // console.log("rfetch "+event.request.url);
    if (event.request.url.startsWith(self.location.origin)) {
        //host client files
        var pr = handleLocalServerEvent(event);
        event.respondWith(pr);
        return;
    }
    //console.log("no answer to "+event.request.url);
    //  event.waitUntil(pr);
});
//runLocalServerIfNeeded();

async function handleLocalServerEvent(event) {
    await runLocalServerIfNeeded();
    /* if (globalThis.requestHandler) {
         for (let key in globalThis.requestHandler) {
             if (event.request.url.startsWith(key))
                 event.respondWith(globalThis.requestHandler[key](event));
         }
     }*/
    //map first server - later we have a config
    while (globalThis.requestHandler === undefined || Object.keys(globalThis.requestHandler).length === 0) {
        await new Promise((res) => setTimeout(res, 100));
    }
    var ret = globalThis.requestHandler[Object.keys(globalThis.requestHandler)[0]](event);
    return ret;
}

//@ts-ignore
function require(path) {
    debugger;
    //why this?
}
function patchNodeFunction() {
    const originalSetInterval = globalThis.setInterval;
    globalThis.setInterval = (...args) => {
        var ret = new Number(originalSetInterval(...args));
        ret.unref = () => true;
        return ret;
    }
    globalThis.setImmediate = (proc, ...params) => {
        // debugger;
        proc();
    }
}
patchNodeFunction();


var modulesshims = {
    // "fs": "./node_modules/browserfs/dist/shims/fs.js",
    "buffer": "./node_modules/browserfs/dist/shims/buffer.js",
    "bufferGlobal": "./node_modules/browserfs/dist/shims/bufferGlobal.js",
    //"buffer": "./node_modules/buffer/index.js",
    "path": "./node_modules/browserfs/dist/shims/path.js",
    //  "path": "./node_modules/path-browserify/",
    "process": "./node_modules/browserfs/dist/shims/process.js",
    //"process": "./node_modules/process/browser.js",
    //"readable-stream": "./node_modules/readable-stream/readable-browser.js",
    "assert": "./node_modules/assert/assert.js",
    //"console": "./node_modules/console-browserify/index.js",
    "constants": "./node_modules/constants-browserify/constants.json",
    "create-hash": "./node_modules/create-hash/browser.js",
    "create-hmac": "./node_modules/create-hmac/browser.js",
    "crypto": "./node_modules/crypto-browserify/index.js",
    "domain": "./node_modules/domain-browser/constants",
    "events": "./node_modules/events/events.js",
    "http": "./node_modules/stream-http/index.js",
    "https": "./node_modules/https-browserify/index.js",
    "inhertis": "./node_modulesy/inherits/inherits_browser.js",
    "os": "./node_modules/os-browserify/browser.js",
    "punycode": "./node_modules/punycode/punycode.js",
    "querystring": "./node_modules/querystring-es3/index.js",
    "randombytes": "./node_modules/randombytes/browser.js",
    "stream": "./node_modules/stream-browserify/index.js",
    "_stream_duplex": "./node_modules/readable-stream/duplex.js",
    "_stream_passthrough": "./node_modules/readable-stream/passthrough.js",
    "_stream_readable": "./node_modules/readable-stream/readable.js",
    "_stream_transform": "./node_modules/readable-stream/transform.js",
    "_stream_writable": "./node_modules/readable-stream/writable.js",
    "string_decoder": "./node_modules/string_decoder/lib/string_decoder.js",
    "sys": "./node_modules/util/util.js",
    "timers": "./node_modules/timers-browserify/main.js",
    "tty": "./node_modules/tty-browserify/index.js",
    "url": "./node_modules/url/url.js",
    "util": "./node_modules/util/util.js",
    "vm": "./node_modules/vm-browserify/index.js",
    "zlib": "./node_modules/browserify-zlib/lib/index.js"

}

var isinited = false;
var globalfs;
function patchFS(fs) {
    // Globales Array zur Sammlung aller Listener
    var savetimer;
    const watchListeners: { [filename: string]: any[] } = {}; // 

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
        } else if (typeof options === 'string') {
            options = { encoding: options };
        } else {
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
            console.log("save Files");
            writeIndexDB("jassijs", "server", "files", data);//save Memory filesystem in indexdb
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
    fs.appendFileSync = (file, ...params) => {
        var ret = orgappendFileSync(file, ...params);

        fs.fschanged(file, "change");
        return ret;
    }

    var orgappendFile = fs.appendFile.bind(fs);
    fs.appendFile = (file, data, opts, cb) => {

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

    /*var orgcopyFile = fs.copyFile.bind(fs);
    fs.copyFile = (file, dest, ...params) => {
        orgcopyFile(file, dest, ...params);
        fs.fschanged(dest, "rename");
        fs.fschanged(dest, "change");
    }

    var orgcopyFileSync = fs.copyFileSync.bind(fs);
    fs.copyFileSync = (file, dest, mode, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(dest, "rename");
            fs.fschanged(dest, "change");
        }
        orgcopyFileSync(file, dest, mode, ncb);
    }*/

    var orgreaddirSync = fs.readdirSync.bind(fs);;
    fs.readdirSync = (pfad, options) => {
        const names = orgreaddirSync(pfad, options);
        if (options?.withFileTypes) {
            return names.map(name => {
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
    fs.existsSync = (pfad, options) => {
        try {
            return orgexistsSync(pfad, options);
        } catch {
            return false;
        }
    }
    var orgmkdirSync = fs.mkdirSync.bind(fs);;
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
    fs.mkdir = (pfad, options, callback) => {
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
    fs.createWriteStream = function (path, options = {}) {
        let chunks = [];

        const writable = new Writable({
            write(chunk, encoding, callback) {
                const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
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
            const fullData = Buffer.concat(chunks);
            try {
                fs.writeFileSync(path, fullData);
                console.log("📁 Datei geschrieben:", path);
            } catch (err) {
                console.error("⚠️ Fehler beim Schreiben:", err);
            }

            originalEnd(...args);
            fs.fschanged(path, "change");
        };

        return writable;
    };
    const { Readable } = jrequire('stream-browserify');
    fs.createReadStream = function (path, options = {}) {
        let position = 0;
        let buffer;

        try {
            buffer = fs.readFileSync(path); // Datei synchron lesen
        } catch (err) {
            console.error("⚠️ Fehler beim Lesen:", err);
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
    fs.readFileSync = (path, opts) => {
        if (opts === null)
            opts = undefined;
        return orgreadFileSync(path, opts);
    }
    var orgreadFile = fs.readFile.bind(fs);
    fs.readFile = (path, opts, cb) => {
        if (opts === null)
            opts = undefined;
        if (cb === null)
            cb = undefined;
        return orgreadFile(path, opts, cb);
    }

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
    }


    var orgrmdir = fs.rmdir.bind(fs);
    fs.rmdir = (old, opt, cb) => {
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
    fs.stat = (path, opt, cb) => {
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
    fs.statSync = (name, opt) => {
        var ret = orgstatSync(name, opt);

        ret.atimeMs = ret.atime.getTime();
        ret.ctimeMs = ret.ctime.getTime();
        ret.mtimeMs = ret.mtime.getTime();

        return ret;
    }
    var orgunlinkSync = fs.unlinkSync.bind(fs);
    fs.unlinkSync = (old, ...params) => {
        var ret = orgunlinkSync(old, ...params);
        fs.fschanged(old, "rename");
        return ret;
    }

    var orgunlink = fs.unlink.bind(fs);
    fs.unlink = (old, cb) => {
        let ncb = () => {
            if (cb)
                cb();
            fs.fschanged(old, "rename");
        }
        return orgunlink(old, ncb);
    }

    var orgwriteFileSync = fs.writeFileSync.bind(fs);
    fs.writeFileSync = (path, ...params) => {
        var ret = orgwriteFileSync(path, ...params);
        fs.fschanged(path, "change");
        return ret;
    }

    var orgwriteFile = fs.writeFile.bind(fs);
    fs.writeFile = (path, data, opts, cb) => {
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
        appendFile: async (...args) => fs.appendFileSync(...args),
        link: async (...args) => fs.linkSync(...args),
        readdir: async (...args) => fs.readdirSync(...args),
        readFile: async (...args) => fs.readFileSync(...args),
        rename: async (...args) => fs.renameSync(...args),
        rmdir: async (...args) => fs.rmdirSync(...args),
        stat: async (...args) => fs.statSync(...args),
        unlink: async (...args) => fs.unlinkSync(...args),
        writeFile: async (...args) => fs.writeFileSync(...args)

    }

}

function getDirectory(path) {
    const sep = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return sep >= 0 ? path.slice(0, sep) : "";
}
function fileModule(file: string) {
    //let file=file.replace("./node_modules/", "/");
    if (globalfs) {
        if (globalfs.existsSync(file)) {
            if (globalfs.statSync(file).isFile())
                return globalfs.readFileSync(file);
        }
    }
    //let code=servermodules[file.replace("./node_modules/", "/")];
    //if (textExt.some(suffix => file.toLowerCase().endsWith(suffix)))
    //  code;
    return servermodules[file]?.content;
}
function fileCode(file: string) {
    if (globalfs === undefined)
        return undefined;

    if (globalfs.existsSync(file)) {
        if (globalfs.statSync(file).isFile())
            return globalfs.readFileSync(file);
    }
    return undefined;//.replace("./js/", "/")];
}
//resolve the relative Path against the parentPath
function resolve(relativePath: string, parentPath: string = "") {
    // if(relativePath==="jassijs/remote/Testlocalserver")
    //    debugger;
    var newPath = "";
    if (relativePath === "." || relativePath === ".." || relativePath.startsWith("./") || relativePath.startsWith("../")) {
        // Convert both paths into arrays
        const parentSegments = parentPath.split("/").slice(0, -1); // Remove filename
        const relSegments = relativePath.split("/");

        for (const segment of relSegments) {
            if (segment === ".") continue;
            if (segment === "..") {
                parentSegments.pop();
            } else {
                if (segment !== "")
                    parentSegments.push(segment);
            }
        }
        if (parentPath.startsWith("./node_modules"))
            newPath = parentSegments.join("/");
        else {

            newPath = parentSegments.join("/");
            if (!newPath.startsWith("./js/"))
                newPath = "./js/" + newPath;
        }
        if (fileModule(newPath + "/index.js") !== undefined) {
            newPath = newPath + "/index.js";
        } else if (fileModule(newPath + "index.js") !== undefined) {
            newPath = newPath + "index.js";
        }
        if (fileModule(newPath + ".js") !== undefined) {
            newPath = newPath + ".js";
        }
        if (fileCode(newPath + ".js") !== undefined) {
            newPath = newPath + ".js";
        }
        //if(fileModule(newPath))
        // if (!newPath.toLowerCase().endsWith(".js") && !newPath.toLowerCase().endsWith(".cjs"))
        //    newPath += ".js";
    } else {
        if (modulesshims[relativePath]) {
            newPath = modulesshims[relativePath];
        } else {
            var module = relativePath.split("/")[0];
            var config = fileModule("./node_modules/" + relativePath + "/package.json");
            if (config === undefined)
                config = fileModule("./node_modules/" + relativePath + "package.json");
            if (config && JSON.parse(config).main) {
                newPath = "./node_modules/" + module + "/" + JSON.parse(config).main.replace("./", "");
                if (fileModule(newPath) === undefined) {
                    newPath = "./node_modules/" + relativePath + "/" + JSON.parse(config).main.replace("./", "");
                }
                if (fileModule(newPath) === undefined && fileModule(newPath + "/index.js"))
                    newPath = newPath + "/index.js"
                if (!newPath.toLowerCase().endsWith(".js") && !newPath.toLowerCase().endsWith(".cjs"))
                    newPath += ".js";
            } else if (fileModule("./node_modules/" + relativePath + "/index.js")) {
                newPath = "./node_modules/" + relativePath + "/index.js";
            } else if (fileModule("./node_modules/" + relativePath)) {
                newPath = "./node_modules/" + relativePath;
            } else if (fileModule("./node_modules/" + relativePath + ".js")) {
                newPath = "./node_modules/" + relativePath + ".js";
            } else if (fileCode("./js/" + relativePath + ".js")) {
                newPath = "./js/" + relativePath + ".js";
            } else {
                if (relativePath !== 'perf_hooks' && relativePath !== 'pg') {
                    debugger;

                }
                throw new Error("module not found " + relativePath);

            }
        }
    }
    return newPath;
}
var testimport = {};
/**
 * like node require import a modul or js file
 * @param relativePath - the module or js-File to import
 * @param parentPath - the jsFile which ask the import
 * @param nocache - true if the import should be cached
 * @returns 
 */
function jrequire(relativePath: string, parentPath: string = "", nocache = false) {
    parentPath = parentPath.replaceAll("//", "/");

    // if (relativePath.startsWith("./NativeAdapter"))

    //   debugger;
    if (relativePath === "fs")
        return globalfs;
    if (relativePath === 'async_hooks')
        throw new Error("not implemented");
    if (relativePath === 'net')
        return { isIP() { throw new Error("not implemented") } };
    if (relativePath === "module") {
        return {
            globalPaths: ["./node_modules"],
            Module: {
                _nodeModulePaths: (...params) => { }
            }
        }
    }

    //console.log("req " + relativePath + " parent:" + parentPath);
    relativePath = relativePath.replaceAll("\`", "");//prevent injection
    var newPath = resolve(relativePath, parentPath);
    if (newPath.indexOf("//") !== -1)
        debugger;
    // if (newPath === './js/jassijs/server/NativeAdapter.js')
    //    debugger;

    if (!nocache && globalThis.modulecache[newPath])
        return globalThis.modulecache[newPath];

    // console.log("import "+newPath);
    if (testimport[newPath])
        debugger;
    testimport[newPath] = newPath;

    //console.log("load " + newPath + " parent:" + parentPath);
    globalThis.modulecache[newPath] = {};

    //console.log("load "+relativePath);
    var code = fileCode(newPath);
    if (code === undefined)
        code = fileModule(newPath);
    if (code === undefined) {
        if (newPath !== './node_modules/typescript/lib/node_modules/@microsoft/typescript-etw')
            debugger;
        var jjj = fileCode(newPath);
        throw Error("lib not found:" + newPath);

    }
    if (newPath === "./node_modules/browserfs/dist/browserfs.js") {
        code = code.replace("resolved = this.normalize", "resolved = path.normalize");//bug
        // code = code.replaceAll(" if ( arg2 === void 0 ) arg2 = {};", " if ( arg2 === void 0 || arg2===null) arg2 = {};") in fs.writeFile,fsreadFile,readFileSync if (opt===null) opt=undefined

    }
    if (newPath.toLowerCase().endsWith(".json"))
        ret = JSON.parse(code);
    else {
        var __dirname = getDirectory(newPath);

        //var scode = `(()=>{var {window,__dirname,__filename,global,exports,module,define,require}=_jrequire("` + newPath + `");` + code + "\r\n;return module.exports;})()";
        var scode = "/*" + newPath + "*/" + code + "\r\n;return module.exports;";
        //  if(scode.indexOf("normalizeOptions")>-1)
        //  scode = `(()=>{debugger;var {window,__dirname,__filename,global,exports,module,define,require}=_jrequire("` + newPath + `");` + code + "\r\n;return module.exports;})()";
        //scode=scode.replace(" if ( arg2 === void 0 ) arg2 = {};"," if ( arg2 === void 0 || args2===null) arg2 = {};")
        var ret;
        let req: any = (path) => globalThis.jrequire(path, newPath);
        req.resolve = (relpath) => { resolve(relpath, newPath) };
        req.cache = globalThis.modulecache;
        req.main = {
            require: (path) => globalThis.jrequire(path, "")
        }
        let module = { get exports() { return globalThis.modulecache[newPath]; }, set exports(val) { globalThis.modulecache[newPath] = val; } };
        let sdir = getDirectory(newPath);

        try {
            var fname = relativePath.replaceAll("/", "_").replaceAll(".", "_");
            var ob = {// [fname]so we we have the filename in debugging
                [fname]: new Function("window", "__dirname", "__filename", "global", "exports", "module", "define", "require", scode)
            }
            var ret = ob[fname](globalThis, sdir, newPath, globalThis, globalThis.modulecache[newPath], module, undefined, req);//so we we have the filename in debugging
        } catch (err) {

            console.log("error " + newPath + " parent:" + parentPath);
            //console.log(scode); 
            console.log(err);
            console.log(err.stack);
            debugger;
            globalThis.modulecache[newPath] = {};
            var ret = ob[fname](globalThis, sdir, newPath, globalThis, globalThis.modulecache[newPath], module, undefined, req);//so we we have the filename in debugging


            throw err;
        }
    }
    globalThis.modulecache[newPath] = ret;
    //Object.assign(modulecache[newPath], ret);
    //modulecache[newPath] = ret;//wegen constructor

    if (relativePath === "util") {
        function inherits(ctor, superCtor) {
            ctor.super_ = superCtor
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });;
        }

        globalThis.modulecache[newPath].inherits = inherits;

        //globalThis.modulecache[newPath].inherits=_jrequire("inherits");
    }
    if (relativePath === "http") {
        patchHTTP(globalThis.modulecache[newPath]);
    }
    if (relativePath === "process") {
        globalThis.modulecache[newPath].version = "v19.2.0";
        globalThis.modulecache[newPath].env = {};
    }



    return globalThis.modulecache[newPath];
}
globalThis.jrequire = jrequire;

var servercode;
var servermodules;
// Helper function to open (or create) an IndexedDB database and object store
function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            resolve(request.result);
        };

        // If database is newly created or version upgraded, create object store
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
}

// Async function to write a key-value pair to IndexedDB
async function writeIndexDB(dbName, storeName, key, value) {

    const db = await openDB(dbName, storeName);

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.put(value, key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Async function to read a value by key from IndexedDB
async function readIndexDB(dbName, storeName, key) {

    const db = await openDB(dbName, storeName);

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => reject(request.error);
    });
}
/*function getCodeFile(fsdata, file) {//read from BrowserFS.data
    let paths = file.split("/");
    var cur = { ".": "/" };
    for (let x = 0; x < paths.length; x++) {
        var folderid = cur[paths[x]];
        var id = new TextDecoder("utf-8").decode(fsdata[folderid]);
        id = id.substring(id.length - 36);
        if (x === paths.length - 1)
            return new TextDecoder("utf-8").decode(fsdata[id]);
        else
            cur = JSON.parse(new TextDecoder('utf8').decode(fsdata[id]));
    }
    return undefined;
}*/

async function runLocalServerIfNeeded() {
    //await new Promise(resolve => setTimeout(resolve, 10000));
    if (isinited)
        return;
    try {
        servermodules = await readIndexDB("jassijs", "server", "kernel");
    } catch (err) {
        console.log(err);
    }

    if (servermodules === undefined) {
        var npm = new Npm({
            "name": "jassijsserver",
            "version": "1.0.5",
            "description": "jassijsserver",
            "engines": {
                "node": "^12.x"
            },
            "dependencies": {
                "acorn-import-phases": "^1.0.4",
                "browserfs": "^1.4.3",
                "browserify": "^17.0.1",
            },
            "license": "MIT",
            "author": "Udo Weigelt",

        });
        //fs.writeFileSync("./package.json", pack);
        await npm.install();
        await writeIndexDB("jassijs", "server", "kernel", npm.files);
        servermodules = npm.files;
    }

    var code = JSON.parse(await (await fetch("http://localhost:4000/getcodechanges?2025-07-28T18:26:17.567Z")).text());
    // servercode = JSON.parse(await (await fetch("./jassijs/server/servercode.json")).text());
    /*let text = await (await fetch("./js/jassijs/remote/Testlocalserver.js")).text();
    servercode["js/jassijs/remote/Testlocalserver.js"] = text;
    text = await (await fetch("./js/jassijs/remote/Runlocalserver.js")).text();
    servercode["js/jassijs/remote/Runlocalserver.js"] = text;
    */

    var initialData: any = await readIndexDB("jassijs", "server", "files");
    var BrowserFS = await new Promise((resolve) => {
        const BrowserFS = jrequire("browserfs");

        globalThis.BrowserFS = BrowserFS;
        globalThis.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
        const path = jrequire('path');

        BrowserFS.configure({
            fs: "InMemory"
        }, function (err) {
            if (err) return console.error("Fehler beim Initialisieren:", err);
            console.log("init10");
            //writeIndexDB("jassijsservermodules","serverfiles",);
            globalThis.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
            globalThis.process = jrequire("process");

            const fs = BrowserFS.BFSRequire('fs');

            //initialize data 
            var vdata = fs.getRootFS().store.store;
            if (initialData) {
                Object.keys(vdata).forEach(key => delete vdata[key]);
                for (let key in initialData) {
                    var buf2 = globalThis.Buffer.from(initialData[key].buffer, initialData[key].byteOffset, initialData[key].byteLength);
                    initialData[key].buffer = buf2;
                    vdata[key] = buf2;
                }

            }

            globalfs = fs;
            patchFS(fs);

            for (let key in code) {
                let filepath = key;
                if (filepath.startsWith("."))
                    filepath = filepath.substring(1);
                if (filepath.startsWith("/"))
                    filepath = filepath.substring(1);
                filepath = "/" + filepath;
                let coding = 'utf8';
                if (code[key].coding)
                    coding = code[key].coding
                /// if (textExt.some(suffix => filepath.toLowerCase().endsWith(suffix)))
                //coding = "utf8";

                const dir = path.dirname(filepath);

                // Ordner erstellen, falls nicht vorhanden
                if (!fs.existsSync(dir)) {
                    try {
                        fs.mkdirSync(dir, { recursive: true }); // Unterstützt verschachtelte Ordner
                    } catch (err) {
                        console.log("error create folder " + dir, err)
                    }
                }
                try {
                    fs.writeFileSync(filepath, code[key].content, coding);
                } catch (err) {
                    console.log("error write file " + dir, err)
                }
            }

            //writeIndexDB("jassijs", "server", "files", vdata);
            // Test
            // debugger;
            if (fs.existsSync("./node_modules/pg"))
                fs.rmSync("./node_modules/pg", { recursive: true, force: true });
            if (fs.existsSync("./node_modules/pg"))
                debugger;
            // debugger;
            resolve(BrowserFS);
        });
    })

    isinited = true;
    console.log("virtual filesystem inited");
    console.log("run local server");

    var test = jrequire("jassijs/remote/Testlocalserver");
    //await test.testJSSQL();
    //await test.testExpress2();

    await test.test();
}
async function test() {
    await runLocalServerIfNeeded();
    return;
    var fs = jrequire("fs", "");
    //fs.writeFileSync("./test.js","var h=1;");
    var n = fs.readFileSync("./test.js", "utf8");
    //var scode = `var require=(path)=>_require(path,"servertest/run.js");` + code.content;
    //eval(scode);
    debugger;
}