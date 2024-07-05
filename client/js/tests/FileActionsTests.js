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
define(["require", "exports", "jassijs_editor/FileExplorer", "jassijs/remote/FileNode", "jassijs/remote/Server"], function (require, exports, FileExplorer_1, FileNode_1, Server_1) {
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
            await new Server_1.Server().saveFile("tests/TestFile.ts", code);
            //@ts-ignore
            var imp = (await new Promise((resolve_1, reject_1) => { require(["tests/TestFile"], resolve_1, reject_1); }).then(__importStar)).testfunc;
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