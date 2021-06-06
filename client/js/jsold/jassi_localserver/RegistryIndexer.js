var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs_localserver/Indexer", "jassijs/remote/Server", "jassijs_localserver/Filesystem", "jassijs/remote/Jassi"], function (require, exports, Indexer_1, Server_1, Filesystem_1, jassijs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegistryIndexer = void 0;
    let RegistryIndexer = class RegistryIndexer extends Indexer_1.Indexer {
        async updateRegistry() {
            //client modules
            var data = await new Server_1.Server().loadFile("jassijs.json");
            var modules = JSON.parse(data).modules;
            for (var m in modules) {
                if (!modules[m].endsWith(".js") && modules[m].indexOf(".js") === -1) { //.js are internet modules
                    if (await new Filesystem_1.default().existsDirectory(modules[m]))
                        await this.updateModul("", m, false);
                }
            }
            return;
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
            return entry.date;
        }
        async fileExists(filename) {
            var test = await new Filesystem_1.default().loadFileEntry(filename);
            return test !== undefined;
        }
        async readFile(filename) {
            return await new Filesystem_1.default().loadFile(filename);
        }
    };
    RegistryIndexer = __decorate([
        jassijs_1.$Class("jassijs_localserver.RegistryIndexer")
    ], RegistryIndexer);
    exports.RegistryIndexer = RegistryIndexer;
});
//# sourceMappingURL=RegistryIndexer.js.map
//# sourceMappingURL=RegistryIndexer.js.map