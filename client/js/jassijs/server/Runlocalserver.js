globalThis.modulecache = {};
const textExt = ["js", "ts", "cfg", "xml", "json", "txt", "css", "map", "md", "npmignore", "nycrc", "css", "scss", "yml"];
globalThis._jrequire = (file) => {
    var ret = {
        __dirname: getDirectory(file),
        __filename: file,
        global: globalThis,
        exports: globalThis.modulecache[file],
        module: { get exports() { return globalThis.modulecache[file]; }, set exports(val) { globalThis.modulecache[file] = val; } },
        define: undefined,
        require: (path) => globalThis.jrequire(path, file)
    };
    ret.require.resolve = (relpath) => { resolve(relpath, file); };
    return ret;
};
function patchNodeFunction() {
    const originalSetInterval = globalThis.setInterval;
    globalThis.setInterval = (...args) => {
        var ret = new Number(originalSetInterval(...args));
        ret.unref = () => true;
        return ret;
    };
    globalThis.setImmediate = (proc, ...params) => {
        // debugger;
        proc();
    };
}
patchNodeFunction();
function activateProxy() {
    navigator.serviceWorker.controller.postMessage({
        type: 'ACTIVATE_PROXY',
        url: "http://localhost:3000"
    });
    navigator.serviceWorker.addEventListener("message", (evt) => {
        var _b, _c;
        var _a;
        if (((_b = evt.data) === null || _b === void 0 ? void 0 : _b.type) === "REQUEST_PROXY") {
            var req = JSON.parse(evt.data.data);
            var server = jrequire("http").serverListening[3000];
            server.doRequest(req, new (jrequire("http").ServerResponse)());
            debugger;
            navigator.serviceWorker.controller.postMessage({ type: 'RESPONSE_PROXY', id: (_c = evt.data) === null || _c === void 0 ? void 0 : _c.id, data: "msg" });
        }
    });
    const script = document.createElement('script');
    script.src = "./bundle.js";
    document.head.appendChild(script);
}
var modulesshims = {
    "fs": "./node_modules/browserfs/dist/shims/fs.js",
    //    "buffer": "./node_modules/browserfs/dist/shims/bufferGlobal.js",
    "buffer": "./node_modules/buffer/index.js",
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
};
var isinited = false;
function patchFS(fs) {
    var orgreaddirSync = fs.readdirSync;
    fs.readdirSync = (pfad, options) => {
        const names = orgreaddirSync(pfad, options);
        return names.map(name => {
            const fullPath = pfad + "/" + name;
            const stat = fs.statSync(fullPath);
            return {
                name,
                path: fullPath,
                isFile: () => stat.isFile(),
                isDirectory: () => stat.isDirectory()
            };
        });
    };
    var orgmkdirSync = fs.mkdirSync;
    fs.mkdirSync = (pfad, options) => {
        if (options === null || options === void 0 ? void 0 : options.recursive) {
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
                        return ret;
                }
            }
        }
    };
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
            }
            catch (err) {
                console.error("⚠️ Fehler beim Schreiben:", err);
            }
            originalEnd(...args);
        };
        return writable;
    };
}
function getDirectory(path) {
    const sep = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return sep >= 0 ? path.slice(0, sep) : "";
}
function fileModule(file) {
    //let code=servermodules[file.replace("./node_modules/", "/")];
    //if (textExt.some(suffix => file.toLowerCase().endsWith(suffix)))
    //  code;
    return servermodules[file.replace("./node_modules/", "/")];
}
function fileCode(file) {
    return servercode[file.replace("./", "")]; //.replace("./js/", "/")];
}
//resolve the relative Path against the parentPath
function resolve(relativePath, parentPath = "") {
    var newPath = "";
    if (relativePath === "." || relativePath === ".." || relativePath.startsWith("./") || relativePath.startsWith("../")) {
        // Convert both paths into arrays
        const parentSegments = parentPath.split("/").slice(0, -1); // Remove filename
        const relSegments = relativePath.split("/");
        for (const segment of relSegments) {
            if (segment === ".")
                continue;
            if (segment === "..") {
                parentSegments.pop();
            }
            else {
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
        }
        else if (fileModule(newPath + "index.js") !== undefined) {
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
    }
    else {
        if (modulesshims[relativePath]) {
            newPath = modulesshims[relativePath];
        }
        else {
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
                    newPath = newPath + "/index.js";
                if (!newPath.toLowerCase().endsWith(".js") && !newPath.toLowerCase().endsWith(".cjs"))
                    newPath += ".js";
            }
            else if (fileModule("./node_modules/" + relativePath + "/index.js")) {
                newPath = "./node_modules/" + relativePath + "/index.js";
            }
            else if (fileModule("./node_modules/" + relativePath)) {
                newPath = "./node_modules/" + relativePath;
            }
            else if (fileModule("./node_modules/" + relativePath + ".js")) {
                newPath = "./node_modules/" + relativePath + ".js";
            }
            else if (fileCode("./js/" + relativePath + ".js")) {
                newPath = "./js/" + relativePath + ".js";
            }
            else {
                debugger;
                throw new Error("module not found " + relativePath);
            }
        }
    }
    return newPath;
}
/**
 * like node require import a modul or js file
 * @param relativePath - the module or js-File to import
 * @param parentPath - the jsFile which ask the import
 * @param nocache - true if the import should be cached
 * @returns
 */
function jrequire(relativePath, parentPath = "", nocache = false) {
    if (relativePath === 'async_hooks')
        throw new Error("not implemented");
    if (relativePath === 'net')
        return { isIP() { throw new Error("not implemented"); } };
    if (relativePath === "module") {
        return {
            globalPaths: ["./node_modules"]
        };
    }
    //if (relativePath === '..')
    //   debugger;
    //console.log("req " + relativePath + " parent:" + parentPath);
    relativePath = relativePath.replaceAll("\`", ""); //prevent injection
    var newPath = resolve(relativePath, parentPath);
    if (!nocache && globalThis.modulecache[newPath])
        return globalThis.modulecache[newPath];
    //console.log("load " + newPath + " parent:" + parentPath);
    globalThis.modulecache[newPath] = {};
    //console.log("load "+relativePath);
    var code = fileCode(newPath);
    if (code === undefined)
        code = fileModule(newPath);
    if (code === undefined) {
        debugger;
        var jjj = fileCode(newPath);
        throw Error("lib not found:" + newPath);
    }
    if (newPath === "./node_modules/browserfs/dist/browserfs.js") {
        code = code.replace("resolved = this.normalize", "resolved = path.normalize"); //bug
    }
    if (newPath.toLowerCase().endsWith(".json"))
        ret = JSON.parse(code);
    else {
        var __dirname = getDirectory(newPath);
        // var scode = `(()=>{var __dirname="` + __dirname + `";var __filename="`+newPath+`";var global=globalThis;var exports=globalThis.modulecache["` + newPath + `"];module={get exports(){return globalThis.modulecache["` + newPath + `"];},set exports(val){globalThis.modulecache["` + newPath + `"]=val;}};/*no amd!*/var define=undefined;var require=(path)=>globalThis._jrequire(path,"` + newPath + `");` + code + "\r\n;return module.exports;})()";
        var scode = `(()=>{var {__dirname,__filename,global,exports,module,define,require}=_jrequire("` + newPath + `");` + code + "\r\n;return module.exports;})()";
        var ret;
        try {
            var fname = relativePath.replaceAll("/", "_").replaceAll(".", "_");
            var ob = {
                [fname]: () => ret = eval(scode)
            };
            ob[fname](); //so we we have the filename in debugging
        }
        catch (err) {
            delete globalThis.modulecache[newPath];
            console.log("error " + newPath + " parent:" + parentPath);
            console.log(scode);
            debugger;
            ret = eval("debugger;" + scode);
            throw err;
        }
    }
    globalThis.modulecache[newPath] = ret;
    //Object.assign(modulecache[newPath], ret);
    //modulecache[newPath] = ret;//wegen constructor
    if (relativePath === "util") {
        function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            ;
        }
        globalThis.modulecache[newPath].inherits = inherits;
        //globalThis.modulecache[newPath].inherits=_jrequire("inherits");
    }
    if (relativePath === "http") {
        patchHTTP(globalThis.modulecache[newPath]);
    }
    return globalThis.modulecache[newPath];
}
globalThis.jrequire = jrequire;
var servercode;
var servermodules;
/*
const path = require("path");
 
function _jrequire(relativePath, parentPath) {
  const parentDir = path.dirname(parentPath);
  const resolvedPath = path.resolve(parentDir, relativePath);
  return resolvedPath;
}*/
async function runLocalServerIfNeeded() {
    if (isinited)
        return;
    servercode = JSON.parse(await (await fetch("./jassijs/server/servercode.json")).text());
    servermodules = JSON.parse(await (await fetch("./jassijs/server/servermodules.json")).text());
    var BrowserFS = await new Promise((resolve) => {
        const BrowserFS = jrequire("browserfs");
        globalThis.BrowserFS = BrowserFS;
        class MyNodeModulesFS {
            constructor() {
                this._ready = Promise.resolve(this);
                // Weitere Methoden wie readdir, mkdir, unlink etc. kannst du ebenfalls definieren
            }
            get metadata() {
                return {
                    name: this.constructor.name,
                    readonly: false,
                    synchronous: false,
                    supportsProperties: false,
                    supportsLinks: false,
                    totalSpace: 0,
                    freeSpace: 0,
                };
            }
            whenReady() {
                return this._ready;
            }
            async openFile(p, flag, cred) {
                throw new Error();
            }
            async createFile(p, flag, mode, cred) {
                throw new Error();
            }
            async open(p, flag, mode, cred) {
                throw new Error();
            }
            static Create(...params) {
                params[1](null, new MyNodeModulesFS());
                //    return  Promise.resolve(this);;
            }
            getName() {
                return "MyNodeModulesFS";
            }
            isReadOnly() {
                return false;
            }
            supportsSynch() {
                return true;
            }
            existsSync(path) {
                return (servermodules[path] !== undefined);
            }
            readFile(path, encoding, flag, cb) {
                try {
                    cb(this.readFileSync(path, encoding, flag));
                }
                catch (err) {
                    cb(err);
                }
            }
            writeFile(path, data, encoding, flag, cb) {
                servermodules[path] = data;
                cb(null);
            }
            readFileSync(path, encoding, flag) {
                let coding = 'base64';
                if (textExt.some(suffix => path.toLowerCase().endsWith(suffix)))
                    coding = "utf8";
                if (coding === "base64" && encoding === null) {
                    const buffer = globalThis.Buffer.from(servermodules[path], 'base64');
                    return buffer;
                }
                if (coding !== encoding)
                    throw new Error("not implemented");
                if (servermodules[path]) {
                    return servermodules[path];
                }
                throw new Error("Datei nicht gefunden");
            }
            // ⚡️ Synchron schreiben
            writeFileSync(path, data, encoding, flag) {
                servermodules[path] = data;
            }
        }
        MyNodeModulesFS.Name = 'InMemory';
        MyNodeModulesFS.Options = {};
        BrowserFS.FileSystem.MyNodeModulesFS = MyNodeModulesFS;
        BrowserFS.configure({
            fs: "MountableFileSystem",
            options: {
                // Hauptpfad mit AsyncMirror (IndexedDB + InMemory)
                "/": {
                    fs: "AsyncMirror",
                    options: {
                        sync: { fs: "InMemory" },
                        async: {
                            fs: "IndexedDB",
                            options: {
                                storeName: "jassijsserver"
                            }
                        }
                    }
                },
                // Zweiter zusätzlicher Sync-Pfad /js1 (auch reiner InMemory)
                "/node_modules": {
                    fs: "MyNodeModulesFS"
                }
            }
        }, function (err) {
            if (err)
                return console.error("Fehler beim Initialisieren:", err);
            globalThis.Buffer = jrequire("buffer").Buffer;
            globalThis.process = jrequire("process");
            const fs = BrowserFS.BFSRequire('fs');
            patchFS(fs);
            const path = jrequire('path');
            for (let key in servercode) {
                let filepath = key;
                let coding = 'base64';
                if (textExt.some(suffix => filepath.toLowerCase().endsWith(suffix)))
                    coding = "utf8";
                const dir = path.dirname(filepath);
                // Ordner erstellen, falls nicht vorhanden
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true }); // Unterstützt verschachtelte Ordner
                }
                fs.writeFileSync(filepath, servercode[key], coding);
            }
            // Test
            // fs.writeFileSync("/test.txt","d1")
            // const stream = fs.createWriteStream('/test.txt');
            // stream.write("Hallo ");
            // stream.write("Stream-Welt!");
            // stream.end();
            // var h=fs.readFileSync("/test.txt","utf8")
            resolve(BrowserFS);
            activateProxy();
        });
    });
    isinited = true;
    console.log("virtual filesystem inited");
    var test = jrequire("jassijs/server/Testlocalserver");
    await test.testPDF();
}
class Server {
    constructor() {
    }
    get(url, func) {
        debugger;
    }
    //listen(port:number,hostname:string,backlog:number,callback:()=>void){
    listen(port, callback) {
        this.port = port;
        //  this.hostname=hostname;
        //this.backlog=backlog;
        this.callback = callback;
        var lib = jrequire("http");
        lib.serverListening[port] = this;
        if (callback)
            callback();
        return {};
    }
    doRequest(req, res) {
        this.requestListener(req, res, () => 1);
    }
}
class ServerResponse {
    constructor() {
        this.statusCode = 200;
        this.headers = {};
        this.bodyChunks = [];
        this.finished = false;
        this._onFinish = null;
    }
    writeHead(statusCode, maybeHeaders = {}) {
        this.statusCode = statusCode;
        this.headers = Object.assign(Object.assign({}, this.headers), maybeHeaders);
    }
    setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
    }
    getHeader(name) {
        return this.headers[name.toLowerCase()];
    }
    write(chunk, encoding = 'utf-8') {
        if (this.finished)
            throw new Error('Cannot write after end');
        if (typeof chunk === 'string') {
            this.bodyChunks.push(Buffer.from(chunk, encoding).toString());
        }
        else if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk)) {
            this.bodyChunks.push(chunk.toString(encoding));
        }
        else {
            throw new Error('Unsupported chunk type');
        }
    }
    end(chunk = '', encoding = 'utf-8') {
        if (this.finished)
            return;
        if (chunk)
            this.write(chunk, encoding);
        this.finished = true;
        const fullBody = this.bodyChunks.join('');
        console.log('📦 Full Response Body:\n' + fullBody);
        if (typeof this._onFinish === 'function') {
            this._onFinish(this);
        }
    }
    on(event, callback) {
        if (event === 'finish') {
            this._onFinish = callback;
        }
    }
    toJSON() {
        return {
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.bodyChunks.join(''),
        };
    }
}
function patchHTTP(ob) {
    ob.ServerResponse = ServerResponse;
    ob.serverListening = {};
    ob.createServer = (requestListener) => {
        var ret = new Server();
        ret.requestListener = requestListener;
        return ret;
    };
    ob.STATUS_CODES = {
        100: 'Continue',
        101: 'Switching Protocols',
        102: 'Processing',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        307: 'Temporary Redirect',
        308: 'Permanent Redirect',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Payload Too Large',
        414: 'URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable',
        417: 'Expectation Failed',
        418: "I'm a Teapot",
        422: 'Unprocessable Entity',
        425: 'Too Early',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        451: 'Unavailable For Legal Reasons',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        507: 'Insufficient Storage',
        511: 'Network Authentication Required'
    };
    ob.METHODS = [
        'ACL',
        'BIND',
        'CHECKOUT',
        'CONNECT',
        'COPY',
        'DELETE',
        'GET',
        'HEAD',
        'LINK',
        'LOCK',
        'M-SEARCH',
        'MERGE',
        'MKACTIVITY',
        'MKCALENDAR',
        'MKCOL',
        'MOVE',
        'NOTIFY',
        'OPTIONS',
        'PATCH',
        'POST',
        'PROPFIND',
        'PROPPATCH',
        'PURGE',
        'PUT',
        'REBIND',
        'REPORT',
        'SEARCH',
        'SOURCE',
        'SUBSCRIBE',
        'TRACE',
        'UNBIND',
        'UNLINK',
        'UNLOCK',
        'UNSUBSCRIBE'
    ];
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
//# sourceMappingURL=Runlocalserver.js.map