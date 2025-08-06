define(["require", "exports", "jassijs/server/Indexer", "jassijs/remote/Serverservice", "jassijs/server/NativeAdapter", "jassijs/remote/Config"], function (require, exports, Indexer_1, Serverservice_1, NativeAdapter_1, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerIndexer = void 0;
    class ServerIndexer extends Indexer_1.Indexer {
        async updateRegistry() {
            //client modules
            var path = (await Serverservice_1.serverservices.filesystem).path;
            var modules = Config_1.config.modules;
            for (var m in modules) {
                if ((await (0, NativeAdapter_1.exists)(path + "/" + modules[m]) && !modules[m].endsWith(".js") && modules[m].indexOf(".js?")) === -1) //.js are internet modules
                    await this.updateModul(path, m, false);
            }
            //server modules
            modules = Config_1.config.server.modules;
            for (var m in modules) {
                if (await (0, NativeAdapter_1.exists)("./" + modules[m]) && !modules[m].endsWith(".js")) //.js are internet modules
                    await this.updateModul(".", m, true);
            }
            return;
        }
        async dirFiles(modul, path, extensions, ignore = []) {
            var jsFiles = await (await Serverservice_1.serverservices.filesystem).dirFiles(path, extensions, ignore);
            return jsFiles;
        }
        async writeFile(name, content) {
            if (!name.startsWith("./"))
                name = "./" + name;
            await NativeAdapter_1.myfs.writeFile(name, content);
        }
        async createDirectory(name) {
            if (!name.startsWith("./"))
                name = "./" + name;
            await NativeAdapter_1.myfs.mkdir(name, { recursive: true });
            return;
        }
        async getFileTime(filename) {
            if (!filename.startsWith("./"))
                filename = "./" + filename;
            var stats = await NativeAdapter_1.myfs.stat(filename);
            return stats.mtimeMs;
        }
        async fileExists(filename) {
            if (!filename.startsWith("./"))
                filename = "./" + filename;
            return await (0, NativeAdapter_1.exists)(filename);
        }
        async readFile(filename) {
            if (!filename.startsWith("./"))
                filename = "./" + filename;
            return NativeAdapter_1.myfs.readFile(filename, 'utf-8');
        }
    }
    exports.ServerIndexer = ServerIndexer;
});
//# sourceMappingURL=RegistryIndexer.js.map