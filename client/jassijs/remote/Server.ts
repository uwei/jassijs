
import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { FileNode } from "jassijs/remote/FileNode";
import { classes, JassiError } from "./Classes";




@$Class("jassijs.remote.Server")
export class Server extends RemoteObject {
    private static isonline: Promise<boolean> = undefined;
    //files found in js.map of modules in the jassijs.json
    public static filesInMap: { [name: string]: { modul: string, id: number } } = undefined;
    constructor() {
        super(); 

    }
    private _convertFileNode(node: FileNode): FileNode {
        var ret: FileNode = new FileNode();
        Object.assign(ret, node);
        if (ret.files !== undefined) {
            for (let x = 0; x < ret.files.length; x++) {
                ret.files[x].parent = ret;
                var s = ret.fullpath === undefined ? "" : ret.fullpath;
                ret.files[x].fullpath = s + (s === "" ? "" : "/") + ret.files[x].name;
                ret.files[x] = this._convertFileNode(ret.files[x]);
            }
        }
        return ret;
    }
    async fillFilesInMapIfNeeded() {
        if (Server.filesInMap)
            return;
        var ret = {};
        for (var mod in jassijs.modules) {
            if(jassijs?.options?.Server?.filterModulInFilemap){
                if(jassijs?.options?.Server?.filterModulInFilemap.indexOf(mod)===-1)
                    continue;
            }
            if (jassijs.modules[mod].endsWith(".js") || jassijs.modules[mod].indexOf(".js?") > -1) {
                let mapname = jassijs.modules[mod].split("?")[0] + ".map";
                if (jassijs.modules[mod].indexOf(".js?") > -1)
                    mapname = mapname + "?" + jassijs.modules[mod].split("?")[1];
                var code = await $.ajax({ url: mapname, dataType: "text" })
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(mod + "/"));
                    if(jassijs?.options?.Server?.filterSytemfilesInFilemap===true){
                        if(fname.endsWith("/modul.js")||fname.endsWith("/registry.js"))
                            continue;
                    }
                    if(fname.endsWith)
                    ret[fname] = {
                        id: x,
                        modul: mod
                    };
                }
            }
        }
        Server.filesInMap = ret;

    }
    async addFilesFromMap(root: FileNode) {
        await this.fillFilesInMapIfNeeded();
        for (var fname in Server.filesInMap) {
            let path = fname.split("/");
            var parent = root;
            for (let p = 0; p < path.length; p++) {
                if (p + 1 < path.length) {
                    let dirname = path[p];
                    var found = undefined;
                    for (let f = 0; f < parent.files.length; f++) {
                        if (parent.files[f].name === dirname)
                            found = parent.files[f];
                    }
                    if (!found) {
                        found = {
                            flag: "fromMap",
                            name: dirname,
                            files: []
                        }
                        parent.files.push(found);
                    }
                    parent = found;

                } else {
                    parent.files.push({
                        flag: "fromMap",
                        name: path[p],
                        date: undefined
                    });
                }
            }
        }
    }


    /**
    * gets alls ts/js-files from server
    * @param {Promise<string>} [async] - returns a Promise for asynchros handling
    * @returns {string[]} - list of files
    */
    async dir(withDate: boolean = false, context: Context = undefined): Promise<FileNode> {
        if (!context?.isServer) {
            var ret: FileNode;
            if ((await Server.isOnline(context)) === true)
                ret = <FileNode>await this.call(this, this.dir, withDate, context);
            else
                ret = { name: "", files: [] };
            await this.addFilesFromMap(ret);
            ret.fullpath = "";//root
            let r = this._convertFileNode(ret);
            return r;
        } else {
            //@ts-ignore
            var fs = await import("jassijs/server/Filesystem");
            var rett: FileNode = await new fs.default().dir("", withDate);
            return rett;
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    public async zip(directoryname: string, serverdir: boolean = undefined, context: Context = undefined) {
        if (!context?.isServer) {
            return <{ [id: string]: string }>await this.call(this, this.zip, directoryname, serverdir, context);
        } else {
            //@ts-ignore
            var fs = await import("jassijs/server/Filesystem");
            return await new fs.default().zip(directoryname, serverdir);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileNamew
     * @returns {string} content of the file
     */
    async loadFiles(fileNames: string[], context: Context = undefined): Promise<{ [id: string]: string }> {
        if (!context?.isServer) {
            return <{ [id: string]: string }>await this.call(this, this.loadFiles, fileNames, context);
        } else {
            //@ts-ignore
            var fs = await import("jassijs/server/Filesystem");
            return new fs.default().loadFiles(fileNames);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    async loadFile(fileName: string, context: Context = undefined): Promise<string> {
        var fromServerdirectory=fileName.startsWith("$serverside/");
        if (!context?.isServer) {
            await this.fillFilesInMapIfNeeded();
            if (!fromServerdirectory && Server.filesInMap[fileName]) {
                //perhabs the files ar in localserver?
                var Filessystem = classes.getClass("jassijs_localserver.Filessystem");
                if (Filessystem && (await new Filessystem().loadFileEntry(fileName) !== undefined)) {
                    //use ajax
                } else {
                    var found = Server.filesInMap[fileName];
                    let mapname = jassijs.modules[found.modul].split("?")[0] + ".map";
                    if (jassijs.modules[found.modul].indexOf(".js?") > -1)
                        mapname = mapname + "?" + jassijs.modules[found.modul].split("?")[1];
                    var code = await this.loadFile(mapname, context);
                    var data = JSON.parse(code).sourcesContent[found.id];
                    return data;
                }

            }
            if (fromServerdirectory) {

                return await this.call(this, this.loadFile, fileName, context);
            } else
                return $.ajax({ url: fileName, dataType: "text" });
            //return await this.call(this,"loadFile", fileName);
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can loadFile from Serverdirectory");
            //@ts-ignore

            var fs = await import("jassijs/server/Filesystem");
            var rett: string = new fs.default().loadFile(fileName);
            return rett;
        }
    }

    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    async saveFiles(fileNames: string[], contents: string[], context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var allfileNames: string[] = [];
            var allcontents: string[] = [];
            var alltsfiles: string[] = [];
            for (var f = 0; f < fileNames.length; f++) {
                var _this = this;

                var fileName = fileNames[f];
                var content = contents[f];
                if (!fileName.startsWith("$serverside/") && (fileName.endsWith(".ts") || fileName.endsWith(".js"))) {
                    //@ts-ignore
                    var tss = await import("jassijs_editor/util/Typescript");
                    var rets = await tss.default.transpile(fileName, content);
                    allfileNames = allfileNames.concat(rets.fileNames);
                    allcontents = allcontents.concat(rets.contents);
                    alltsfiles.push(fileName);
                } else {
                    allfileNames.push(fileName);
                    allcontents.push(content);
                }
            }
            var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);

            if (res === "") {
                //@ts-ignore
                import ("jassijs/ui/Notify").then((el)=>{
                    el.notify(fileName + " saved", "info", { position: "bottom right" });
                });
                //if (!fromServerdirectory) {
                    for (var x = 0; x < alltsfiles.length; x++) {
                        await $.ajax({ url: alltsfiles[x], dataType: "text" });
                    }
               // }
            } else {
                //@ts-ignore
                 import ("jassijs/ui/Notify").then((el)=>{
                     el.notify(fileName + " not saved", "error", { position: "bottom right" });
                 });
                throw new JassiError(res);
            }
            return res;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can saveFiles");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");
            var ret = await new fs.default().saveFiles(fileNames, contents, true);
            return ret;
        }
    }
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    async saveFile(fileName: string, content: string, context: Context = undefined): Promise<string> {
        /*await this.fillFilesInMapIfNeeded();
        if (Server.filesInMap[fileName]) {
            //@ts-ignore
             notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
            return;
        }*/
        return await this.saveFiles([fileName], [content], context);
        /* if (!jassijs.isServer) {
             var ret = await this.call(this, "saveFiles", fileNames, contents);
             //@ts-ignore
             //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
             return ret;
         } else {
             //@ts-ignore
             var fs: any = await import("jassijs/server/Filesystem");
             return new fs.default().saveFiles(fileNames, contents);
         }*/
    }
    /**
   * deletes a server modul
   **/
    async removeServerModul(name: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.removeServerModul, name, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can delete");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().removeServerModul(name);
        }
    }
    /**
    * deletes a file or directory
    **/
    async delete(name: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.delete, name, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can delete");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().remove(name);
        }
    }
    /**
     * renames a file or directory
     **/
    async rename(oldname: string, newname: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.rename, oldname, newname, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can rename");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().rename(oldname, newname);;
        }
    }
    /**
    * is the nodes server running 
    **/
    public static async isOnline(context: Context = undefined): Promise<boolean> {
        if (!context?.isServer) {
             //no serviceworker no serverside implementation
            if(navigator.serviceWorker.controller===null)
                return false;
            try {
                if (this.isonline === undefined)
                    Server.isonline = await this.call(this.isOnline, context);
                return await Server.isonline;
            } catch {
                return false;
            }
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
        } else {
            return true;
        }
    }
    /**
     * creates a file 
     **/
    async createFile(filename: string, content: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.createFile, filename, content, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can createFile");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().createFile(filename, content);
        }
    }
    /**
    * creates a file 
    **/
    async createFolder(foldername: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.createFolder, foldername, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can createFolder");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().createFolder(foldername);
        }
    }
    async createModule(modulname: string, context: Context = undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.createModule, modulname, context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError("only admins can createFolder");
            //@ts-ignore
            var fs: any = await import("jassijs/server/Filesystem");

            return await new fs.default().createModule(modulname);
        }
    }
    static async mytest(context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this.mytest, context);
        } else
            return 14;//this is called on server
    }
}


export async function test() {

}