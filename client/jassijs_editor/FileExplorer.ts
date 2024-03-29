import { $Class } from "jassijs/remote/Registry";
import { Tree } from "jassijs/ui/Tree";
import { Panel } from "jassijs/ui/Panel";
import { Textbox } from "jassijs/ui/Textbox";
import { Server } from "jassijs/remote/Server";
import { router } from "jassijs/base/Router";
import { FileNode } from "jassijs/remote/FileNode";
import { $ActionProvider, $Action, Actions } from "jassijs/base/Actions";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { Menu } from "jassijs/ui/Menu";
import { MenuItem } from "jassijs/ui/MenuItem";

import { ContextMenu } from "jassijs/ui/ContextMenu";
import { CSSProperties } from "jassijs/ui/CSSProperties";
import windows from "jassijs/base/Windows";
import { config } from "jassijs/remote/Config";

import { Reloader } from "jassijs/util/Reloader";
//drag from Desktop https://www.html5rocks.com/de/tutorials/file/dndfiles/
@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs_editor.ui.FileActions")
export class FileActions {

    @$Action({
        name: "New/File",
        icon: "mdi mdi-file",
        isEnabled: function (all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[], fileName: string = undefined, code: string = "", open: boolean = false) {
        if (all.length === 0 || !all[0].isDirectory())
            return;
        var path = all[0].fullpath;
        if (fileName === undefined) {
            var res = await OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, ".ts");
            if (res.button === "ok" && res.text !== all[0].name) {
                fileName = res.text;
            } else
                return;
        }
        //console.log("create " + fileName);
        var key = FileExplorer.instance?.tree?.getKeyFromItem(all[0]);
        var newfile = path + (path===""?"":"/") + fileName;

        var ret = await new Server().createFile(newfile, code);
        var newkey = path + (path===""?"":"|")+ fileName;
        if (ret !== "") {
            alert(ret);
            return;
        }
        try {
            await FileExplorer.instance?.refresh();
            await FileExplorer.instance?.tree.activateKey(newkey);
            if (open)
                router.navigate("#do=jassijs_editor.CodeEditor&file=" + newkey.replaceAll("|", "/"));
        } catch (err) {
            debugger;
        }
    }
    @$Action({
        name: "Download",
        isEnabled: function (all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async download(all: FileNode[]) {

        var path = all[0].fullpath;
        var byteCharacters = atob(<string>await new Server().zip(path));
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

    @$Action({
        name: "New/Folder",
        isEnabled: function (all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFolder(all: FileNode[], filename: string = undefined) {
        if (all.length === 0 || !all[0].isDirectory())
            return;
        var path = all[0].fullpath;

        var res;
        if (filename) {
            res = { button: "ok", text: filename };
        } else
            res = await OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
        if (res.button === "ok" && res.text !== all[0].name) {
           // console.log("create Folder" + res.text);
            var key = FileExplorer.instance?.tree.getKeyFromItem(all[0]);
            var newfile = path + (path===""?"":"/") + res.text;
            var ret = await new Server().createFolder(newfile);
            var newkey = path + (path===""?"":"|") + res.text;
            if (ret !== "") {
                alert(ret);
                return;
            }
            await FileExplorer.instance?.refresh();
            FileExplorer.instance?.tree.activateKey(newkey);
        }

    }
    @$Action({
        name: "New/Module",
        isEnabled: function (all: FileNode[]): boolean {
            return all[0].name === "client" && all[0].fullpath === "";
        }
    })
    static async newModule(all: FileNode[]) {
        if (all.length === 0 || !all[0].isDirectory())
            return;
        var path = all[0].fullpath;

        var res = await OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
        if (res.button === "ok" && res.text !== all[0].name) {
            var smodule = res.text.toLocaleLowerCase();
            if (config.modules[smodule]) {
                alert("modul allready exists");
                return;
            }
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);

            var ret = await new Server().createModule(smodule);
            var newkey = path + (path===""?"":"|") + smodule;
            if (ret !== "") {
                alert(ret);
                return;
            } else {
                config.modules[smodule] = smodule;
            }
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(newkey);
        }

    }
    @$Action({ name: "Delete" })
    static async dodelete(all: FileNode[], withwarning = true) {
        var s = "";
        all.forEach((node) => {
            s = s + "" + node.fullpath + "<br/>";
        })
        var res;
        if (withwarning) {
            res = await OptionDialog.show("Delete this?<br/>" + s, ["ok", "cancel"], undefined, true);
        }
        if (!withwarning || (res.button === "ok" && res.text !== all[0].name)) {
            var ret = await new Server().delete(all[0].fullpath);
            if (ret !== "") {
                alert(ret);
                return;
            }
            var key = FileExplorer.instance?.tree.getKeyFromItem(all[0].parent);
            await FileExplorer.instance?.refresh();
            FileExplorer.instance?.tree.activateKey(key);
        }
    }
    private static async  reloadFilesystem(enableLocalFS) {
        await new Promise((resolve)=>{
            config.serverrequire(["jassijs/server/NativeAdapter","jassijs/server/LocalFS","jassijs/server/FS"],(native,localFS,FS)=>{
                if(enableLocalFS){
                native.myfs=new localFS.LocalFS();
                native.exists=localFS.exists;
                }else{
                    native.myfs=new FS.FS();
                    native.exists=FS.exists;
                        
                }
                    resolve(undefined);
               
            })
    
        });
    } 
    @$Action({ name: "Map local folder",isEnabled:(entr)=>entr[0].name==="client"&&config.serverrequire!==undefined})
    static async mapLocalFolder(all: FileNode[], foldername = undefined) {
        await new Promise((resolve)=>{
            config.serverrequire(["jassijs/server/LocalFS"],(localFS)=>{
                localFS.createHandle().then((res)=>{
                    resolve(undefined);
                })
            })
    
        });
        config.isLocalFolderMapped=true;
        await FileActions.reloadFilesystem(true);
        await FileActions.refresh(all);
    }
    @$Action({ name: "Close local folder",isEnabled:(entr)=>entr[0].name==="client"&&config.isLocalFolderMapped})
    static async closeLocalFolder(all: FileNode[], foldername = undefined) {
        await new Promise((resolve)=>{
            config.serverrequire(["jassijs/server/LocalFS"],(localFS)=>{
                localFS.deleteHandle().then((res)=>{
                    resolve(undefined);
                })
            })
    
        });
        config.isLocalFolderMapped=true;
        await FileActions.reloadFilesystem(false);
        await FileActions.refresh(all);
    }
    @$Action({ name: "Rename" })
    static async rename(all: FileNode[], foldername = undefined) {
        if (all.length !== 1)
            alert("only one file could be renamed");
        else {
            var res;
            if (foldername) {
                res = { button: "ok", text: foldername };
            } else
                res = await OptionDialog.show("Enter new name:", ["ok", "cancel"], undefined, true, all[0].name);
            if (res.button === "ok" && res.text !== all[0].name) {
                //console.log("rename " + all[0].name + " to " + res.text);
                var key = FileExplorer.instance?.tree.getKeyFromItem(all[0]);
                var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                var newfile = path + (path===""?"":"/") + res.text;
                var ret = await new Server().rename(all[0].fullpath, newfile);
                var newkey = key?.replace(all[0].name, res.text);
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                if (!all[0].isDirectory()){

                    let tss = (await import("jassijs_editor/util/"+"Typescript")).default;//modul jassijs could not comp
                    await tss?.renameFile(all[0].fullpath, newfile);
                }
                await FileExplorer.instance?.refresh();
                FileExplorer.instance?.tree.activateKey(newkey);
            }
        }
    }
    @$Action({ name: "Refresh" })
    static async refresh(all: FileNode[]) {
        var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
        await FileExplorer.instance.refresh();
        FileExplorer.instance.tree.activateKey(key);
    }
    @$Action({
        name: "Open", isEnabled: function (all: FileNode[]): boolean {
            return !all[0].isDirectory();
        }
    })
    static async open(all: FileNode[]) {
        var node: FileNode = all[0];
        if (node.isDirectory())
            return;
        router.navigate("#do=jassijs_editor.CodeEditor&file=" + node.fullpath);
    }

}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs.ui.FileExplorer")
export class FileExplorer extends Panel {
    tree: Tree;
    _files: any;
    search: Textbox;
    static instance: FileExplorer = undefined;
    constructor() {
        super();
        FileExplorer.instance = this;
        //this.maximize();
        this.dom.style.width="calc(100% - 8px)";
        this.dom.style.height="calc(100% - 25px)";//why 25????
        this.tree = new Tree();
        this.search = new Textbox();
        this.layout();
        this.tree.propStyle = node => { return this.getStyle(node) };
    }
    @$Action({
        name: "Windows/Development/Files",
        icon: "mdi mdi-file-tree",
    })
    static async show() {
        if (windows.contains("Files"))
            var window = windows.show("Files");
        else
            windows.addLeft(new FileExplorer(), "Files");
    }
    getStyle(node: FileNode): CSSProperties {
        var ret: CSSProperties = undefined;
        if (node.flag?.indexOf("fromMap") > -1) {
            ret = {
                color: "green"
            }
        }
        if (node.flag?.indexOf("module") > -1) {
            ret = {
                color: "blue"
            }
        }

        return ret;
    }
    async refresh() {
        let root = (await new Server().dir());
        root.fullpath = "";
        root.name = "client";
        //flag modules
        for (let x = 0; x < root.files.length; x++) {

            if (config.modules[root.files[x].name] !== undefined) {
                root.files[x].flag = (root.files[x].flag?.length > 0) ? "module" : root.files[x].flag + " module";
            }
        }
        var keys = this.tree.getExpandedKeys();
        this.tree.items = [root];
        if (keys.indexOf("client") === -1)
            keys.push("client");
        await this.tree.expandKeys(keys);

    }
    async layout() {
        var _this = this;
        this.tree.width = "100%"
        this.tree.height = "100%";
        super.add(this.search);
        super.add(this.tree);
        this.tree.propDisplay = "name";
        this.tree.propChilds = "files";
        let context = new ContextMenu();
        this.tree.contextMenu = context;
        context.includeClassActions = true;
        this.refresh();
        this.add(this.tree);
        // this._files.files;
        this.tree.onclick(function (evt) {

            if (evt.data !== undefined) {
                FileActions.open([evt.data]);

            }
        });
        //@ts-ignore
        this.dom.style.flow="visible";
        this.search.onkeydown(function (evt) {
            window.setTimeout(() => {
                _this.tree.filter(<string>_this.search.value);
                if (evt.code === "Enter") {
                    //_this.tree.
                }
            }, 100);
        });
    }


    
}

export function test() {
    var exp = new FileExplorer();
    exp.height = 100;
    return exp;

}


