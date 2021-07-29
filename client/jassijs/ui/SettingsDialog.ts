import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Select } from "jassijs/ui/Select";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { Button } from "jassijs/ui/Button";
import { $Property } from "jassijs/ui/Property";
import { $SettingsDescriptor, Settings, settings } from "jassijs/remote/Settings";
import { classes } from "jassijs/remote/Classes";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import registry from "jassijs/remote/Registry";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
declare global {
    export interface KnownSettings {
        myuw: number;
    }
}
/** sample
@$SettingsDescriptor()
@$Class("jassijs_editor.Testuw")
class Testuw {
    @$Property()
    myuw: number;
}
@$Class("jassijs.ui.SettingsDialogCurrentSettings")
class SettingsDialogCurrentSettings {
    @$Property()
    test: string;
}
*/
type Me = {
    propertyeditor?: PropertyEditor;
    Save?: Button;
    Scope?: Select;
    htmlpanel1?: HTMLPanel;
};
@$Class("jassijs.ui.SettingsObject")
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
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs.ui.SettingsDialog")
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
    static async show() {
        windows.add(new SettingsDialog(), "Settings");
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
        me.propertyeditor = new PropertyEditor();
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
        me.propertyeditor.height = 145;
        me.Save.text = "Save";
        me.Save.onclick(function (event) {
            _this.save();
        });
        me.Save.icon = "mdi mdi-content-save-outline";
        me.Scope.width = "150";
        me.Scope.onchange(function (event) {
            _this.update();
        });
        this.update();
        me.htmlpanel1.value = "Settings for  ";
        me.htmlpanel1.width = "80";
        me.htmlpanel1.css({
            font_size: "small",
            font_weight: "bold"
        });
    }
}
export async function test() {
    var ret = new SettingsDialog();
    // var allcl=registry.getData("$SettingsDescriptor");
    //var all=ComponentDescriptor.describe(cl,true);
    return ret;
}
