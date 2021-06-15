var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Tree", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Server", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/ui/OptionDialog", "jassijs_editor/util/Typescript", "jassijs/ui/ContextMenu", "jassijs/base/Windows"], function (require, exports, Jassi_1, Tree_1, Panel_1, Textbox_1, Server_1, Router_1, Actions_1, OptionDialog_1, Typescript_1, ContextMenu_1, Windows_1) {
    "use strict";
    var FileExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.FileExplorer = exports.FileActions = void 0;
    //drag from Desktop https://www.html5rocks.com/de/tutorials/file/dndfiles/
    let FileActions = class FileActions {
        static async newFile(all, fileName = undefined, code = "", open = false) {
            var _a, _b, _c, _d;
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            if (fileName === undefined) {
                var res = await OptionDialog_1.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, ".ts");
                if (res.button === "ok" && res.text !== all[0].name) {
                    fileName = res.text;
                }
                else
                    return;
            }
            console.log("create " + fileName);
            var key = (_b = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree) === null || _b === void 0 ? void 0 : _b.getKeyFromItem(all[0]);
            var newfile = path + "/" + fileName;
            var ret = await new Server_1.Server().createFile(newfile, code);
            var newkey = path + "|" + fileName;
            if (ret !== "") {
                alert(ret);
                return;
            }
            try {
                await ((_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.refresh());
                await ((_d = FileExplorer.instance) === null || _d === void 0 ? void 0 : _d.tree.activateKey(newkey));
                if (open)
                    Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + newkey.replaceAll("|", "/"));
            }
            catch (err) {
                debugger;
            }
        }
        static async download(all) {
            var path = all[0].fullpath;
            var byteCharacters = atob(await new Server_1.Server().zip(path));
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
        static async newFolder(all, filename = undefined) {
            var _a, _b, _c;
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            var res;
            if (filename) {
                res = { button: "ok", text: filename };
            }
            else
                res = await OptionDialog_1.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
            if (res.button === "ok" && res.text !== all[0].name) {
                console.log("create Folder" + res.text);
                var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0]);
                var newfile = path + "/" + res.text;
                var ret = await new Server_1.Server().createFolder(newfile);
                var newkey = path + "|" + res.text;
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(newkey);
            }
        }
        static async newModule(all) {
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            var res = await OptionDialog_1.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
            if (res.button === "ok" && res.text !== all[0].name) {
                var smodule = res.text.toLocaleLowerCase();
                if (Jassi_1.default.modules[smodule]) {
                    alert("modul allready exists");
                    return;
                }
                console.log("create Module" + smodule);
                var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
                var ret = await new Server_1.Server().createModule(smodule);
                var newkey = path + "|" + smodule;
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                else {
                    Jassi_1.default.modules[smodule] = smodule;
                }
                await FileExplorer.instance.refresh();
                FileExplorer.instance.tree.activateKey(newkey);
            }
        }
        static async dodelete(all, withwarning = true) {
            var _a, _b, _c;
            var s = "";
            all.forEach((node) => {
                s = s + "" + node.fullpath + "<br/>";
            });
            var res;
            if (withwarning) {
                res = await OptionDialog_1.OptionDialog.show("Delete this?<br/>" + s, ["ok", "cancel"], undefined, true);
            }
            if (!withwarning || (res.button === "ok" && res.text !== all[0].name)) {
                var ret = await new Server_1.Server().delete(all[0].fullpath);
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0].parent);
                await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(key);
            }
        }
        static async rename(all, foldername = undefined) {
            var _a, _b, _c;
            if (all.length !== 1)
                alert("only one file could be renamed");
            else {
                var res;
                if (foldername) {
                    res = { button: "ok", text: foldername };
                }
                else
                    res = await OptionDialog_1.OptionDialog.show("Enter new name:", ["ok", "cancel"], undefined, true, all[0].name);
                if (res.button === "ok" && res.text !== all[0].name) {
                    console.log("rename " + all[0].name + " to " + res.text);
                    var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0]);
                    var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                    var newfile = path + "/" + res.text;
                    var ret = await new Server_1.Server().rename(all[0].fullpath, newfile);
                    var newkey = key === null || key === void 0 ? void 0 : key.replace(all[0].name, res.text);
                    if (ret !== "") {
                        alert(ret);
                        return;
                    }
                    if (!all[0].isDirectory())
                        Typescript_1.default === null || Typescript_1.default === void 0 ? void 0 : Typescript_1.default.renameFile(all[0].fullpath, newfile);
                    await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                    (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(newkey);
                }
            }
        }
        static async refresh(all) {
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(key);
        }
        static async open(all) {
            var node = all[0];
            if (node.isDirectory())
                return;
            Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + node.fullpath);
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "New/File",
            icon: "mdi mdi-file",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String, String, Boolean]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFile", null);
    __decorate([
        Actions_1.$Action({
            name: "Download",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "download", null);
    __decorate([
        Actions_1.$Action({
            name: "New/Folder",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFolder", null);
    __decorate([
        Actions_1.$Action({
            name: "New/Module",
            isEnabled: function (all) {
                return all[0].name === "client" && all[0].fullpath === "";
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newModule", null);
    __decorate([
        Actions_1.$Action({ name: "Delete" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "dodelete", null);
    __decorate([
        Actions_1.$Action({ name: "Rename" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "rename", null);
    __decorate([
        Actions_1.$Action({ name: "Refresh" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "refresh", null);
    __decorate([
        Actions_1.$Action({
            name: "Open",
            isEnabled: function (all) {
                return !all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "open", null);
    FileActions = __decorate([
        Actions_1.$ActionProvider("jassijs.remote.FileNode"),
        Jassi_1.$Class("jassijs.ui.FileActions")
    ], FileActions);
    exports.FileActions = FileActions;
    let FileExplorer = FileExplorer_1 = class FileExplorer extends Panel_1.Panel {
        constructor() {
            super();
            FileExplorer_1.instance = this;
            //this.maximize();
            $(this.dom).css("width", "calc(100% - 8px)");
            $(this.dom).css("height", "calc(100% - 25px)"); //why 25????
            this.tree = new Tree_1.Tree();
            this.search = new Textbox_1.Textbox();
            this.layout();
            this.tree.propStyle = node => { return this.getStyle(node); };
        }
        static async show() {
            if (Windows_1.default.contains("Files"))
                var window = Windows_1.default.show("Files");
            else
                Windows_1.default.addLeft(new FileExplorer_1(), "Files");
        }
        getStyle(node) {
            var _a, _b;
            var ret = undefined;
            if (((_a = node.flag) === null || _a === void 0 ? void 0 : _a.indexOf("fromMap")) > -1) {
                ret = {
                    color: "green"
                };
            }
            if (((_b = node.flag) === null || _b === void 0 ? void 0 : _b.indexOf("module")) > -1) {
                ret = {
                    color: "blue"
                };
            }
            return ret;
        }
        async refresh() {
            var _a;
            let root = (await new Server_1.Server().dir());
            root.fullpath = "";
            root.name = "client";
            //flag modules
            for (let x = 0; x < root.files.length; x++) {
                if (Jassi_1.default.modules[root.files[x].name] !== undefined) {
                    root.files[x].flag = (((_a = root.files[x].flag) === null || _a === void 0 ? void 0 : _a.length) > 0) ? "module" : root.files[x].flag + " module";
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
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "files";
            let context = new ContextMenu_1.ContextMenu();
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
            $("#" + this._id).css("flow", "visible");
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    _this.tree.filter(_this.search.value);
                    if (evt.code === "Enter") {
                        //_this.tree.
                    }
                }, 100);
            });
        }
    };
    FileExplorer.instance = undefined;
    __decorate([
        Actions_1.$Action({
            name: "Windows/Development/Files",
            icon: "mdi mdi-file-tree",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FileExplorer, "show", null);
    FileExplorer = FileExplorer_1 = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        Jassi_1.$Class("jassijs.ui.FileExplorer"),
        __metadata("design:paramtypes", [])
    ], FileExplorer);
    exports.FileExplorer = FileExplorer;
    function test() {
        var exp = new FileExplorer();
        exp.height = 100;
        return exp;
    }
    exports.test = test;
});
//# sourceMappingURL=FileExplorer.js.map