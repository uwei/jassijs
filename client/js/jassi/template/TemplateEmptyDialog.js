var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/base/Actions", "jassi/remote/Jassi", "jassi/ui/OptionDialog", "jassi/ui/FileExplorer"], function (require, exports, Actions_1, Jassi_1, OptionDialog_1, FileExplorer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateEmptyDialog = void 0;
    const code = `import { $Class } from "remote/jassi/base/Jassi";
import {Panel} from "jassi/ui/Panel";

type Me = {
}

@$Class("{{fullclassname}}")
export class {{dialogname}} extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
	}
}

export async function test(){
	var ret=new {{dialogname}}();
	return ret;
}`;
    let TemplateEmptyDialog = class TemplateEmptyDialog {
        static async newFile(all) {
            var res = await OptionDialog_1.OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{dialogname}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + res.text);
                FileExplorer_1.FileActions.newFile(all, res.text + ".ts", scode, true);
            }
        }
    };
    TemplateEmptyDialog.code = code;
    __decorate([
        Actions_1.$Action({
            name: "New/Dialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateEmptyDialog, "newFile", null);
    TemplateEmptyDialog = __decorate([
        Actions_1.$ActionProvider("jassi.remote.FileNode"),
        Jassi_1.$Class("jassi.ui.TemplateEmptyDialog")
    ], TemplateEmptyDialog);
    exports.TemplateEmptyDialog = TemplateEmptyDialog;
});
//# sourceMappingURL=TemplateEmptyDialog.js.map