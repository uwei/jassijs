"use strict";
var BrowserFS;
var process;
var Buffer;
class BrowserServerAppConfig {
    constructor() {
        this.name = "";
        this.initialfiles = {};
    }
}
class BrowserServerAppClass {
    constructor(appname) {
        this.name = "";
        this.isinited = undefined;
        this.config = {};
        this.requestHandler = undefined;
        this.modulecache = {};
        this.modulesshims = {
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
        };
        browserserverworker.activeApp = this;
        this.name = appname;
        browserserverworker.runningApps[appname] = this;
    }
    fileModule(file) {
        //let file=file.replace("./node_modules/", "/");
        if (this.globalfs) {
            if (this.globalfs.existsSync(file)) {
                if (this.globalfs.statSync(file).isFile())
                    return this.globalfs.readFileSync(file);
            }
        }
        //let code=browserserverworker.kernelmodules[file.replace("./node_modules/", "/")];
        //if (textExt.some(suffix => file.toLowerCase().endsWith(suffix)))
        //  code;
        return browserserverworker.kernelmodules[file]?.content;
    }
    fileCode(file) {
        if (this.globalfs === undefined)
            return undefined;
        if (this.globalfs.existsSync(file)) {
            if (this.globalfs.statSync(file).isFile())
                return this.globalfs.readFileSync(file);
        }
        return undefined; //.replace("./js/", "/")];
    }
    async gitClone(url, ref) {
        const fs = this.jrequire("fs");
        const fsneu = Object.assign({}, fs.promises);
        fsneu.mkdir = async (arg) => {
            fs.promises.mkdir(arg, { recursive: true });
        };
        const path = this.jrequire("path");
        const git = this.jrequire("isomorphic-git");
        const http = this.jrequire("isomorphic-git/http/web");
        var p = 7;
        /*var h1=await fetch("https://cdnjs.cloudflare.com/ajax/libs/tabulator/5.4.4/js/tabulator.min.js");
        var h=await fetch('https://github.com/uwei/jassijs.git/info/refs?service=git-upload-pack',{method:"GET",headers:{},body:undefined})
        h=await h.text();*/
        await git.clone({ fs: fsneu, http, dir: ".", url, ref, singleBranch: true, depth: 1, corsProxy: 'https://cors.isomorphic-git.org' });
        //await git.log({fs,dir:"./",depth:3});
    }
    async gitCheckout(url, ref) {
        const fs = this.jrequire("fs");
        const path = this.jrequire("path");
        const git = this.jrequire("isomorphic-git");
        const http = this.jrequire("isomorphic-git/http/node");
        await git.fetch({ fs, http, dir: ".", ref, singleBranch: true, corsProxy: 'https://cors.isomorphic-git.org' });
        await git.checkout({ fs, dir: ".", ref, force: true, corsProxy: 'https://cors.isomorphic-git.org' });
        //await git.log({fs,dir:"./",depth:3});
    }
    async gitupdate() {
        try {
            if (this.config.giturl === undefined)
                return;
            //var ii=8;
            const fs = this.jrequire("fs");
            if (!fs.existsSync("./.git")) {
                await this.gitClone(this.config.giturl, this.config.gitref || "main");
            }
            else {
                await this.gitCheckout(this.config.giturl, this.config.gitref || "main");
            }
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    //resolve the relative Path against the parentPath
    resolve(relativePath, parentPath = "") {
        // if(relativePath==="jassijs/remote/Testlocalserver")
        //    debugger;
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
                    if (segment !== "")
                        parentSegments.push(segment);
                }
            }
            if (parentPath.startsWith("./node_modules"))
                newPath = parentSegments.join("/");
            else {
                newPath = parentSegments.join("/");
                if (!newPath.startsWith("./js/")) //TODO analyze module-app path
                    newPath = "./js/" + newPath;
            }
            if (this.fileModule(newPath + "/index.js") !== undefined) {
                newPath = newPath + "/index.js";
            }
            else if (this.fileModule(newPath + "index.js") !== undefined) {
                newPath = newPath + "index.js";
            }
            if (this.fileModule(newPath + ".js") !== undefined) {
                newPath = newPath + ".js";
            }
            if (this.fileCode(newPath + ".js") !== undefined) {
                newPath = newPath + ".js";
            }
            //if(this.fileModule(newPath))
            // if (!newPath.toLowerCase().endsWith(".js") && !newPath.toLowerCase().endsWith(".cjs"))
            //    newPath += ".js";
        }
        else {
            if (this.modulesshims[relativePath]) {
                newPath = this.modulesshims[relativePath];
            }
            else {
                var module = relativePath.split("/")[0];
                var config = this.fileModule("./node_modules/" + relativePath + "/package.json");
                if (config === undefined)
                    config = this.fileModule("./node_modules/" + relativePath + "package.json");
                if (config && JSON.parse(config).main) {
                    newPath = "./node_modules/" + relativePath + "/" + JSON.parse(config).main.replace("./", "");
                    if (this.fileModule(newPath) === undefined) {
                        newPath = "./node_modules/" + module + "/" + JSON.parse(config).main.replace("./", "");
                    }
                    if (this.fileModule(newPath) === undefined && this.fileModule(newPath + "/index.js"))
                        newPath = newPath + "/index.js";
                    if (!newPath.toLowerCase().endsWith(".js") && !newPath.toLowerCase().endsWith(".cjs"))
                        newPath += ".js";
                }
                else if (this.fileModule("./node_modules/" + relativePath + "/index.js")) {
                    newPath = "./node_modules/" + relativePath + "/index.js";
                }
                else if (this.fileModule("./node_modules/" + relativePath)) {
                    newPath = "./node_modules/" + relativePath;
                }
                else if (this.fileModule("./node_modules/" + relativePath + ".js")) {
                    newPath = "./node_modules/" + relativePath + ".js";
                }
                else if (this.fileCode("./js/" + relativePath + ".js")) {
                    newPath = "./js/" + relativePath + ".js";
                }
                else {
                    if (relativePath !== 'perf_hooks' && relativePath !== 'pg') {
                        debugger;
                    }
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
    jrequire(relativePath, parentPath = "", nocache = false) {
        var _this = this;
        //console.log(relativePath);
        function getDirectory(path) {
            const sep = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
            return sep >= 0 ? path.slice(0, sep) : "";
        }
        parentPath = parentPath.replaceAll("//", "/");
        if (relativePath === "fs")
            return this.globalfs;
        if (relativePath === 'async_hooks')
            throw new Error("not implemented");
        if (relativePath === 'net')
            return { isIP() { throw new Error("not implemented"); } };
        if (relativePath === "module") {
            return {
                globalPaths: ["./node_modules"],
                Module: {
                    _nodeModulePaths: () => { }
                }
            };
        }
        //console.log("req " + relativePath + " parent:" + parentPath);
        relativePath = relativePath.replaceAll("\`", ""); //prevent injection
        var newPath = _this.resolve(relativePath, parentPath);
        if (newPath.indexOf("//") !== -1)
            newPath = newPath.replace("//", "/");
        if (!nocache && this.modulecache[newPath])
            return this.modulecache[newPath];
        //console.log("load " + newPath + " parent:" + parentPath);
        this.modulecache[newPath] = {};
        //console.log("load "+relativePath);
        var code = this.fileCode(newPath);
        if (code === undefined)
            code = this.fileModule(newPath);
        if (code === undefined) {
            if (newPath !== './node_modules/typescript/lib/node_modules/@microsoft/typescript-etw')
                debugger;
            var jjj = this.fileCode(newPath);
            throw Error("lib not found:" + newPath);
        }
        if (newPath === "./node_modules/browserfs/dist/browserfs.js") {
            code = code.replace("resolved = this.normalize", "resolved = path.normalize"); //bug
            // code = code.replaceAll(" if ( arg2 === void 0 ) arg2 = {};", " if ( arg2 === void 0 || arg2===null) arg2 = {};") in fs.writeFile,fsreadFile,readFileSync if (opt===null) opt=undefined
        }
        if (newPath.toLowerCase().endsWith(".json"))
            ret = JSON.parse(code);
        else {
            //var scode = `(()=>{var {window,__dirname,__filename,global,exports,module,define,require}=_jrequire("` + newPath + `");` + code + "\r\n;return module.exports;})()";
            var scode = "/*" + newPath + "*/" + code + "\r\n;return module.exports;";
            //  if(scode.indexOf("normalizeOptions")>-1)
            //  scode = `(()=>{debugger;var {window,__dirname,__filename,global,exports,module,define,require}=_jrequire("` + newPath + `");` + code + "\r\n;return module.exports;})()";
            //scode=scode.replace(" if ( arg2 === void 0 ) arg2 = {};"," if ( arg2 === void 0 || args2===null) arg2 = {};")
            var ret;
            let req = (path) => _this.jrequire(path, newPath);
            req.resolve = (relpath) => { _this.resolve(relpath, newPath); };
            req.cache = this.modulecache;
            req.main = {
                require: (path) => _this.jrequire(path, "")
            };
            var mc = this.modulecache;
            let module = { get exports() { return mc[newPath]; }, set exports(val) { mc[newPath] = val; } };
            let sdir = getDirectory(newPath);
            var ob;
            var fname = relativePath.replaceAll("/", "_").replaceAll(".", "_");
            if (fname.indexOf("isFsReadStream") !== -1)
                debugger;
            try {
                let containsDefine = code.indexOf("const define") !== -1 || code.indexOf("var define") !== -1 || code.indexOf("let define") !== -1, ob = {
                    [fname]: new Function("window", "__dirname", "__filename", "global", "exports", "module", (containsDefine ? "define1" : "define"), "require", scode)
                };
                var ret = ob[fname](globalThis, sdir, newPath, globalThis, mc[newPath], module, undefined, req); //so we we have the filename in debugging
            }
            catch (err) {
                console.log("error " + newPath + " parent:" + parentPath);
                //console.log(scode); 
                console.log(err);
                console.log(err.stack);
                debugger;
                this.modulecache[newPath] = {};
                var ret = ob[fname](globalThis, sdir, newPath, globalThis, this.modulecache[newPath], module, undefined, req); //so we we have the filename in debugging
                throw err;
            }
        }
        this.modulecache[newPath] = ret;
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
            this.modulecache[newPath].inherits = inherits;
        }
        if (relativePath === "http") {
            browserserverworker.patchHTTP(this.modulecache[newPath], this.jrequire.bind(this), this);
        }
        if (relativePath === "process") {
            this.modulecache[newPath].version = "v19.2.0";
            this.modulecache[newPath].env = {};
        }
        return this.modulecache[newPath];
    }
    // Async function to read a value by key from IndexedDB
    static getCodeFileIntern(fsdata, file) {
        let paths = file.split("/");
        var cur = { ".": "/" };
        for (let x = 0; x < paths.length; x++) {
            var folderid = cur[paths[x]];
            var id = new TextDecoder("utf-8").decode(fsdata[folderid]);
            id = id.substring(id.length - 36);
            if (x === paths.length - 1)
                return new TextDecoder("utf-8").decode(fsdata[id]);
            else {
                let t = new TextDecoder('utf8').decode(fsdata[id]);
                if (t === "" || t === undefined)
                    return undefined;
                cur = JSON.parse(t);
            }
        }
        return undefined;
    }
    async loadKerlenModulesIfNeeded() {
        if (browserserverworker.kernelmodules === undefined) {
            try {
                browserserverworker.kernelmodules = await browserserverworker.readIndexDB("browserserver", "[system]", "kernel");
            }
            catch (err) {
                console.log(err);
            }
            if (browserserverworker.kernelmodules === undefined) {
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
                        "readable-stream": "^3.6.0",
                        "isomorphic-git": "^1.32.1"
                    },
                    "license": "MIT",
                    "author": "Udo Weigelt",
                });
                //fs.writeFileSync("./package.json", pack);
                await npm.install();
                await browserserverworker.writeIndexDB("browserserver", "[system]", "kernel", npm.files);
                browserserverworker.kernelmodules = npm.files;
            }
        }
    }
    async npminstall(modul = undefined, packageHasChanged = true) {
        const fs = this.jrequire("fs");
        const path = this.jrequire('path');
        let pack = undefined;
        let existsPackage = fs.existsSync("./package.json");
        if (modul === undefined && !existsPackage) //noting todo
            return;
        if (modul !== undefined && !existsPackage) {
            let dummy = {
                "name": this.name,
                "version": "1.0.0"
            };
            fs.writeFileSync("./package.json", JSON.stringify(dummy));
            packageHasChanged = true;
        }
        if (packageHasChanged === false)
            return;
        var config = fs.readFileSync("./package.json", "utf8");
        var npm = new Npm(JSON.parse(config));
        //{ content: new TextEncoder().encode(json) };
        //initialize packages
        let oldModules = {};
        if (fs.existsSync("./node_modules")) {
            let files = fs.readdirSync("./node_modules");
            for (let x = 0; x < files.length; x++) {
                let mod = files[x];
                oldModules[mod] = true;
                if (fs.statSync("./node_modules/" + mod).isDirectory()) {
                    if (fs.existsSync("./node_modules/" + mod + "/package.json")) {
                        let code = fs.readFileSync("./node_modules/" + mod + "/package.json", "utf8");
                        npm.files[files[x]] = { content: code };
                    }
                }
            }
        }
        await npm.install();
        if (modul) {
            await npm.installModul(modul);
        }
        //remove old
        for (let key of npm.installedModules) {
            if (oldModules[key] !== undefined) {
                fs.rmSync("./node_modules/" + key, { recursive: true });
            }
        }
        for (let key in npm.files) {
            let file = npm.files[key];
            let dir = path.dirname(key);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            var data = file.content;
            if (data.buffer)
                data = globalThis.Buffer.from(data.buffer, data.byteOffset, data.byteLength);
            //initialData[key].buffer = buf2; // buffer$$1.copy is not a function
            fs.writeFileSync(key, data);
        }
        await this.saveFiles();
        //npm.files
    }
    async _checkHasModified() {
        //@ts-ignore
        if (this.config.hasModified) {
            let path = this.jrequire('path');
            let fs = this.jrequire('fs');
            var oldpackagecode = undefined;
            if (!fs.existsSync("./package.json")) {
                try {
                    oldpackagecode = JSON.stringify(JSON.parse(fs.readFileSync("./package.json", "utf8")));
                }
                catch {
                    oldpackagecode = "old changed";
                }
            }
            if (this.config.giturl) {
                await this.gitupdate();
            }
            if (this.config.initialfiles) {
                if (typeof this.config.initialfiles === "string") {
                    this.config.initialfiles = JSON.parse(await (await fetch(this.config.initialfiles)).text());
                }
                let code = this.config.initialfiles;
                for (let key in code) {
                    let filepath = key;
                    if (filepath.startsWith("."))
                        filepath = filepath.substring(1);
                    if (filepath.startsWith("/"))
                        filepath = filepath.substring(1);
                    filepath = "./" + filepath;
                    let coding = 'utf8';
                    if (code[key].coding)
                        coding = code[key].coding;
                    /* if (filepath === "./package.json") {
                         if (!fs.existsSync(filepath)) {
                             try {
                                 let s1 = JSON.stringify(JSON.parse(fs.readFileSync(filepath, "utf8")));
                                 let s2 = JSON.stringify(JSON.parse(code[key].content));
                                 if (s1 !== s2) {
                                     packageHasChanged = true;
                                 }
                             } catch (err) {
                                 console.log(err);
                                 packageHasChanged = true;
                             }
                         }
                     }*/
                    /// if (textExt.some(suffix => filepath.toLowerCase().endsWith(suffix)))
                    //coding = "utf8";
                    const dir = path.dirname(filepath);
                    if (filepath.indexOf("/constructor/") !== -1) {
                        continue; //BrowserFS kould not save this files
                    }
                    // Ordner erstellen, falls nicht vorhanden
                    if (!fs.existsSync(dir)) {
                        try {
                            fs.mkdirSync(dir, { recursive: true }); // Unterstützt verschachtelte Ordner
                        }
                        catch (err) {
                            console.log("error create folder " + dir, err);
                        }
                    }
                    try {
                        fs.writeFileSync(filepath, code[key].content, coding);
                    }
                    catch (err) {
                        console.log("error write file " + dir, err);
                    }
                }
                this.config.initialfiles = undefined; //initialfiles are now in filesystem - so we kann remove it
                //@ts-ignore
                this.config.hasModified = undefined;
                browserserverworker.writeIndexDB("browserserver", this.name, "config", this.config);
                this.saveFiles();
                //trigger save
            }
            var newpackagecode;
            if (!fs.existsSync("./package.json")) {
                try {
                    newpackagecode = JSON.stringify(JSON.parse(fs.readFileSync("./package.json", "utf8")));
                }
                catch {
                    newpackagecode = "new changed";
                }
            }
            var packageHasChanged = (newpackagecode !== oldpackagecode);
            await this.npminstall(undefined, packageHasChanged);
            //changeFileWhichRegisterServiceworker
        }
        return true;
    }
    async sendToClients(msg) {
        var clients = await self.clients.matchAll();
        clients.forEach((client) => {
            client.postMessage({ msg: msg });
        });
    }
    async saveFiles() {
        let fs = this.jrequire('fs');
        await browserserverworker.writeIndexDB("browserserver", this.name, "files", fs.getRootFS().store.store); //save Memory filesystem in indexdb
    }
    async runLocalServerIfNeeded() {
        //await new Promise(resolve => setTimeout(resolve, 10000));
        if (this.isinited)
            return await this.isinited;
        let resolve = undefined;
        this.isinited = new Promise((res) => resolve = res);
        await this.loadKerlenModulesIfNeeded();
        this.config = await browserserverworker.readIndexDB("browserserver", this.name, "config");
        if (this.config === undefined) {
            throw new Error("App not found " + this.name);
        }
        /*var code:any=undefined;
        
        //var code = JSON.parse(await (await fetch("http://localhost:4000/getcodechanges?2025-07-28T18:26:17.567Z")).text());#
        var code = <any>{
            "./js/index.js": {
                content: `
        const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // Antwort senden
  res.end("Hallo");
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server läuft auf http://localhost:"+PORT);
});
`    }
        };*/
        var oldServiceworkerCode = undefined;
        var _this = this;
        var initialData = await browserserverworker.readIndexDB("browserserver", this.name, "files");
        var BrowserFS = await new Promise((resolve) => {
            const BrowserFS = this.jrequire("browserfs");
            globalThis.BrowserFS = BrowserFS;
            globalThis.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
            const path = _this.jrequire('path');
            BrowserFS.configure({
                fs: "InMemory"
            }, function (err) {
                if (err)
                    return console.error("Fehler beim Initialisieren:", err);
                globalThis.process = _this.jrequire("process");
                const fs = BrowserFS.BFSRequire('fs');
                if (_this.config.serviceworkerfile && fs.existsSync(_this.config.serviceworkerfile))
                    oldServiceworkerCode = fs.readFileSync(_this.config.serviceworkerfile, "utf8");
                //initialize data 
                var vdata = fs.getRootFS().store.store;
                if (initialData) {
                    Object.keys(vdata).forEach(key => delete vdata[key]);
                    for (let key in initialData) {
                        var buf2 = globalThis.Buffer.from(initialData[key].buffer, initialData[key].byteOffset, initialData[key].byteLength);
                        //initialData[key].buffer = buf2; // buffer$$1.copy is not a function
                        vdata[key] = buf2;
                    }
                }
                _this.globalfs = fs;
                browserserverworker.patchFS(fs, _this.jrequire.bind(_this), _this);
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
        });
        await _this._checkHasModified();
        console.log("virtual filesystem inited");
        // let startserver=true;
        if (this.config?.serviceworkerfile) {
            const fs = this.globalfs;
            let code = fs.readFileSync(this.config?.serviceworkerfile, "utf8");
            if (code !== oldServiceworkerCode) {
                this.sendToClients("serviceworkercode has changed");
                // startserver=false;
                //return false;
            }
        }
        if (this.config?.main) {
            console.log("run local server");
            //  if(!this.globalfs.existsSync(this.config.main))
            //    throw new Error("Config main "+this.config?.main+" does not exists");
            _this.jrequire(this.config?.main);
            //wait for first server
            while (this.requestHandler === undefined || Object.keys(this.requestHandler).length === 0) {
                await new Promise((res) => setTimeout(res, 100));
            }
        }
        //if (startserver)
        this.sendToClients("serviceworker has started");
        resolve(1);
        //await test.testJSSQL();
        //await test.testExpress2();
        //    await test.test();
    }
}
//# sourceMappingURL=browserserverapp.js.map