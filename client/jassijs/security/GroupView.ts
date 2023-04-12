import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Group } from "jassijs/remote/security/Group";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    textbox?: Textbox;
    textbox2?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "jassijs.security.Group",icon:"mdi mdi-account-group",actionname:"Administration/Security/Groups" })
@$Class("jassijs/security/GroupView")
export class GroupView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Group;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
    }
    layout(me: Me) {
        me.textbox = new Textbox();
        me.textbox2 = new Textbox();
        this.me.main.height = "100";
        this.me.main.add(me.textbox);
        this.me.main.isAbsolute = true;
        this.me.main.add(me.textbox2);
        me.textbox.x = 5;
        me.textbox.y = 10;
        me.textbox.width = 45;
        me.textbox.autocommit = false;
        me.textbox.converter = new NumberConverter();
        me.textbox.bind = [this.me.databinder, "id"];
        me.textbox.label = "ID";
        me.textbox2.x = 65;
        me.textbox2.y = 10;
        me.textbox2.bind = [this.me.databinder, "name"];
        me.textbox2.label = "Name";
    }
}
export async function test() {
    var ret = new GroupView;
    ret["value"] = <Group>await Group.findOne();
    return ret;
}
