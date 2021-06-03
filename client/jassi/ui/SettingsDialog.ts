import { HTMLPanel } from "jassi/ui/HTMLPanel";
import { Select } from "jassi/ui/Select";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { PropertyEditor } from "jassi/ui/PropertyEditor";
import { Button } from "jassi/ui/Button";
import { $Property } from "jassi/ui/Property";
import { $SettingsDescriptor, Settings, settings } from "jassi/remote/Settings";
import { classes } from "jassi/remote/Classes";
import { ComponentDescriptor } from "jassi/ui/ComponentDescriptor";
import registry from "jassi/remote/Registry";
import { $Action, $ActionProvider } from "jassi/base/Actions";
import windows from "jassi/base/Windows";
declare global {
    export interface KnownSettings {
        myuw: number;
    }
}
@$SettingsDescriptor()
@$Class("jassi_editor.Testuw")
export class Testuw {
    @$Property()
    myuw: number;
}
@$Class("jassi.ui.SettingsDialogCurrentSettings")
class SettingsDialogCurrentSettings {
    @$Property()
    test: string;
}
type Me = {
    propertyeditor?: PropertyEditor;
    Save?: Button;
    Scope?: Select;
    htmlpanel1?: HTMLPanel;
};

@$Class("jassi.ui.SettingsObject")
class SettingsObject {
    static customComponentDescriptor() {
        var allcl = registry.getData("$SettingsDescriptor");
        var ret = new ComponentDescriptor();
        ret.fields = [];
        for (var x = 0; x < allcl.length; x++) {
            var cl = allcl[x].oclass;
            var all = ComponentDescriptor.describe(cl, true);
            all.fields.forEach((f) => {
                ret.fields.push(f);
            });
        }
        return ret;
    }
}
@$ActionProvider("jassi.base.ActionNode")
@$Class("jassi.ui.SettingsDialog")
export class SettingsDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    @$Action({
    	name: "Settings",
       	icon: "mdi mdi-settings-helper",
    })
    static async show(){
       windows.add(new SettingsDialog(),"Settings");
    }
    private async update() {
        await Settings.load();
        await registry.loadAllFilesForService("$SettingsDescriptor");
        var testob = new SettingsObject();
        var scope = "browser";
        if (this.me.Scope.value === "current user") {
            Object.assign(testob, Settings.getAll("user"));
        }
        else if (this.me.Scope.value === "all users") {
            Object.assign(testob, Settings.getAll("allusers"));
        }
        else {
            Object.assign(testob, Settings.getAll("browser"));
        }
        this.me.propertyeditor.value = testob;
    }
    private async save() {
        var ob = this.me.propertyeditor.value;
        var scope = "browser";
        if (this.me.Scope.value === "current user") {
            await Settings.saveAll(ob, "user", true);
        }
        else if (this.me.Scope.value === "all users") {
            await Settings.saveAll(ob, "allusers", true);
        }
        else {
            await Settings.saveAll(ob, "browser", true);
        }
    }
    layout(me: Me) {
        var _this = this;
        me.propertyeditor = new PropertyEditor(undefined);
        me.Save = new Button();
        me.Scope = new Select();
        me.htmlpanel1 = new HTMLPanel();
        me.Scope.items = ["this browser", "current user", "all users"];
        me.Scope.value = "current user";
        this.add(me.htmlpanel1);
        this.add(me.Scope);
        this.add(me.propertyeditor);
        this.add(me.Save);
        me.propertyeditor.width = "400";
        me.Save.text = "Save";
        me.Save.onclick(function (event) {
            _this.save();
        });
        me.Save.icon = "mdi mdi-content-save-outline";
        me.Scope.width = "150";
        me.Scope.onchange(function (event) {
            _this.update();
        });
        me.htmlpanel1.width = "80";
        me.htmlpanel1.value = "Settings for&nbsp;<br>";
        this.update();
    }
}
export async function test() {
    var ret = new SettingsDialog();
    // var allcl=registry.getData("$SettingsDescriptor");
    //var all=ComponentDescriptor.describe(cl,true);
    return ret;
}
