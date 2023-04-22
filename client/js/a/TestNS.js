define(["require", "exports", "jassijs/remote/Server", "uw"], function (require, exports, Server_1, uw_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    new uw_1.UW().kk;
    async function test() {
        var g = await new Server_1.Server().loadFiles(["de/remote/Kunde.ts"]);
    }
    exports.test = test;
});
//# sourceMappingURL=TestNS.js.map