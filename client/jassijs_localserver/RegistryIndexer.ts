
import { Indexer } from "jassijs_localserver/Indexer";


import { Server } from "jassijs/remote/Server";
import Filessystem from "jassijs_localserver/Filesystem";
import { $Class } from "jassijs/remote/Registry";

@$Class("jassijs_localserver.RegistryIndexer")
export class RegistryIndexer extends Indexer {
    private static version=Math.floor(Math.random() * 100000);
    private mapcache: { [modul: string]: any } = {};
    public async updateRegistry() {
        //client modules
        var data = await new Server().loadFile("jassijs.json");
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (await new Filessystem().existsDirectory(modules[m]) || await new Filessystem().existsDirectory(m)) {
                if (modules[m].indexOf(".js") === -1) {//.js are internet modules

                    await this.updateModul("", m, false);
                } else {

                    await this.updateModul("", m, false);

                }
            }
        }

        return;
    }
    async dirFiles(modul: string, path: string, extensions: string[], ignore: string[] = []): Promise<string[]> {
        var tsfiles: string[] = await new Filessystem().dirFiles(path, extensions, ignore);
        //add files from map
        if (this.mapcache[modul] === undefined && jassijs.modules[modul]!==undefined&&jassijs.modules[modul].indexOf(".js") > 0) {//read webtsfiles
            let ret = {};
            let mapname = jassijs.modules[modul].split("?")[0] + ".map";
            if (jassijs.modules[modul].indexOf(".js?") > -1)
                mapname = mapname + "?" + jassijs.modules[modul].split("?")[1];
            var code = await $.ajax({ url: mapname, dataType: "text" })
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
    async writeFile(name: string, content: string) {
        await new Filessystem().saveFile(name, content);
    }
    async createDirectory(name: string) {
        await new Filessystem().createFolder(name);
        return;
    }
    async getFileTime(filename): Promise<number> {
        var entry = await new Filessystem().loadFileEntry(filename);
        if (entry !== undefined)
            return RegistryIndexer.version;
        for (var modul in this.mapcache) {
            if (this.mapcache[modul][filename]) {
                return 0;
            }
        }
        return undefined;
    }
    async fileExists(filename): Promise<boolean> {

        for (var modul in this.mapcache) {
            if (this.mapcache[modul][filename]) {
                return true;
            }
        }
        var test = await new Filessystem().loadFileEntry(filename);
        return test !== undefined;
    }
    async readFile(filename): Promise<any> {
        var ret = await new Filessystem().loadFile(filename);
        if (ret !== undefined)
            return ret;
        for (var modul in this.mapcache) {
            if (this.mapcache[modul][filename]) {
                return this.mapcache[modul][filename];
            }
        }
        return undefined;
    }
}