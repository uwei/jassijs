
import jassi, { $Class } from "jassi/remote/Jassi";
import { Context, RemoteObject } from "jassi/remote/RemoteObject";
import { FileNode } from "jassi/remote/FileNode";



@$Class("jassi.remote.Server")
export class Server extends RemoteObject {
    private static isonline:Promise<boolean>=undefined;
    //files found in js.map of modules in the jassi.json
    public static filesInMap: { [name: string]: { modul: string, id: number } } = undefined;
    constructor(){
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
        Server.filesInMap = {};
        for (var mod in jassi.modules) {
            if (jassi.modules[mod].endsWith(".js")) {
                var code = await this.loadFile(jassi.modules[mod] + ".map");
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(mod + "/"));
                    Server.filesInMap[fname] = {
                        id: x,
                        modul: mod
                    };
                }
            }
        }
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
                            flag:"fromMap",
                            name: dirname,
                            files: []
                        }
                        parent.files.push(found);
                    }
                    parent = found;

                } else {
                    parent.files.push({
                        flag:"fromMap",
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
    async dir(withDate: boolean = false,context:Context=undefined): Promise<FileNode> {
        if (!context?.isServer) {
            var ret: FileNode;
            if((await Server.isOnline(context))===true)
                ret= <FileNode>await this.call(this, this.dir, withDate,context);
            else
                ret={name:"",files:[]};
            await this.addFilesFromMap(ret);
            ret.fullpath = "";//root
            let r=this._convertFileNode(ret);
            return r;
        } else {
            //@ts-ignore
            var fs = await import("jassi/server/Filesystem");
            var rett: FileNode = await new fs.default().dir("", withDate);
            return rett;
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    public async zip(directoryname:string,serverdir:boolean=undefined,context:Context=undefined){
        if (!context?.isServer) {
            return <{ [id: string]: string }>await this.call(this, this.zip, directoryname,serverdir,context);
        } else {
            //@ts-ignore
            var fs = await import("jassi/server/Filesystem");
            return await new fs.default().zip(directoryname,serverdir);
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileNamew
     * @returns {string} content of the file
     */
    async loadFiles(fileNames: string[],context:Context=undefined): Promise<{ [id: string]: string }> {
        if (!context?.isServer) {
            return <{ [id: string]: string }>await this.call(this, this.loadFiles, fileNames,context);
        } else {
            //@ts-ignore
            var fs = await import("jassi/server/Filesystem");
            return new fs.default().loadFiles(fileNames);
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    async loadFile(fileName: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            await this.fillFilesInMapIfNeeded();
            if (Server.filesInMap[fileName]) {
                var found = Server.filesInMap[fileName];
                var code = await this.loadFile(jassi.modules[found.modul] + ".map",context);
                var data = JSON.parse(code).sourcesContent[found.id];
                return data;

            }
            return $.ajax({ url: fileName, dataType: "text" });
            //return await this.call(this,"loadFile", fileName);
        } else {
            //@ts-ignore
            var fs = await import("jassi/server/Filesystem");
            var rett: string = new fs.default().loadFile(fileName);
            return rett;
        }
    }

    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    async saveFiles(fileNames: string[], contents: string[],context:Context=undefined): Promise<string> {

        if (!context?.isServer) {
            var allfileNames: string[] = [];
            var allcontents: string[] = [];
            var alltsfiles: string[] = [];
            for (var f = 0; f < fileNames.length; f++) {
                var _this = this;

                var fileName = fileNames[f];
                var content = contents[f];
                if (fileName.endsWith(".ts")||fileName.endsWith(".js")) {
                    //@ts-ignore
                    var tss = await import("jassi_editor/util/Typescript");
                    var rets = await tss.default.transpile(fileName, content);
                    allfileNames = allfileNames.concat(rets.fileNames);
                    allcontents = allcontents.concat(rets.contents);
                    alltsfiles.push(fileName);
                } else {
                    allfileNames.push(fileName);
                    allcontents.push(content);
                }
            }
            var res = await this.call(this, this.saveFiles, allfileNames, allcontents,context);

            if (res === "") {
                //@ts-ignore
                $.notify(fileName + " saved", "info", { position: "bottom right" });
                for (var x = 0; x < alltsfiles.length; x++) {
                    await $.ajax({ url: alltsfiles[x], dataType: "text" });
                }
            } else {
                //@ts-ignore
                $.notify(fileName + " not saved", "error", { position: "bottom right" });
                throw Error(res);
            }
            return res;
        } else {
            //@ts-ignore
            var fs: any = await import("jassi/server/Filesystem");
            var ret = await new fs.default().saveFiles(fileNames, contents, true);
            return ret;
        }
    }
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    async saveFile(fileName: string, content: string,context:Context=undefined): Promise<string> {
        await this.fillFilesInMapIfNeeded();
        if (Server.filesInMap[fileName]) {
            //@ts-ignore
             $.notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
            return;
        }
        return await this.saveFiles([fileName], [content],context);
        /* if (!jassi.isServer) {
             var ret = await this.call(this, "saveFiles", fileNames, contents);
             //@ts-ignore
             //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
             return ret;
         } else {
             //@ts-ignore
             var fs: any = await import("jassi/server/Filesystem");
             return new fs.default().saveFiles(fileNames, contents);
         }*/ 
    }
    /**
    * deletes a file or directory
    **/
    async delete(name: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.delete, name,context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            //@ts-ignore
            var fs: any = await import("jassi/server/Filesystem");

            return await new fs.default().remove(name);
        }
    }
    /**
     * renames a file or directory
     **/
    async rename(oldname: string, newname: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.rename, oldname, newname,context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            //@ts-ignore
            var fs: any = await import("jassi/server/Filesystem");

            return await new fs.default().rename(oldname, newname);;
        }
    }
     /**
     * is the nodes server running 
     **/
    private static async isOnline(context:Context=undefined): Promise<boolean> {
        if (!context?.isServer) {
            try{
                if(this.isonline===undefined)
                 Server.isonline = await this.call( this.isOnline,context);
                return await Server.isonline;
            }catch{
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
    async createFile(filename: string, content: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.createFile, filename, content,context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            //@ts-ignore
            var fs: any = await import("jassi/server/Filesystem");

            return await new fs.default().createFile(filename, content);
        }
    }
    /**
    * creates a file 
    **/
    async createFolder(foldername: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            var ret = await this.call(this, this.createFolder, foldername,context);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            //@ts-ignore
            var fs: any = await import("jassi/server/Filesystem");

            return await new fs.default().createFolder(foldername);
        }
    }
    static async mytest(context:Context=undefined) {
        if (!context?.isServer) {
            return await this.call(this.mytest,context);
        } else
            return 14;//this is called on server
    }
}


export async function test() {
     var byteCharacters = atob(await new Server().zip("local"));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // If you want to use the image in your DOM:
        var blob = new Blob([byteArray], { type: "application/zip" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        link.remove();
}