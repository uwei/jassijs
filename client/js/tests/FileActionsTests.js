define(["require", "exports", "jassijs/ui/FileExplorer", "jassijs/remote/FileNode", "jassijs/remote/Server"], function (require, exports, FileExplorer_1, FileNode_1, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(t) {
        var tests = new FileNode_1.FileNode("tests");
        tests.files = [];
        try {
            var code = `export function testfunc(){return 2;}`;
            await FileExplorer_1.FileActions.newFile([tests], "TestFile.ts", code, false);
            var testcode = await new Server_1.Server().loadFile("tests/TestFile.ts");
            t.expectEqual(testcode === code);
            //@ts-ignore
            var imp = (await new Promise((resolve_1, reject_1) => { require(["tests/TestFile"], resolve_1, reject_1); })).testfunc;
            t.expectEqual(imp() === 2);
            var file = new FileNode_1.FileNode("tests/TestFile.ts");
            await FileExplorer_1.FileActions.dodelete([file], false);
            await FileExplorer_1.FileActions.newFolder([tests], "testfolder");
            var tf = new FileNode_1.FileNode("tests/testfolder");
            tf.parent = tests;
            tf.files = [];
            await FileExplorer_1.FileActions.rename([tf], "testfolder2");
            var tf2 = new FileNode_1.FileNode("tests/testfolder2");
            tf2.files = [];
            await FileExplorer_1.FileActions.download([tf2]);
            await FileExplorer_1.FileActions.dodelete([tf2], false);
        }
        catch (err) {
            throw err;
        }
        finally {
            try {
                new Server_1.Server().delete("tests/TestFile.ts");
            }
            catch (_a) {
            }
            try {
                new Server_1.Server().delete("tests/testfolder");
            }
            catch (_b) {
            }
            try {
                new Server_1.Server().delete("tests/testfolder2");
            }
            catch (_c) {
            }
        }
    }
    exports.test = test;
});
//# sourceMappingURL=FileActionsTests.js.map