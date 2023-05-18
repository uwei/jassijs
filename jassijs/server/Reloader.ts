import { config } from "jassijs/remote/Config";
import Filesystem from "jassijs/server/Filesystem";
import { myfs } from "jassijs/server/NativeAdapter";

export class Reloader {

    async reloadJSAll(filenames: string[], afterUnload: () => {}=undefined) {
        //reload Modules

        var modules = config.server.modules;
        //var root = require.main["path"]+"\\";  //not work on heroku
        var root: string = new Filesystem().getDirectoryname(require.main.filename).replaceAll("\\", "/");
        root = root + (root.endsWith("/js") ? "/" : "/js/");
        // root = root.substring(0, root.length - "jassijs/remote/Classes.js".length);
        var jfiles = [];
        var serversidefile=filenames[0].startsWith("$serverside/")?filenames[0].substring("$serverside/".length):undefined;
        
        for (var modul in modules) {//undef all modules
            for (var jfile in require.cache) {
                if (jfile.indexOf("TestServerreport") > -1)
                    jfile = jfile;
                if (jfile.replaceAll("\\", "/").indexOf("/" + modul + "/remote/") > -1||(serversidefile&&jfile.replaceAll("\\", "/").endsWith(serversidefile+".js")))
                /* ||
                     (fromServerdirectory && jfile.replaceAll("\\", "/").replaceAll("$serverside/", "").
                         endsWith("/js/" + fileName.replaceAll("$serverside/", "").replace(".ts", ".js"))))*/ {
                    //save Modules

                    var p = jfile.substring(root.length).replaceAll("\\", "/");
                    if (jfile.indexOf("node_modules") > -1) {//jassi modules
                        p = jfile.split("node_modules")[1].substring(1).replaceAll("\\", "/");;
                    }
                    p = p.substring(0, p.length - 3);
                    //console.log(jfile+"->"+p);
                    if (Filesystem.allModules[p] === undefined) {
                        Filesystem.allModules[p] = [];
                    }

                    //save all modules
                    var mod = await Promise.resolve().then(() => require.main.require(p));
                    if (Filesystem.allModules[p].indexOf(mod) === -1)
                        Filesystem.allModules[p].push(mod);

                    jfiles.push(jfile);

                }
            }
        }
        for (let k = 0; k < jfiles.length; k++) {
            let jfile = jfiles[k];
            if (require.cache[jfile]?.exports?.doNotReloadModule) {

            } else
                delete require.cache[jfile];
        }
        if(afterUnload!==undefined)
            await afterUnload();
        for (var key in Filesystem.allModules) {//load and migrate modules
            var all = Filesystem.allModules[key];
            var mod = await Promise.resolve().then(() => require.main.require(key));

            for (var a = 0; a < all.length; a++) {

                for (key in mod) {
                    all[a][key] = mod[key];
                }

            }
        }
    }

}