define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.config = exports.Config = void 0;
    class Config {
        constructor() {
            this.name = './client/jassijs.json';
            if (!window.document) {
                this.isServer = true;
                //@ts-ignore
                var fs = require("fs");
                this.init(fs.readFileSync(this.name, 'utf-8'));
            }
        }
        init(configtext, name = undefined) {
            if (name !== undefined)
                this.name = name;
            this.jsonData = JSON.parse(configtext);
            this.modules = this.jsonData.modules;
            this.server = {
                modules: this.jsonData.server.modules
            };
        }
        async reload() {
            if (!window.document) {
                this.isServer = true;
                //@ts-ignore
                var fs = require("fs");
                this.init(fs.readFileSync(this.name, 'utf-8'));
            }
            else {
                var Server = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/Server"], resolve_1, reject_1); })).Server;
                var text = await new Server().loadFile("jassijs.json");
                this.init(text);
            }
        }
        async saveJSON() {
            var myfs = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/NativeAdapter"], resolve_2, reject_2); })).myfs;
            var fname = this.name;
            await myfs.writeFile(fname, JSON.stringify(this.jsonData, undefined, "\t"));
            this.init(await myfs.readFile(fname));
        }
    }
    exports.Config = Config;
    var config = new Config();
    exports.config = config;
});
//# sourceMappingURL=Config.js.map