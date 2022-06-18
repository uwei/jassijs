var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs_localserver/Indexer", "jassijs/remote/Server", "jassijs_localserver/Filesystem", "jassijs/remote/Registry"], function (require, exports, Indexer_1, Server_1, Filesystem_1, Registry_1) {
    "use strict";
    var RegistryIndexer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegistryIndexer = void 0;
    let RegistryIndexer = RegistryIndexer_1 = class RegistryIndexer extends Indexer_1.Indexer {
        constructor() {
            super(...arguments);
            this.mapcache = {};
        }
        async updateRegistry() {
            //client modules
            var data = await new Server_1.Server().loadFile("jassijs.json");
            var modules = JSON.parse(data).modules;
            for (var m in modules) {
                if (await new Filesystem_1.default().existsDirectory(modules[m]) || await new Filesystem_1.default().existsDirectory(m)) {
                    if (modules[m].indexOf(".js") === -1) { //.js are internet modules
                        await this.updateModul("", m, false);
                    }
                    else {
                        await this.updateModul("", m, false);
                    }
                }
            }
            return;
        }
        async dirFiles(modul, path, extensions, ignore = []) {
            var tsfiles = await new Filesystem_1.default().dirFiles(path, extensions, ignore);
            //add files from map
            if (this.mapcache[modul] === undefined && jassijs.modules[modul] !== undefined && jassijs.modules[modul].indexOf(".js") > 0) { //read webtsfiles
                let ret = {};
                let mapname = jassijs.modules[modul].split("?")[0] + ".map";
                if (jassijs.modules[modul].indexOf(".js?") > -1)
                    mapname = mapname + "?" + jassijs.modules[modul].split("?")[1];
                var code = await $.ajax({ url: mapname, dataType: "text" });
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(modul + "/"));
                    ret[fname] = data.sourcesContent[x];
                }
                this.mapcache[modul] = ret;
            }
            if (this.mapcache[modul]) {
                for (var key in this.mapcache[modul]) {
                    if (tsfiles.indexOf(key) === -1) {
                        tsfiles.push(key);
                    }
                }
            }
            return tsfiles;
        }
        async writeFile(name, content) {
            await new Filesystem_1.default().saveFile(name, content);
        }
        async createDirectory(name) {
            await new Filesystem_1.default().createFolder(name);
            return;
        }
        async getFileTime(filename) {
            var entry = await new Filesystem_1.default().loadFileEntry(filename);
            if (entry !== undefined)
                return RegistryIndexer_1.version;
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return 0;
                }
            }
            return undefined;
        }
        async fileExists(filename) {
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return true;
                }
            }
            var test = await new Filesystem_1.default().loadFileEntry(filename);
            return test !== undefined;
        }
        async readFile(filename) {
            var ret = await new Filesystem_1.default().loadFile(filename);
            if (ret !== undefined)
                return ret;
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return this.mapcache[modul][filename];
                }
            }
            return undefined;
        }
    };
    RegistryIndexer.version = Math.floor(Math.random() * 100000);
    RegistryIndexer = RegistryIndexer_1 = __decorate([
        (0, Registry_1.$Class)("jassijs_localserver.RegistryIndexer")
    ], RegistryIndexer);
    exports.RegistryIndexer = RegistryIndexer;
});
//# sourceMappingURL=RegistryIndexer.js.map