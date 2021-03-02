import jassi, { $Class } from "jassi/remote/Jassi";
import { Tree } from "jassi/ui/Tree";
import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";
import { Server } from "jassi/remote/Server";
import { router } from "jassi/base/Router";
import { FileNode } from "jassi/remote/FileNode";
import { $ActionProvider, $Action, Actions } from "jassi/base/Actions";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { Menu } from "jassi/ui/Menu";
import { MenuItem } from "jassi/ui/MenuItem";
import typescript, { Typescript } from "jassi_editor/util/Typescript";
import { ContextMenu } from "jassi/ui/ContextMenu";
//drag from Desktop https://www.html5rocks.com/de/tutorials/file/dndfiles/
@$ActionProvider("jassi.remote.FileNode")
@$Class("jassi.ui.FileActions")
export class FileActions {
	
    @$Action({
        name: "New/File",
        icon: "mdi mdi-file",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[], fileName:string = undefined,code:string="",open:boolean=false) {
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
        console.log("create " + fileName);
        var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
        var newfile = path + "/" + fileName;
        
        var ret = await new Server().createFile(newfile, code);
        var newkey = path + "|" + fileName;
        if (ret !== "") {
            alert(ret);
            return;
        }
        try{
        await FileExplorer.instance.refresh();
        await FileExplorer.instance.tree.activateKey(newkey);
        if(open)
        	router.navigate("#do=jassi_editor.CodeEditor&file=" + newkey.replaceAll("|","/"));
        }catch(err){
debugger;
        }
    }
    @$Action({
        name: "Download",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async download(all: FileNode[]) {
        if (all.length === 0 || !all[0].isDirectory())
            return;
        var path = all[0].fullpath;
        var url = "/zip?path=client/" + path;
        if (all[0].name === "client" && all[0].fullpath === "")
            url = "/zip?path=client";
        if (all[0].name === "server" && all[0].fullpath === "")
            url = "/zip?path=server";
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        link.remove();
    }

    @$Action({
        name: "New/Folder",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFolder(all: FileNode[]) {
        if (all.length === 0 || !all[0].isDirectory())
            return;
        var path = all[0].fullpath;

        var res = await OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
        if (res.button === "ok" && res.text !== all[0].name) {
            console.log("create Folder" + res.text);
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
            var newfile = path + "/" + res.text;
            var ret = await new Server().createFolder(newfile);
            var newkey = path + "|" + res.text;
            if (ret !== "") {
                alert(ret);
                return;
            }
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(newkey);
        }

    }
    @$Action({ name: "Delete" })
    static async dodelete(all: FileNode[]) {
        var s = "";
        all.forEach((node) => {
            s = s + "" + node.fullpath + "<br/>";
        })
        var res = await OptionDialog.show("Delete this?<br/>" + s, ["ok", "cancel"], undefined, true);
        if (res.button === "ok" && res.text !== all[0].name) {
            var ret = await new Server().delete(all[0].fullpath);
            if (ret !== "") {
                alert(ret);
                return;
            }
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0].parent);
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(key);
        }
    }
    @$Action({ name: "Rename" })
    static async rename(all: FileNode[]) {
        if (all.length !== 1)
            alert("only one file could be renamed");
        else {
            var res = await OptionDialog.show("Enter new name:", ["ok", "cancel"], undefined, true, all[0].name);
            if (res.button === "ok" && res.text !== all[0].name) {
                console.log("rename " + all[0].name + " to " + res.text);
                var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
                var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                var newfile = path + "/" + res.text;
                var ret = await new Server().rename(all[0].fullpath, newfile);
                var newkey = key.replace(all[0].name, res.text);
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                if (!all[0].isDirectory())
                    typescript.renameFile(all[0].fullpath, newfile);
                await FileExplorer.instance.refresh();
                FileExplorer.instance.tree.activateKey(newkey);
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
        name: "Open", isEnabled: function(all: FileNode[]): boolean {
            return !all[0].isDirectory();
        }    
})
    static async open(all: FileNode[]) {
        var node: FileNode = all[0];
        if (node.isDirectory())
            return;
        router.navigate("#do=jassi_editor.CodeEditor&file=" + node.fullpath);
    }

}

@$Class("jassi.ui.FileExplorer")
export class FileExplorer extends Panel {
    tree: Tree;
    _files: any;
    search: Textbox;
    static instance: FileExplorer = undefined;
    constructor() {
        super();
        FileExplorer.instance = this;
        //this.maximize();
        $(this.dom).css("width", "calc(100% - 8px)");
        $(this.dom).css("height", "calc(100% - 25px)");//why 25????
        this.tree = new Tree();
        this.search = new Textbox();
        this.layout();
    }
    async refresh() {
        let root = (await new Server().dir());
        root.fullpath = "";
        root.name = "client";
        
        var keys = this.tree.getExpandedKeys();
        this.tree.items = [root];
        if(keys.indexOf("client")===-1)
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
        this.tree.onclick(function(evt) {

            if (evt.data !== undefined) {
                FileActions.open([evt.data]);

            }
        });
        $("#" + this._id).css("flow", "visible");
        this.search.onkeydown(function(evt) {
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
    return new FileExplorer();

}


