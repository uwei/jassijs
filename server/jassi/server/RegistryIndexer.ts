import { Indexer } from "./Indexer";
import fs = require('fs');
import Filesystem from "jassi/server/Filesystem";

export class ServerIndexer extends Indexer {
    public async updateRegistry() {
        //client modules

        var data = fs.readFileSync(Filesystem.path + "/jassi.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js")&&modules[m].indexOf(".js?")===-1) //.js are internet modules
                await this.updateModul(Filesystem.path, m, false);
        } 
        //server modules
        data = fs.readFileSync("./jassi.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js"))//.js are internet modules
                await this.updateModul(".", m, true);
        }
        return;
    }
    async writeFile(name:string,content:string){
        fs.writeFileSync(name, content);
    }
    async createDirectory(name:string){
        fs.mkdirSync(name);
        return;
    }
    async getFileTime(filename):Promise<number>{
        var stats = fs.statSync(filename);
        return stats.mtime.getTime();
    }
    async fileExists(filename):Promise<boolean>{
        return fs.existsSync(filename);
    }
    async readFile(filename):Promise<any>{
        return fs.readFileSync(filename, 'utf-8');
    }
}