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
type Me = {
    IDID?: Textbox;
    IDEmail?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "jassijs.security.User" })
@$Class("jassijs/UserView")
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
        me.IDID.bind = [me.databinder, "id"];
        me.IDID.width = 40;
        me.IDID.converter = new NumberConverter();
        me.IDID.label = "ID";
        me.IDID.x = 10;
        me.IDID.y = 5;
        me.IDEmail.bind = [me.databinder, "email"];
        me.IDEmail.label = "E-Mail";
        me.IDEmail.x = 70;
        me.IDEmail.y = 5;
        this.me.main.isAbsolute = true;
        this.me.main.height = "100";
        this.me.main.add(me.IDID);
        this.me.main.add(me.IDEmail);
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
    ret["value"] = <User>await User.findOne();
    return ret;
}
