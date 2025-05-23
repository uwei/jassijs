define(["require", "exports", "jassijs/remote/Server"], function (require, exports, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(tests) {
        var text = "export class Hallo{};export function test(){return " + 1 + "};";
        await new Server_1.Server().saveFile("$serverside/Hallo.ts", text);
        var text2 = await new Server_1.Server().loadFile("$serverside/Hallo.ts");
        tests.expectEqual(text === text2);
        //,"export class Hallo{};export function test(){return 2};");
    }
    exports.test = test;
});
//# sourceMappingURL=ServerTests.js.map