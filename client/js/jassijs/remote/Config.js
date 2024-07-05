var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
                var Server = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/Server"], resolve_1, reject_1); }).then(__importStar)).Server;
                var text = await new Server().loadFile("jassijs.json");
                this.init(text);
            }
        }
        async saveJSON() {
            var myfs = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/NativeAdapter"], resolve_2, reject_2); }).then(__importStar)).myfs;
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