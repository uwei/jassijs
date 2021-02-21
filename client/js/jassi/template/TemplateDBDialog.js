var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/base/Actions", "jassi/remote/Jassi", "jassi/ui/OptionDialog", "jassi/ui/FileExplorer", "jassi/ui/Property", "jassi/remote/DBObject", "jassi/remote/Classes", "jassi/remote/Registry"], function (require, exports, Actions_1, Jassi_1, OptionDialog_1, FileExplorer_1, Property_1, DBObject_1, Classes_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateDBDialog = exports.TemplateDBDialogProperties = void 0;
    const code = `import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: {{dbclassname}};
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new {{dialogname}};
	
	ret["value"]=<{{dbclassname}}>await {{dbclassname}}.findOne();
	return ret;
}`;
    let TemplateDBDialogProperties = class TemplateDBDialogProperties {
    };
    __decorate([
        Property_1.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TemplateDBDialogProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_1.$Property({ type: "classselector", service: "$DBObject" }),
        __metadata("design:type", DBObject_1.DBObject)
    ], TemplateDBDialogProperties.prototype, "dbobject", void 0);
    TemplateDBDialogProperties = __decorate([
        Jassi_1.$Class("jassi.ui.TemplateDBDialogProperties")
    ], TemplateDBDialogProperties);
    exports.TemplateDBDialogProperties = TemplateDBDialogProperties;
    let TemplateDBDialog = class TemplateDBDialog {
        static async newFile(all) {
            var props = new TemplateDBDialogProperties();
            var res = await OptionDialog_1.OptionDialog.askProperties("Create new DBDialog:", props, ["ok", "cancel"], undefined, false);
            if (res.button === "ok") {
                var scode = code.replaceAll("{{dialogname}}", props.dialogname);
                var fulldbclassname = Classes_1.classes.getClassName(props.dbobject);
                var shortdbclassname = fulldbclassname.split(".")[fulldbclassname.split(".").length - 1];
                var cl = await Registry_1.default.getJSONData("$Class", fulldbclassname);
                var dbfilename = cl[0].filename;
                dbfilename = dbfilename.substring(0, dbfilename.length - 3);
                scode = scode.replaceAll("{{fullclassname}}", (all[0].fullpath + "/" + props.dialogname).replaceAll("/", "."));
                scode = scode.replaceAll("{{dbclassname}}", shortdbclassname);
                scode = scode.replaceAll("{{fulldbclassname}}", fulldbclassname);
                scode = scode.replaceAll("{{dbfilename}}", dbfilename);
                FileExplorer_1.FileActions.newFile(all, props.dialogname + ".ts", scode, true);
            }
        }
    };
    TemplateDBDialog.code = code;
    __decorate([
        Actions_1.$Action({
            name: "New/DBDialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateDBDialog, "newFile", null);
    TemplateDBDialog = __decorate([
        Actions_1.$ActionProvider("jassi.remote.FileNode"),
        Jassi_1.$Class("jassi.ui.TemplateDBDialog")
    ], TemplateDBDialog);
    exports.TemplateDBDialog = TemplateDBDialog;
});
//# sourceMappingURL=TemplateDBDialog.js.map