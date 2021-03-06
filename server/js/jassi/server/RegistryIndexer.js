"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerIndexer = void 0;
const Indexer_1 = require("./Indexer");
const fs = require("fs");
const Filesystem_1 = require("jassi/server/Filesystem");
class ServerIndexer extends Indexer_1.Indexer {
    async updateRegistry() {
        //client modules
        var data = fs.readFileSync(Filesystem_1.default.path + "/jassi.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js")) //.js are internet modules
                await this.updateModul(Filesystem_1.default.path, m, false);
        }
        //server modules
        data = fs.readFileSync("./jassi.json", 'utf-8');
        var modules = JSON.parse(data).modules;
        for (var m in modules) {
            if (!modules[m].endsWith(".js")) //.js are internet modules
                await this.updateModul(".", m, true);
        }
        return;
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