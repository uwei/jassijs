import { JassiError, classes } from "jassijs/remote/Classes";
import { config } from "jassijs/remote/Config";
import { Test } from "jassijs/remote/Test";
import { Reloader } from "jassijs/util/Reloader";
import { FS, exists as fsexists } from "./FS";
import { LocalFS,exists as lfsexists } from "./LocalFS";

//@ts-ignore
config.clientrequire(["jassijs_editor/util/Typescript"], ts1 => {
    require("jassijs/server/NativeAdapter").ts = window.ts;
});
var ts = window.ts;
export { ts }
var exists=fsexists;

var myfs = new FS();
if(config.isLocalFolderMapped){
    myfs=<any>new LocalFS();
    exists=lfsexists;
}
export {exists}
export { myfs };



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

var doNotReloadModule=true;
export { doNotReloadModule};