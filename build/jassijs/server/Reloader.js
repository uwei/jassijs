"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reloader = void 0;
const Config_1 = require("jassijs/remote/Config");
const Filesystem_1 = require("jassijs/server/Filesystem");
class Reloader {
    async reloadJSAll(filenames, afterUnload = undefined) {
        //reload Modules
        var _a, _b;
        var modules = Config_1.config.server.modules;
        //var root = require.main["path"]+"\\";  //not work on heroku
        var root = new Filesystem_1.default().getDirectoryname(require.main.filename).replaceAll("\\", "/");
        root = root + (root.endsWith("/js") ? "/" : "/js/");
        // root = root.substring(0, root.length - "jassijs/remote/Classes.js".length);
        var jfiles = [];
        var serversidefile = filenames[0].startsWith("$serverside/") ? filenames[0].substring("$serverside/".length) : undefined;
        for (var modul in modules) { //undef all modules
            for (var jfile in require.cache) {
                if (jfile.indexOf("TestServerreport") > -1)
                    jfile = jfile;
                if (jfile.replaceAll("\\", "/").indexOf("/" + modul + "/remote/") > -1 || (serversidefile && jfile.replaceAll("\\", "/").endsWith(serversidefile + ".js"))) 
                /* ||
                     (fromServerdirectory && jfile.replaceAll("\\", "/").replaceAll("$serverside/", "").
                         endsWith("/js/" + fileName.replaceAll("$serverside/", "").replace(".ts", ".js"))))*/ {
                    //save Modules
                    var p = jfile.substring(root.length).replaceAll("\\", "/");
                    if (jfile.indexOf("node_modules") > -1) { //jassi modules
                        p = jfile.split("node_modules")[1].substring(1).replaceAll("\\", "/");
                        ;
                    }
                    p = p.substring(0, p.length - 3);
                    //console.log(jfile+"->"+p);
                    if (Filesystem_1.default.allModules[p] === undefined) {
                        Filesystem_1.default.allModules[p] = [];
                    }
                    //save all modules
                    var mod = await Promise.resolve().then(() => require.main.require(p));
                    if (Filesystem_1.default.allModules[p].indexOf(mod) === -1)
                        Filesystem_1.default.allModules[p].push(mod);
                    jfiles.push(jfile);
                }
            }
        }
        for (let k = 0; k < jfiles.length; k++) {
            let jfile = jfiles[k];
            if ((_b = (_a = require.cache[jfile]) === null || _a === void 0 ? void 0 : _a.exports) === null || _b === void 0 ? void 0 : _b.doNotReloadModule) {
            }
            else
                delete require.cache[jfile];
        }
        if (afterUnload !== undefined)
            await afterUnload();
        for (var key in Filesystem_1.default.allModules) { //load and migrate modules
            var all = Filesystem_1.default.allModules[key];
            var mod = await Promise.resolve().then(() => require.main.require(key));
            for (var a = 0; a < all.length; a++) {
                for (key in mod) {
                    all[a][key] = mod[key];
                }
            }
        }
    }
}
exports.Reloader = Reloader;
//# sourceMappingURL=Reloader.js.map