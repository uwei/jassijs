
import { Indexer } from "jassijs_localserver/Indexer";


import { Server } from "jassijs/remote/Server";
import Filessystem from "jassijs_localserver/Filesystem";
import { $Class } from "jassijs/remote/Jassi";

@$Class("jassijs_localserver.RegistryIndexer")
export class RegistryIndexer extends Indexer {
    public async updateRegistry() {
        //client modules
        var data=await new Server().loadFile("jassijs.json");
        var modules = JSON.parse(data).modules;
        for (var m in modules) {

            if (!modules[m].endsWith(".js")&&modules[m].indexOf(".js")===-1){//.js are internet modules
                if(await new Filessystem().existsDirectory(modules[m]))
                    await this.updateModul("", m, false);
            }
        }
        
        return;
    }
    async writeFile(name:string,content:string){
        await new Filessystem().saveFile(name, content);
    }
    async createDirectory(name:string){
        await new Filessystem().createFolder(name);
        return;
    }
    async getFileTime(filename):Promise<number>{
        var entry=await new Filessystem().loadFileEntry(filename);
        return entry.date;
    }
    async fileExists(filename):Promise<boolean>{
        var test=await new Filessystem().loadFileEntry(filename);
        return test!==undefined;
    }
    async readFile(filename):Promise<any>{
        return await new Filessystem().loadFile(filename);
    }
}