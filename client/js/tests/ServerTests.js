var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Server"], function (require, exports, Registry_1, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    Registry_1 = __importDefault(Registry_1);
    async function test(tests) {
        var text = "export class Hallo{};export function test(){return " + Registry_1.default.nextID() + "};";
        await new Server_1.Server().saveFile("$serverside/Hallo.ts", text);
        var text2 = await new Server_1.Server().loadFile("$serverside/Hallo.ts");
        tests.expectEqual(text === text2);
        //,"export class Hallo{};export function test(){return 2};");
    }
    exports.test = test;
});
//# sourceMappingURL=ServerTests.js.map