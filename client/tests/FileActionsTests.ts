import { FileActions } from "jassijs/ui/FileExplorer";
import { FileNode } from "jassijs/remote/FileNode";
import { Server } from "jassijs/remote/Server";
import { Test } from "jassijs/base/Tests";

export async function test(t: Test) {
    var tests = new FileNode("tests");
    tests.files = [];
    try {
        var code = `export function testfunc(){return 2;}`;
        await FileActions.newFile([tests], "TestFile.ts", code, false);
        var testcode = await new Server().loadFile("tests/TestFile.ts");
        t.expectEqual(testcode === code);
        await new Server().saveFile("tests/TestFile.ts",code);
        //@ts-ignore
        var imp = (await import("tests/TestFile")).testfunc;
        t.expectEqual(imp() === 2);
      var file = new FileNode("tests/TestFile.ts");
       await FileActions.dodelete([file], false);
        await FileActions.newFolder([tests], "testfolder");
        var tf = new FileNode("tests/testfolder");
        tf.parent = tests;
        tf.files=[];
         await FileActions.rename([tf], "testfolder2");
          var tf2 = new FileNode("tests/testfolder2");
        tf2.files = [];
       await FileActions.download([tf2]);
        await FileActions.dodelete([tf2], false);

    } catch (err) {
        throw err;
    } finally {
        try {
            new Server().delete("tests/TestFile.ts");
        } catch {

        }
        try {
            new Server().delete("tests/testfolder");
        } catch {

        }
        try {
            new Server().delete("tests/testfolder2");
        } catch {

        }
    }
}
