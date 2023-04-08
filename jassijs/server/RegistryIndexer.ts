import { Indexer } from "./Indexer";
import fs = require('fs');
import { serverservices } from "jassijs/remote/Serverservice";


export class ServerIndexer extends Indexer {
    public async updateRegistry() {
        //client modules
        var path=(await serverservices.filesystem).path
        var data = fs.readFileSync(path + "/jassijs.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js")&&modules[m].indexOf(".js?")===-1) //.js are internet modules
                await this.updateModul(path, m, false);
        } 
        //server modules
        data = fs.readFileSync("./jassijs.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js"))//.js are internet modules
                await this.updateModul(".", m, true);
        }
        return;
    }
    async dirFiles(modul:string,path: string, extensions: string[], ignore: string[] = []): Promise<string[]> {
        var jsFiles: string[] =await (await  serverservices.filesystem).dirFiles(path, extensions, ignore);
        return jsFiles;
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