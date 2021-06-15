define(["require", "exports", "jassijs/ui/FileExplorer", "jassijs/remote/FileNode", "jassijs/remote/Server"], function (require, exports, FileExplorer_1, FileNode_1, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(t) {
        var tests = new FileNode_1.FileNode("tests");
        try {
            var code = `export function testfunc(){return 2;}`;
            await FileExplorer_1.FileActions.newFile([tests], "TestFile.ts", code, false);
            var testcode = await new Server_1.Server().loadFile("TestFile.ts");
            t.expectEqual(testcode === code);
            //@ts-ignore
            var imp = (await new Promise((resolve_1, reject_1) => { require(["tests/TestFile.ts"], resolve_1, reject_1); })).testfunc;
            t.expectEqual(imp() === 2);
            var file = new FileNode_1.FileNode("tests/TestFile.ts");
            await FileExplorer_1.FileActions.dodelete([file]);
        }
        catch (err) {
            throw err;
        }
        finally {
            new Server_1.Server().delete("tests/TestFile.ts");
        }
    }
    exports.test = test;
});
//# sourceMappingURL=FileActions.js.map