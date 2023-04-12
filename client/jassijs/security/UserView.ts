import { Select } from "jassijs/ui/Select";
import { Checkbox } from "jassijs/ui/Checkbox";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { User } from "jassijs/remote/security/User";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, DBObjectViewMe, $DBObjectView } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
import { notify } from "jassijs/ui/Notify";
import { $ActionProvider } from "jassijs/base/Actions";
import { Group } from "jassijs/remote/security/Group";
type Me = {
    IDID?: Textbox;
    IDEmail?: Textbox;
    checkbox?: Checkbox;
    panel?: Panel;
    IDGroups?: Select;
} & DBObjectViewMe;
@$DBObjectView({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline",queryname:"findWithRelations" })
@$Class("jassijs/security/UserView")
export class UserView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: User;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "User" : "User " + this.value.email;
    }
    layout(me: Me) {
        me.IDID = new Textbox();
        me.IDEmail = new Textbox();
        me.checkbox = new Checkbox();
        me.panel = new Panel();
        me.IDGroups = new Select({ multiple: true });
        me.IDID.bind = [me.databinder, "id"];
        me.IDID.width = 40;
        me.IDID.converter = new NumberConverter();
        me.IDID.label = "ID";
        me.IDEmail.bind = [me.databinder, "email"];
        me.IDEmail.label = "E-Mail";
        this.me.main.height = "100";
        me.panel.add(me.IDID);
        this.me.main.add(me.panel);
        this.me.main.add(me.IDGroups);
        me.panel.add(me.IDEmail);
        me.panel.add(me.checkbox);
        me.checkbox.bind = [this.me.databinder, "isAdmin"];
        me.checkbox.width = 15;
        me.checkbox.label = "IsAdmin";
        me.IDGroups.width = "400";
        me.IDGroups.display = "name";
        me.IDGroups.bind = [this.me.databinder,"groups"];
        Group.find().then((data) => {
            me.IDGroups.items = data;
        });
    }
    createObject(): any {
        super.createObject();
        this.value.password = Math.random().toString(36).slice(-8); //random password
        notify("random password set: " + this.value.password, "info", { position: "right" });
        console.log("random password set: " + this.value.password);
    }
}
export async function test() {
    var ret = new UserView();
    ret["value"] =<User>( await User.findWithRelations())[0];
    return ret;
}
