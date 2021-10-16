var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Tree", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Server", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/ui/OptionDialog", "jassijs/ui/ContextMenu", "jassijs/base/Windows"], function (require, exports, Jassi_1, Tree_1, Panel_1, Textbox_1, Server_1, Router_1, Actions_1, OptionDialog_1, ContextMenu_1, Windows_1) {
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
            //console.log("create " + fileName);
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
                // console.log("create Folder" + res.text);
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
                    //console.log("rename " + all[0].name + " to " + res.text);
                    var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0]);
                    var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                    var newfile = path + "/" + res.text;
                    var ret = await new Server_1.Server().rename(all[0].fullpath, newfile);
                    var newkey = key === null || key === void 0 ? void 0 : key.replace(all[0].name, res.text);
                    if (ret !== "") {
                        alert(ret);
                        return;
                    }
                    if (!all[0].isDirectory()) {
                        let typescript = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); })).default;
                        await (typescript === null || typescript === void 0 ? void 0 : typescript.renameFile(all[0].fullpath, newfile));
                    }
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
            name: "Open", isEnabled: function (all) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZUV4cGxvcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9GaWxlRXhwbG9yZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFlQSwwRUFBMEU7SUFHMUUsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztRQVNwQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFlLEVBQUUsV0FBbUIsU0FBUyxFQUFFLE9BQWUsRUFBRSxFQUFFLE9BQWdCLEtBQUs7O1lBQ3hHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO2dCQUN6QyxPQUFPO1lBQ1gsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUMzQixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sMkJBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEcsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQ2pELFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO2lCQUN2Qjs7b0JBQ0csT0FBTzthQUNkO1lBQ0Qsb0NBQW9DO1lBQ3BDLElBQUksR0FBRyxHQUFHLE1BQUEsTUFBQSxZQUFZLENBQUMsUUFBUSwwQ0FBRSxJQUFJLDBDQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLFFBQVEs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QUksR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsT0FBTyxHQUFHLENBQUM7SUFFZixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgVHJlZSB9IGZyb20gXCJqYXNzaWpzL3VpL1RyZWVcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2VydmVyXCI7XHJcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvUm91dGVyXCI7XHJcbmltcG9ydCB7IEZpbGVOb2RlIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0ZpbGVOb2RlXCI7XHJcbmltcG9ydCB7ICRBY3Rpb25Qcm92aWRlciwgJEFjdGlvbiwgQWN0aW9ucyB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQWN0aW9uc1wiO1xyXG5pbXBvcnQgeyBPcHRpb25EaWFsb2cgfSBmcm9tIFwiamFzc2lqcy91aS9PcHRpb25EaWFsb2dcIjtcclxuaW1wb3J0IHsgTWVudSB9IGZyb20gXCJqYXNzaWpzL3VpL01lbnVcIjtcclxuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tIFwiamFzc2lqcy91aS9NZW51SXRlbVwiO1xyXG5cclxuaW1wb3J0IHsgQ29udGV4dE1lbnUgfSBmcm9tIFwiamFzc2lqcy91aS9Db250ZXh0TWVudVwiO1xyXG5pbXBvcnQgeyBDU1NQcm9wZXJ0aWVzIH0gZnJvbSBcImphc3NpanMvdWkvQ1NTUHJvcGVydGllc1wiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuLy9kcmFnIGZyb20gRGVza3RvcCBodHRwczovL3d3dy5odG1sNXJvY2tzLmNvbS9kZS90dXRvcmlhbHMvZmlsZS9kbmRmaWxlcy9cclxuQCRBY3Rpb25Qcm92aWRlcihcImphc3NpanMucmVtb3RlLkZpbGVOb2RlXCIpXHJcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLkZpbGVBY3Rpb25zXCIpXHJcbmV4cG9ydCBjbGFzcyBGaWxlQWN0aW9ucyB7XHJcblxyXG4gICAgQCRBY3Rpb24oe1xyXG4gICAgICAgIG5hbWU6IFwiTmV3L0ZpbGVcIixcclxuICAgICAgICBpY29uOiBcIm1kaSBtZGktZmlsZVwiLFxyXG4gICAgICAgIGlzRW5hYmxlZDogZnVuY3Rpb24gKGFsbDogRmlsZU5vZGVbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsWzBdLmlzRGlyZWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHN0YXRpYyBhc3luYyBuZXdGaWxlKGFsbDogRmlsZU5vZGVbXSwgZmlsZU5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCwgY29kZTogc3RyaW5nID0gXCJcIiwgb3BlbjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKGFsbC5sZW5ndGggPT09IDAgfHwgIWFsbFswXS5pc0RpcmVjdG9yeSgpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHBhdGggPSBhbGxbMF0uZnVsbHBhdGg7XHJcbiAgICAgICAgaWYgKGZpbGVOYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGF3YWl0IE9wdGlvbkRpYWxvZy5zaG93KFwiRW50ZXIgZmlsZSBuYW1lOlwiLCBbXCJva1wiLCBcImNhbmNlbFwiXSwgdW5kZWZpbmVkLCB0cnVlLCBcIi50c1wiKTtcclxuICAgICAgICAgICAgaWYgKHJlcy5idXR0b24gPT09IFwib2tcIiAmJiByZXMudGV4dCAhPT0gYWxsWzBdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gcmVzLnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3JlYXRlIFwiICsgZmlsZU5hbWUpO1xyXG4gICAgICAgIHZhciBrZXkgPSBGaWxlRXhwbG9yZXIuaW5zdGFuY2U/LnRyZWU/LmdldEtleUZyb21JdGVtKGFsbFswXSk7XHJcbiAgICAgICAgdmFyIG5ld2ZpbGUgPSBwYXRoICsgXCIvXCIgKyBmaWxlTmFtZTtcclxuXHJcbiAgICAgICAgdmFyIHJldCA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5jcmVhdGVGaWxlKG5ld2ZpbGUsIGNvZGUpO1xyXG4gICAgICAgIHZhciBuZXdrZXkgPSBwYXRoICsgXCJ8XCIgKyBmaWxlTmFtZTtcclxuICAgICAgICBpZiAocmV0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KHJldCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgRmlsZUV4cGxvcmVyLmluc3RhbmNlPy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IEZpbGVFeHBsb3Jlci5pbnN0YW5jZT8udHJlZS5hY3RpdmF0ZUtleShuZXdrZXkpO1xyXG4gICAgICAgICAgICBpZiAob3BlbilcclxuICAgICAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcIiNkbz1qYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yJmZpbGU9XCIgKyBuZXdrZXkucmVwbGFjZUFsbChcInxcIiwgXCIvXCIpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQCRBY3Rpb24oe1xyXG4gICAgICAgIG5hbWU6IFwiRG93bmxvYWRcIixcclxuICAgICAgICBpc0VuYWJsZWQ6IGZ1bmN0aW9uIChhbGw6IEZpbGVOb2RlW10pOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbFswXS5pc0RpcmVjdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgZG93bmxvYWQoYWxsOiBGaWxlTm9kZVtdKSB7XHJcblxyXG4gICAgICAgIHZhciBwYXRoID0gYWxsWzBdLmZ1bGxwYXRoO1xyXG4gICAgICAgIHZhciBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYXdhaXQgbmV3IFNlcnZlcigpLnppcChwYXRoKSk7XHJcbiAgICAgICAgY29uc3QgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoYnl0ZUNoYXJhY3RlcnMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGJ5dGVOdW1iZXJzW2ldID0gYnl0ZUNoYXJhY3RlcnMuY2hhckNvZGVBdChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xyXG4gICAgICAgIC8vIElmIHlvdSB3YW50IHRvIHVzZSB0aGUgaW1hZ2UgaW4geW91ciBET006XHJcbiAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbYnl0ZUFycmF5XSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL3ppcFwiIH0pO1xyXG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICAgICAgbGluay5ocmVmID0gdXJsO1xyXG4gICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICBsaW5rLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIk5ldy9Gb2xkZXJcIixcclxuICAgICAgICBpc0VuYWJsZWQ6IGZ1bmN0aW9uIChhbGw6IEZpbGVOb2RlW10pOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbFswXS5pc0RpcmVjdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgbmV3Rm9sZGVyKGFsbDogRmlsZU5vZGVbXSwgZmlsZW5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChhbGwubGVuZ3RoID09PSAwIHx8ICFhbGxbMF0uaXNEaXJlY3RvcnkoKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwYXRoID0gYWxsWzBdLmZ1bGxwYXRoO1xyXG5cclxuICAgICAgICB2YXIgcmVzO1xyXG4gICAgICAgIGlmIChmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICByZXMgPSB7IGJ1dHRvbjogXCJva1wiLCB0ZXh0OiBmaWxlbmFtZSB9O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICByZXMgPSBhd2FpdCBPcHRpb25EaWFsb2cuc2hvdyhcIkVudGVyIGZpbGUgbmFtZTpcIiwgW1wib2tcIiwgXCJjYW5jZWxcIl0sIHVuZGVmaW5lZCwgdHJ1ZSwgXCJcIik7XHJcbiAgICAgICAgaWYgKHJlcy5idXR0b24gPT09IFwib2tcIiAmJiByZXMudGV4dCAhPT0gYWxsWzBdLm5hbWUpIHtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNyZWF0ZSBGb2xkZXJcIiArIHJlcy50ZXh0KTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IEZpbGVFeHBsb3Jlci5pbnN0YW5jZT8udHJlZS5nZXRLZXlGcm9tSXRlbShhbGxbMF0pO1xyXG4gICAgICAgICAgICB2YXIgbmV3ZmlsZSA9IHBhdGggKyBcIi9cIiArIHJlcy50ZXh0O1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgbmV3IFNlcnZlcigpLmNyZWF0ZUZvbGRlcihuZXdmaWxlKTtcclxuICAgICAgICAgICAgdmFyIG5ld2tleSA9IHBhdGggKyBcInxcIiArIHJlcy50ZXh0O1xyXG4gICAgICAgICAgICBpZiAocmV0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChyZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IEZpbGVFeHBsb3Jlci5pbnN0YW5jZT8ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICBGaWxlRXhwbG9yZXIuaW5zdGFuY2U/LnRyZWUuYWN0aXZhdGVLZXkobmV3a2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgQCRBY3Rpb24oe1xyXG4gICAgICAgIG5hbWU6IFwiTmV3L01vZHVsZVwiLFxyXG4gICAgICAgIGlzRW5hYmxlZDogZnVuY3Rpb24gKGFsbDogRmlsZU5vZGVbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsWzBdLm5hbWUgPT09IFwiY2xpZW50XCIgJiYgYWxsWzBdLmZ1bGxwYXRoID09PSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgbmV3TW9kdWxlKGFsbDogRmlsZU5vZGVbXSkge1xyXG4gICAgICAgIGlmIChhbGwubGVuZ3RoID09PSAwIHx8ICFhbGxbMF0uaXNEaXJlY3RvcnkoKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwYXRoID0gYWxsWzBdLmZ1bGxwYXRoO1xyXG5cclxuICAgICAgICB2YXIgcmVzID0gYXdhaXQgT3B0aW9uRGlhbG9nLnNob3coXCJFbnRlciBmaWxlIG5hbWU6XCIsIFtcIm9rXCIsIFwiY2FuY2VsXCJdLCB1bmRlZmluZWQsIHRydWUsIFwiXCIpO1xyXG4gICAgICAgIGlmIChyZXMuYnV0dG9uID09PSBcIm9rXCIgJiYgcmVzLnRleHQgIT09IGFsbFswXS5uYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBzbW9kdWxlID0gcmVzLnRleHQudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKGphc3NpanMubW9kdWxlc1tzbW9kdWxlXSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJtb2R1bCBhbGxyZWFkeSBleGlzdHNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGtleSA9IEZpbGVFeHBsb3Jlci5pbnN0YW5jZS50cmVlLmdldEtleUZyb21JdGVtKGFsbFswXSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgbmV3IFNlcnZlcigpLmNyZWF0ZU1vZHVsZShzbW9kdWxlKTtcclxuICAgICAgICAgICAgdmFyIG5ld2tleSA9IHBhdGggKyBcInxcIiArIHNtb2R1bGU7XHJcbiAgICAgICAgICAgIGlmIChyZXQgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KHJldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBqYXNzaWpzLm1vZHVsZXNbc21vZHVsZV0gPSBzbW9kdWxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IEZpbGVFeHBsb3Jlci5pbnN0YW5jZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIEZpbGVFeHBsb3Jlci5pbnN0YW5jZS50cmVlLmFjdGl2YXRlS2V5KG5ld2tleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIEAkQWN0aW9uKHsgbmFtZTogXCJEZWxldGVcIiB9KVxyXG4gICAgc3RhdGljIGFzeW5jIGRvZGVsZXRlKGFsbDogRmlsZU5vZGVbXSwgd2l0aHdhcm5pbmcgPSB0cnVlKSB7XHJcbiAgICAgICAgdmFyIHMgPSBcIlwiO1xyXG4gICAgICAgIGFsbC5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIHMgPSBzICsgXCJcIiArIG5vZGUuZnVsbHBhdGggKyBcIjxici8+XCI7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB2YXIgcmVzO1xyXG4gICAgICAgIGlmICh3aXRod2FybmluZykge1xyXG4gICAgICAgICAgICByZXMgPSBhd2FpdCBPcHRpb25EaWFsb2cuc2hvdyhcIkRlbGV0ZSB0aGlzPzxici8+XCIgKyBzLCBbXCJva1wiLCBcImNhbmNlbFwiXSwgdW5kZWZpbmVkLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF3aXRod2FybmluZyB8fCAocmVzLmJ1dHRvbiA9PT0gXCJva1wiICYmIHJlcy50ZXh0ICE9PSBhbGxbMF0ubmFtZSkpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5kZWxldGUoYWxsWzBdLmZ1bGxwYXRoKTtcclxuICAgICAgICAgICAgaWYgKHJldCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmV0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIga2V5ID0gRmlsZUV4cGxvcmVyLmluc3RhbmNlPy50cmVlLmdldEtleUZyb21JdGVtKGFsbFswXS5wYXJlbnQpO1xyXG4gICAgICAgICAgICBhd2FpdCBGaWxlRXhwbG9yZXIuaW5zdGFuY2U/LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgRmlsZUV4cGxvcmVyLmluc3RhbmNlPy50cmVlLmFjdGl2YXRlS2V5KGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQCRBY3Rpb24oeyBuYW1lOiBcIlJlbmFtZVwiIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgcmVuYW1lKGFsbDogRmlsZU5vZGVbXSwgZm9sZGVybmFtZSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChhbGwubGVuZ3RoICE9PSAxKVxyXG4gICAgICAgICAgICBhbGVydChcIm9ubHkgb25lIGZpbGUgY291bGQgYmUgcmVuYW1lZFwiKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHJlcztcclxuICAgICAgICAgICAgaWYgKGZvbGRlcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHsgYnV0dG9uOiBcIm9rXCIsIHRleHQ6IGZvbGRlcm5hbWUgfTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXMgPSBhd2FpdCBPcHRpb25EaWFsb2cuc2hvdyhcIkVudGVyIG5ldyBuYW1lOlwiLCBbXCJva1wiLCBcImNhbmNlbFwiXSwgdW5kZWZpbmVkLCB0cnVlLCBhbGxbMF0ubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXMuYnV0dG9uID09PSBcIm9rXCIgJiYgcmVzLnRleHQgIT09IGFsbFswXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicmVuYW1lIFwiICsgYWxsWzBdLm5hbWUgKyBcIiB0byBcIiArIHJlcy50ZXh0KTtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBGaWxlRXhwbG9yZXIuaW5zdGFuY2U/LnRyZWUuZ2V0S2V5RnJvbUl0ZW0oYWxsWzBdKTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gYWxsWzBdLnBhcmVudCAhPT0gdW5kZWZpbmVkID8gYWxsWzBdLnBhcmVudC5mdWxscGF0aCA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3ZmlsZSA9IHBhdGggKyBcIi9cIiArIHJlcy50ZXh0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5yZW5hbWUoYWxsWzBdLmZ1bGxwYXRoLCBuZXdmaWxlKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdrZXkgPSBrZXk/LnJlcGxhY2UoYWxsWzBdLm5hbWUsIHJlcy50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChyZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghYWxsWzBdLmlzRGlyZWN0b3J5KCkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZXNjcmlwdCA9IChhd2FpdCBpbXBvcnQoXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIikpLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHlwZXNjcmlwdD8ucmVuYW1lRmlsZShhbGxbMF0uZnVsbHBhdGgsIG5ld2ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgRmlsZUV4cGxvcmVyLmluc3RhbmNlPy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICBGaWxlRXhwbG9yZXIuaW5zdGFuY2U/LnRyZWUuYWN0aXZhdGVLZXkobmV3a2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEAkQWN0aW9uKHsgbmFtZTogXCJSZWZyZXNoXCIgfSlcclxuICAgIHN0YXRpYyBhc3luYyByZWZyZXNoKGFsbDogRmlsZU5vZGVbXSkge1xyXG4gICAgICAgIHZhciBrZXkgPSBGaWxlRXhwbG9yZXIuaW5zdGFuY2UudHJlZS5nZXRLZXlGcm9tSXRlbShhbGxbMF0pO1xyXG4gICAgICAgIGF3YWl0IEZpbGVFeHBsb3Jlci5pbnN0YW5jZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgRmlsZUV4cGxvcmVyLmluc3RhbmNlLnRyZWUuYWN0aXZhdGVLZXkoa2V5KTtcclxuICAgIH1cclxuICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIk9wZW5cIiwgaXNFbmFibGVkOiBmdW5jdGlvbiAoYWxsOiBGaWxlTm9kZVtdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhYWxsWzBdLmlzRGlyZWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHN0YXRpYyBhc3luYyBvcGVuKGFsbDogRmlsZU5vZGVbXSkge1xyXG4gICAgICAgIHZhciBub2RlOiBGaWxlTm9kZSA9IGFsbFswXTtcclxuICAgICAgICBpZiAobm9kZS5pc0RpcmVjdG9yeSgpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiI2RvPWphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3ImZmlsZT1cIiArIG5vZGUuZnVsbHBhdGgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5AJEFjdGlvblByb3ZpZGVyKFwiamFzc2lqcy5iYXNlLkFjdGlvbk5vZGVcIilcclxuQCRDbGFzcyhcImphc3NpanMudWkuRmlsZUV4cGxvcmVyXCIpXHJcbmV4cG9ydCBjbGFzcyBGaWxlRXhwbG9yZXIgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICB0cmVlOiBUcmVlO1xyXG4gICAgX2ZpbGVzOiBhbnk7XHJcbiAgICBzZWFyY2g6IFRleHRib3g7XHJcbiAgICBzdGF0aWMgaW5zdGFuY2U6IEZpbGVFeHBsb3JlciA9IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgRmlsZUV4cGxvcmVyLmluc3RhbmNlID0gdGhpcztcclxuICAgICAgICAvL3RoaXMubWF4aW1pemUoKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJ3aWR0aFwiLCBcImNhbGMoMTAwJSAtIDhweClcIik7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiaGVpZ2h0XCIsIFwiY2FsYygxMDAlIC0gMjVweClcIik7Ly93aHkgMjU/Pz8/XHJcbiAgICAgICAgdGhpcy50cmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICB0aGlzLnNlYXJjaCA9IG5ldyBUZXh0Ym94KCk7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcclxuICAgICAgICB0aGlzLnRyZWUucHJvcFN0eWxlID0gbm9kZSA9PiB7IHJldHVybiB0aGlzLmdldFN0eWxlKG5vZGUpIH07XHJcbiAgICB9XHJcbiAgICBAJEFjdGlvbih7XHJcbiAgICAgICAgbmFtZTogXCJXaW5kb3dzL0RldmVsb3BtZW50L0ZpbGVzXCIsXHJcbiAgICAgICAgaWNvbjogXCJtZGkgbWRpLWZpbGUtdHJlZVwiLFxyXG4gICAgfSlcclxuICAgIHN0YXRpYyBhc3luYyBzaG93KCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dzLmNvbnRhaW5zKFwiRmlsZXNcIikpXHJcbiAgICAgICAgICAgIHZhciB3aW5kb3cgPSB3aW5kb3dzLnNob3coXCJGaWxlc1wiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHdpbmRvd3MuYWRkTGVmdChuZXcgRmlsZUV4cGxvcmVyKCksIFwiRmlsZXNcIik7XHJcbiAgICB9XHJcbiAgICBnZXRTdHlsZShub2RlOiBGaWxlTm9kZSk6IENTU1Byb3BlcnRpZXMge1xyXG4gICAgICAgIHZhciByZXQ6IENTU1Byb3BlcnRpZXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKG5vZGUuZmxhZz8uaW5kZXhPZihcImZyb21NYXBcIikgPiAtMSkge1xyXG4gICAgICAgICAgICByZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJncmVlblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUuZmxhZz8uaW5kZXhPZihcIm1vZHVsZVwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBcImJsdWVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcmVmcmVzaCgpIHtcclxuICAgICAgICBsZXQgcm9vdCA9IChhd2FpdCBuZXcgU2VydmVyKCkuZGlyKCkpO1xyXG4gICAgICAgIHJvb3QuZnVsbHBhdGggPSBcIlwiO1xyXG4gICAgICAgIHJvb3QubmFtZSA9IFwiY2xpZW50XCI7XHJcbiAgICAgICAgLy9mbGFnIG1vZHVsZXNcclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHJvb3QuZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChqYXNzaWpzLm1vZHVsZXNbcm9vdC5maWxlc1t4XS5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByb290LmZpbGVzW3hdLmZsYWcgPSAocm9vdC5maWxlc1t4XS5mbGFnPy5sZW5ndGggPiAwKSA/IFwibW9kdWxlXCIgOiByb290LmZpbGVzW3hdLmZsYWcgKyBcIiBtb2R1bGVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIga2V5cyA9IHRoaXMudHJlZS5nZXRFeHBhbmRlZEtleXMoKTtcclxuICAgICAgICB0aGlzLnRyZWUuaXRlbXMgPSBbcm9vdF07XHJcbiAgICAgICAgaWYgKGtleXMuaW5kZXhPZihcImNsaWVudFwiKSA9PT0gLTEpXHJcbiAgICAgICAgICAgIGtleXMucHVzaChcImNsaWVudFwiKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnRyZWUuZXhwYW5kS2V5cyhrZXlzKTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBsYXlvdXQoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnRyZWUud2lkdGggPSBcIjEwMCVcIlxyXG4gICAgICAgIHRoaXMudHJlZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgICBzdXBlci5hZGQodGhpcy5zZWFyY2gpO1xyXG4gICAgICAgIHN1cGVyLmFkZCh0aGlzLnRyZWUpO1xyXG4gICAgICAgIHRoaXMudHJlZS5wcm9wRGlzcGxheSA9IFwibmFtZVwiO1xyXG4gICAgICAgIHRoaXMudHJlZS5wcm9wQ2hpbGRzID0gXCJmaWxlc1wiO1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gbmV3IENvbnRleHRNZW51KCk7XHJcbiAgICAgICAgdGhpcy50cmVlLmNvbnRleHRNZW51ID0gY29udGV4dDtcclxuICAgICAgICBjb250ZXh0LmluY2x1ZGVDbGFzc0FjdGlvbnMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMudHJlZSk7XHJcbiAgICAgICAgLy8gdGhpcy5fZmlsZXMuZmlsZXM7XHJcbiAgICAgICAgdGhpcy50cmVlLm9uY2xpY2soZnVuY3Rpb24gKGV2dCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2dC5kYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIEZpbGVBY3Rpb25zLm9wZW4oW2V2dC5kYXRhXSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2lkKS5jc3MoXCJmbG93XCIsIFwidmlzaWJsZVwiKTtcclxuICAgICAgICB0aGlzLnNlYXJjaC5vbmtleWRvd24oZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy50cmVlLmZpbHRlcig8c3RyaW5nPl90aGlzLnNlYXJjaC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZ0LmNvZGUgPT09IFwiRW50ZXJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vX3RoaXMudHJlZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgdmFyIGV4cCA9IG5ldyBGaWxlRXhwbG9yZXIoKTtcclxuICAgIGV4cC5oZWlnaHQgPSAxMDA7XHJcbiAgICByZXR1cm4gZXhwO1xyXG5cclxufVxyXG5cclxuXHJcbiJdfQ==