define(["require", "exports", "jassijs/remote/Server"], function (require, exports, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        await new Server_1.Server().saveFile("Hallo.ts", "export class Hallo{};export function test(){return 1};", true);
    }
    exports.test = test;
});
//# sourceMappingURL=T.js.map