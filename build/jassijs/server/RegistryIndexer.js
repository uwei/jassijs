"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerIndexer = void 0;
const Indexer_1 = require("./Indexer");
const fs = require("fs");
const Serverservice_1 = require("jassijs/remote/Serverservice");
class ServerIndexer extends Indexer_1.Indexer {
    async updateRegistry() {
        //client modules
        var path = (await Serverservice_1.serverservices.filesystem).path;
        var data = fs.readFileSync(path + "/jassijs.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (fs.existsSync(path + "/" + modules[m]) && !modules[m].endsWith(".js") && modules[m].indexOf(".js?") === -1) //.js are internet modules
                await this.updateModul(path, m, false);
        }
        //server modules
        data = fs.readFileSync("./jassijs.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (fs.existsSync("./" + modules[m]) && !modules[m].endsWith(".js")) //.js are internet modules
                await this.updateModul(".", m, true);
        }
        return;
    }
    async dirFiles(modul, path, extensions, ignore = []) {
        var jsFiles = await (await Serverservice_1.serverservices.filesystem).dirFiles(path, extensions, ignore);
        return jsFiles;
    }
    async writeFile(name, content) {
        fs.writeFileSync(name, content);
    }
    async createDirectory(name) {
        fs.mkdirSync(name);
        return;
    }
    async getFileTime(filename) {
        var stats = fs.statSync(filename);
        return stats.mtime.getTime();
    }
    async fileExists(filename) {
        return fs.existsSync(filename);
    }
    async readFile(filename) {
        return fs.readFileSync(filename, 'utf-8');
    }
}
exports.ServerIndexer = ServerIndexer;
//# sourceMappingURL=RegistryIndexer.js.map