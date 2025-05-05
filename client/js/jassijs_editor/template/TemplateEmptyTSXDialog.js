var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Actions_1, Registry_1, OptionDialog_1, FileExplorer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateEmptyTSXDialog = void 0;
    const code = `import { ComponentProperties,SimpleComponentProperties,createComponent } from "jassijs/ui/Component";
import { States,createRefs } from "jassijs/ui/State";
type Refs={};
interface {{dialogname}}Properties extends SimpleComponentProperties {
    sampleProp?: string;
}
function {{dialogname}}(props: {{dialogname}}Properties,states: States<{{dialogname}}Properties>) {
    var refs: Refs=createRefs();
    return <div>{states.sampleProp}</div>;
}
export function test() {
    var ret=<{{dialogname}} sampleProp="jj"></{{dialogname}}>;
    var comp=createComponent(ret);
    return comp;
}
`;
    let TemplateEmptyTSXDialog = class TemplateEmptyTSXDialog {
        static async newFile(all) {
            var res = await OptionDialog_1.OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{dialogname}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + res.text);
                FileExplorer_1.FileActions.newFile(all, res.text + ".tsx", scode, true);
            }
        }
    };
    TemplateEmptyTSXDialog.code = code;
    __decorate([
        (0, Actions_1.$Action)({
            name: "New/Dialog.tsx",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateEmptyTSXDialog, "newFile", null);
    TemplateEmptyTSXDialog = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.remote.FileNode"),
        (0, Registry_1.$Class)("jassijs_editor.template.TemplateEmptyTSXDialog")
    ], TemplateEmptyTSXDialog);
    exports.TemplateEmptyTSXDialog = TemplateEmptyTSXDialog;
});
//# sourceMappingURL=TemplateEmptyTSXDialog.js.map