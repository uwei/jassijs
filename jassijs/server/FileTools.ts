import fs = require('fs');
import Filesystem from './Filesystem';
import { config } from 'jassijs/remote/Config';
let resolve = require('path').resolve;


function copyFile(f1: string, f2: string) {
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

    } catch (ex) {
        console.error(ex);
        debugger;
    }
}
/**
*  each remote file on server and client should be the same
*/
async function checkRemoteFiles() {

    var path = new Filesystem().path;
    var modules = config.server.modules;
    for (var m in modules) {
        var files = await new Filesystem().dirFiles("./" + m + "/remote", [".ts"]);
        var filess = await new Filesystem().dirFiles("./" + m + "/server", [".ts"]);
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
            } else {
                if (fs.statSync(file).mtimeMs !== fs.statSync(clientfile).mtimeMs) {
                    if (fs.statSync(file).mtimeMs > fs.statSync(clientfile).mtimeMs) {
                        console.error(clientfile + " is not up to date " + file + " is newer");
                    } else {
                        console.error(file + " is not up to date " + clientfile + " is newer");
                    }
                }
            }
        }

    }
}

export function syncRemoteFiles() {
/*await*/checkRemoteFiles();
    //server remote
    var path = new Filesystem().path;
    fs.watch(path, { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && (paths[1] === "remote" || paths[1] === "server")) {
            setTimeout(() => {
                if (paths[1] === "server") {
                    if (fs.existsSync(file) && !fs.statSync(file).isDirectory()) {
                        var code = fs.readFileSync(file, 'utf-8');
                        if (code.indexOf("//synchronize-server-client") !== 0)
                            return;
                    }
                }
                var f2 = "./" + file;
                var f1 = path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    })
    //client remote
    fs.watch("./", { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && paths[1] === "remote" || paths[1] === "server") {
            setTimeout(() => {
                if (paths[1] === "server") {
                    if (fs.existsSync(file) && !fs.statSync(file).isDirectory()) {
                        var code = fs.readFileSync(file, 'utf-8');
                        if (code.indexOf("//synchronize-server-client") !== 0)
                            return;
                    }
                }
                var f1 = "./" + file;
                var f2 = path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    })
}
var modules = undefined;
var runServerInBrowser = undefined;
export function staticfiles(req, res, next) {
    var path = new Filesystem().path;
    var modules = config.server.modules;
    // console.log(req.path);
    let sfile = path + req.path;
   /* if (req?.query?.server === "1") {
        if (runServerInBrowser === undefined)
            runServerInBrowser = JSON.parse(fs.readFileSync("./client/jassijs.json", "utf8")).runServerInBrowser;

        var found = undefined;
        for (var key in modules) {
            if ((req.path.startsWith("/" + key + "/") || req.path.startsWith("/js/" + key)) && fs.existsSync("./" + req.path)) {
                found = "." + req.path;
                break;
            }
        }


        if (found === undefined || runServerInBrowser !== true) {
            console.log("not allowed");
            next();
            return;
        } else
            sfile = found;
    }*/

    if (sfile.indexOf("Settings.ts") > -1) {//&&!passport.authenticate("jwt", { session: false })){
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
        } else {
            res.sendFile(resolve(sfile), {

                headers: {
                    'X-Custom-Date': dat.toString(),
                    'Cache-Control': 'max-age=1',
                    'Last-Modified': fs.statSync(sfile).mtime.toUTCString()
                }
            });
        }
    } else {

        next();
    }
    var s = 1;
}
export function staticsecurefiles(req, res, next) {
    var path = new Filesystem().path;
    modules = config.server.modules;
    // console.log(req.path);
    let sfile = new Filesystem().path + req.path;
    if (sfile.indexOf("Settings.ts") > -1) {//&&!passport.authenticate("jwt", { session: false })){
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
        } else {
            res.sendFile(resolve(sfile), {
                headers: { 'X-Custom-Date': dat.toString() }
            });
        }
    } else {
        next();
    }
    var s = 1;
}

