define(["require", "exports", "jassijs/remote/Config", "jassijs/util/Reloader", "./FS"], function (require, exports, Config_1, Reloader_1, FS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transpile = exports.reloadJSAll = exports.dozip = exports.test = exports.myfs = exports.exists = exports.ts = void 0;
    Object.defineProperty(exports, "exists", { enumerable: true, get: function () { return FS_1.exists; } });
    //@ts-ignore
    Config_1.config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
        require("jassijs/server/NativeAdapter").ts = window.ts;
    });
    var ts = window.ts;
    exports.ts = ts;
    var myfs = new FS_1.FS();
    exports.myfs = myfs;
    async function test(tt) {
        var fs = new FS_1.FS();
        var testfolder = "./dasisteinfestfolder";
        var testfile = "./dasisteintestfile.js";
        await fs.writeFile(testfile, "var a=10;");
        tt.expectEqual(!(await fs.stat(testfile)).isDirectory());
        tt.expectEqual(await (0, FS_1.exists)(testfile));
        tt.expectEqual((await fs.readFile(testfile)) === "var a=10;");
        var hh = await fs.readdir(".");
        tt.expectEqual(hh.length > 0);
        await fs.rename(testfile, testfile + ".txt");
        tt.expectEqual(await (0, FS_1.exists)(testfile + ".txt"));
        await fs.rename(testfile + ".txt", testfile);
        await fs.unlink(testfile);
        tt.expectEqual(!await (0, FS_1.exists)(testfile));
        tt.expectErrorAsync(async () => await fs.unlink("./hallo.js"));
        if (await (0, FS_1.exists)(testfolder))
            await fs.rmdir(testfolder, { recursive: true });
        await fs.mkdir(testfolder + "/hh", { recursive: true });
        await fs.writeFile(testfolder + "/hh/h.txt", "Hallo");
        await fs.rename(testfolder, testfolder + "1");
        tt.expectEqual(await (0, FS_1.exists)(testfolder + "1"));
        tt.expectEqual(!await (0, FS_1.exists)(testfolder));
        await fs.rename(testfolder + "1", testfolder);
        tt.expectEqual(!await (0, FS_1.exists)(testfolder + "1"));
        tt.expectEqual(await (0, FS_1.exists)(testfolder));
        //tt.expectErrorAsync(async () => await fs.rmdir(testfolder));
        //await fs.rmdir(testfolder, { recursive: true })
        debugger;
    }
    exports.test = test;
    async function dozip(directoryname, serverdir = undefined) {
        //@ts-ignore
        var JSZip = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/ext/jszip"], resolve_1, reject_1); })).default;
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
    exports.dozip = dozip;
    async function reloadJSAll(filenames, afterUnload) {
        return Reloader_1.Reloader.instance.reloadJSAll(filenames, afterUnload);
    }
    exports.reloadJSAll = reloadJSAll;
    async function transpile(fileName, inServerdirectory = undefined) {
        var tp = await new Promise((resolve) => {
            Config_1.config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
                resolve(ts1);
            });
        });
        var content = await myfs.readFile(fileName);
        var data = await tp.Typescript.instance.transpile(fileName, content);
        for (var x = 0; x < data.fileNames.length; x++) {
            var fname = "./" + data.fileNames[x];
            if (!await (0, FS_1.exists)(myfs.getDirectoryname(fname)))
                await myfs.mkdir(myfs.getDirectoryname(fname), { recursive: true });
            await myfs.writeFile(fname, data.contents[x]);
        }
    }
    exports.transpile = transpile;
});
//# sourceMappingURL=NativeAdapter.js.map