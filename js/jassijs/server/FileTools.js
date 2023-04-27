"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticsecurefiles = exports.staticfiles = exports.syncRemoteFiles = void 0;
const fs = require("fs");
const Filesystem_1 = require("./Filesystem");
let resolve = require('path').resolve;
function copyFile(f1, f2) {
    try {
        if (fs.existsSync(f1) && f1.endsWith(".ts") && !fs.statSync(f1).isDirectory()) {
            if (!fs.existsSync(f2) || (fs.statSync(f1).mtimeMs > fs.statSync(f2).mtimeMs)) {
                console.log("sync " + f1 + "->" + f2);
                var dirname = require('path').dirname(f2);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }
                fs.copyFileSync(f1, f2);
            }
        }
    }
    catch (ex) {
        console.error(ex);
        debugger;
    }
}
/**
*  each remote file on server and client should be the same
*/
async function checkRemoteFiles() {
    var path = new Filesystem_1.default().path;
    var modules = JSON.parse(fs.readFileSync("./jassijs.json", 'utf-8')).modules;
    for (var m in modules) {
        var files = await new Filesystem_1.default().dirFiles("./" + m + "/remote", [".ts"]);
        var filess = await new Filesystem_1.default().dirFiles("./" + m + "/server", [".ts"]);
        for (let x = 0; x < filess.length; x++) {
            var file = filess[x];
            var code = fs.readFileSync(file, 'utf-8');
            if (code.indexOf("//synchronize-server-client") === 0)
                files.push(file);
        }
        for (let x = 0; x < files.length; x++) {
            var file = files[x];
            var clientfile = file.replace("./", path + "/");
            if (!fs.existsSync(clientfile)) {
                console.error(clientfile + " not exists");
            }
            else {
                if (fs.statSync(file).mtimeMs !== fs.statSync(clientfile).mtimeMs) {
                    if (fs.statSync(file).mtimeMs > fs.statSync(clientfile).mtimeMs) {
                        console.error(clientfile + " is not up to date " + file + " is newer");
                    }
                    else {
                        console.error(file + " is not up to date " + clientfile + " is newer");
                    }
                }
            }
        }
    }
}
function syncRemoteFiles() {
    /*await*/ checkRemoteFiles();
    //server remote
    var path = new Filesystem_1.default().path;
    fs.watch(path, { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && (paths[1] === "remote" || paths[1] === "server")) {
            setTimeout(() => {
                if (paths[1] === "server") {
                    var code = fs.readFileSync(file, 'utf-8');
                    if (code.indexOf("//synchronize-server-client") !== 0)
                        return;
                }
                var f2 = "./" + file;
                var f1 = path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    });
    //client remote
    fs.watch("./", { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && paths[1] === "remote" || paths[1] === "server") {
            setTimeout(() => {
                if (paths[1] === "server") {
                    var code = fs.readFileSync(file, 'utf-8');
                    if (code.indexOf("//synchronize-server-client") !== 0)
                        return;
                }
                var f1 = "./" + file;
                var f2 = path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    });
}
exports.syncRemoteFiles = syncRemoteFiles;
var modules = undefined;
function staticfiles(req, res, next) {
    if (modules === undefined)
        modules = JSON.parse(fs.readFileSync('./jassijs.json', 'utf-8')).modules;
    var path = new Filesystem_1.default().path;
    // console.log(req.path);
    let sfile = path + req.path;
    if (sfile.indexOf("Settings.ts") > -1) { //&&!passport.authenticate("jwt", { session: false })){
        next();
        return;
    }
    if (!fs.existsSync(sfile) && sfile.startsWith("./client")) {
        for (var key in modules) {
            if ((sfile.startsWith("./client/" + key) || sfile.startsWith("./client/js/" + key)) && fs.existsSync("./node_modules/" + key + "/client" + req.path)) {
                sfile = "./node_modules/" + key + "/client" + req.path;
                break;
            }
        }
        //sfile="./node_modules/_uw/"+req.path;
    }
    if (fs.existsSync(sfile)) {
        // let code=fs.readFileSync(this.path+"/"+req.path);
        let dat = fs.statSync(sfile).mtime.getTime();
        if (req.query.lastcachedate === dat.toString()) {
            res.set('X-Custom-UpToDate', 'true');
            res.send("");
        }
        else {
            res.sendFile(resolve(sfile), {
                headers: {
                    'X-Custom-Date': dat.toString(),
                    'Cache-Control': 'max-age=1',
                    'Last-Modified': fs.statSync(sfile).mtime.toUTCString()
                }
            });
        }
    }
    else {
        next();
    }
    var s = 1;
}
exports.staticfiles = staticfiles;
function staticsecurefiles(req, res, next) {
    if (modules === undefined)
        modules = JSON.parse(fs.readFileSync('./jassijs.json', 'utf-8')).modules;
    // console.log(req.path);
    let sfile = new Filesystem_1.default().path + req.path;
    if (sfile.indexOf("Settings.ts") > -1) { //&&!passport.authenticate("jwt", { session: false })){
        if (!req.isAuthenticated()) {
            res.send(401, 'not logged in');
            return;
        }
    }
    if (!fs.existsSync(sfile) && sfile.startsWith("./client")) {
        for (var key in modules) {
            if ((sfile.startsWith("./client/" + key) || sfile.startsWith("./client/js/" + key)) && fs.existsSync("./node_modules/" + key + "/client" + req.path)) {
                sfile = "./node_modules/" + key + "/client" + req.path;
                break;
            }
        }
    }
    if (fs.existsSync(sfile)) {
        // let code=fs.readFileSync(this.path+"/"+req.path);
        let dat = fs.statSync(sfile).mtime.getTime();
        if (req.query.lastcachedate === dat.toString()) {
            res.set('X-Custom-UpToDate', 'true');
            res.send("");
        }
        else {
            res.sendFile(resolve(sfile), {
                headers: { 'X-Custom-Date': dat.toString() }
            });
        }
    }
    else {
        next();
    }
    var s = 1;
}
exports.staticsecurefiles = staticsecurefiles;
//# sourceMappingURL=FileTools.js.map