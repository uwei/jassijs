define(["require", "exports", "jassijs/remote/Server"], function (require, exports, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        await new Server_1.Server().saveFile("$serverside/Hallo.ts", "export class Hallo{};export function test(){return 2};");
        console.log(await new Server_1.Server().loadFile("$serverside/Hallo.ts")); //,"export class Hallo{};export function test(){return 2};");
    }
    exports.test = test;
});
//# sourceMappingURL=serverfile.js.map