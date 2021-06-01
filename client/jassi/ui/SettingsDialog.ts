import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { PropertyEditor } from "jassi/ui/PropertyEditor";
import { Button } from "jassi/ui/Button";
import { $Property } from "jassi/ui/Property";
import { $SettingsDescriptor } from "jassi/remote/Settings";
import { classes } from "jassi/remote/Classes";
import { ComponentDescriptor } from "jassi/ui/ComponentDescriptor";
import registry from "jassi/remote/Registry";

declare global {
    export interface KnownSettings {
        myuw:number;
        
    }
}
@$SettingsDescriptor()
@$Class("jassi_editor.Testuw")
export class Testuw {
    @$Property()
    myuw:number;
}


@$Class("jassi.ui.SettingsDialogCurrentSettings")
class SettingsDialogCurrentSettings{
    @$Property()
    test:string;
}
type Me = {
    propertyeditor?: PropertyEditor;
    OK?: Button;
};
@$Class("jassi.ui.SettingsDialog")
export class SettingsDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.propertyeditor = new PropertyEditor(undefined);
        me.OK = new Button();
        this.add(me.propertyeditor);
        this.add(me.OK);
        me.propertyeditor.width = "400";
        me.OK.text = "OK";
        me.OK.onclick(function (event) {
            
        });
    }
}
export async function test() {
    var ret = new SettingsDialog();
    var cl=await classes.loadClass("jassi_editor.CodeEditorSettingsDescriptor");
    await registry.loadAllFilesForService("$SettingsDescriptor");
    var allcl=registry.getData("$SettingsDescriptor");

    var all=ComponentDescriptor.describe(cl,true)
    var testob=new cl();
    ret.me.propertyeditor.value = testob;
    return ret;
}
