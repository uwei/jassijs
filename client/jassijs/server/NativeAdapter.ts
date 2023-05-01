import { JassiError, classes } from "jassijs/remote/Classes";
import { config } from "jassijs/remote/Config";
import { Test } from "jassijs/remote/Test";
import { Reloader } from "jassijs/util/Reloader";
import { FS, exists } from "./FS";


//@ts-ignore
config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
    require("jassijs/server/NativeAdapter").ts = window.ts;
});
var ts = window.ts;
export { ts }

export {exists}

var myfs = new FS();
export { myfs };

export async function test(tt: Test) {
    var fs = new FS();

    var testfolder = "./dasisteinfestfolder";
    var testfile = "./dasisteintestfile.js";

    await fs.writeFile(testfile, "var a=10;");
    tt.expectEqual(!(await fs.stat(testfile)).isDirectory())
    tt.expectEqual(await exists(testfile));
    tt.expectEqual((await fs.readFile(testfile)) === "var a=10;");
    var hh = await fs.readdir(".");
    tt.expectEqual(hh.length > 0);
    await fs.rename(testfile, testfile + ".txt");
    tt.expectEqual(await exists(testfile + ".txt"));
    await fs.rename(testfile + ".txt", testfile);

    await fs.unlink(testfile);
    tt.expectEqual(!await exists(testfile));
    tt.expectErrorAsync(async () => await fs.unlink("./hallo.js"));
    if (await exists(testfolder))
        await fs.rmdir(testfolder, { recursive: true });
    await fs.mkdir(testfolder + "/hh", { recursive: true });
    await fs.writeFile(testfolder + "/hh/h.txt", "Hallo");
    await fs.rename(testfolder, testfolder + "1");
    tt.expectEqual(await exists(testfolder + "1"));
    tt.expectEqual(!await exists(testfolder));
    await fs.rename(testfolder + "1", testfolder);
    tt.expectEqual(!await exists(testfolder + "1"));
    tt.expectEqual(await exists(testfolder));
    //tt.expectErrorAsync(async () => await fs.rmdir(testfolder));
    //await fs.rmdir(testfolder, { recursive: true })
    debugger;
}

export async function dozip(directoryname: string, serverdir: boolean = undefined): Promise<string> {
    //@ts-ignore
    var JSZip = (await import("jassijs/server/ext/jszip")).default;
    if (serverdir)
        throw new Error("serverdir is unsupported on localserver");
    var zip = new JSZip();
    var files = await this.dirEntry(directoryname);
    for (let x = 0; x < files.length; x++) {
        if (files[x].isDirectory)
            zip.folder(files[x].id);
        else
            zip.file(files[x].id, files[x].data);
    }

    var ret = await zip.generateAsync({ type: "base64" });
    //var ret = await zip.generateAsync({ type: "base64" });
    return ret;
}

export async function reloadJSAll(filenames: string[], afterUnload: () => {}) {
    return Reloader.instance.reloadJSAll(filenames, afterUnload);
}

export async function transpile(fileName: string, inServerdirectory: boolean = undefined) {
    var tp = <any>await new Promise((resolve) => {
        config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
            resolve(ts1);
        });
    });

    var content = await myfs.readFile(fileName);
    var data = await tp.Typescript.instance.transpile(fileName, content);
    for (var x = 0; x < data.fileNames.length; x++) {
        var fname = "./" + data.fileNames[x];
        if (!await exists(myfs.getDirectoryname(fname)))
            await myfs.mkdir(myfs.getDirectoryname(fname), { recursive: true });
        await myfs.writeFile(fname, data.contents[x]);
    }

}

