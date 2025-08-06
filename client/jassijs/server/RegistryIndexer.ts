//synchronize-server-client
import { Indexer } from "jassijs/server/Indexer";
import { serverservices } from "jassijs/remote/Serverservice";
import { exists, myfs } from "jassijs/server/NativeAdapter";
import { config } from "jassijs/remote/Config";


export class ServerIndexer extends Indexer {
    public async updateRegistry() {
        //client modules
        var path = (await serverservices.filesystem).path
        var modules = config.modules;
        for (var m in modules) {
            if ((await exists(path + "/" + modules[m]) && !modules[m].endsWith(".js") && modules[m].indexOf(".js?")) === -1) //.js are internet modules
                await this.updateModul(path, m, false);
        }
        //server modules
        modules = config.server.modules;
        for (var m in modules) {
            if (await exists("./" + modules[m]) && !modules[m].endsWith(".js")) //.js are internet modules
                await this.updateModul(".", m, true);
        }
        return;
    }
    async dirFiles(modul: string, path: string, extensions: string[], ignore: string[] = []): Promise<string[]> {
       
        var jsFiles: string[] = await (await serverservices.filesystem).dirFiles(path, extensions, ignore);
        return jsFiles;
    }
    async writeFile(name: string, content: string) {
        if (!name.startsWith("./"))
            name = "./"+name ;
        await myfs.writeFile(name, content);
    }
    async createDirectory(name: string) {
        if (!name.startsWith("./"))
        name = "./"+name ;
        await myfs.mkdir(name, { recursive: true });
        return;
    }
    async getFileTime(filename): Promise<number> {
        if (!filename.startsWith("./"))
        filename = "./"+filename ;
        var stats = await myfs.stat(filename);
        return stats.mtimeMs;
    }
    async fileExists(filename): Promise<boolean> {
        if (!filename.startsWith("./"))
        filename = "./"+filename ;
        return await exists(filename);
    }
    async readFile(filename): Promise<any> {
        if (!filename.startsWith("./"))
        filename = "./"+filename ;
        return myfs.readFile(filename, 'utf-8');
    }
}