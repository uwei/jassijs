define(["require", "exports", "jassijs/remote/Server"], function (require, exports, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        var g = await new Server_1.Server().loadFiles(["de/remote/Kunde.ts"]);
        debugger;
    }
    exports.test = test;
});
//# sourceMappingURL=TestNS.js.map