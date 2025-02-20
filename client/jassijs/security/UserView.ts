import { HTMLComponent } from "jassijs/ui/Component";
import { Select } from "jassijs/ui/Select";
import { Checkbox } from "jassijs/ui/Checkbox";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { User } from "jassijs/remote/security/User";
import { DBObjectView,  $DBObjectView, DBObjectViewToolbar, DBObjectViewProperties } from "jassijs/ui/DBObjectView";

import { notify } from "jassijs/ui/Notify";
import { $ActionProvider } from "jassijs/base/Actions";
import { Group } from "jassijs/remote/security/Group";
import { jc } from "jassijs/ui/Component";
interface UserViewProperties extends DBObjectViewProperties<User> {
    items?: Group[];
}
@$DBObjectView({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline", queryname: "findWithRelations" })
@$Class("jassijs/security/UserView")
export class UserView extends DBObjectView<User, UserViewProperties> {
    get title() {
        return this.value === undefined ? "User" : "User " + this.value.email;
    }
    render() {
        Group.find().then((data) => {
            this.state.items.current = <any>data;
        });
        return jc(Panel, {
            children: [
                jc(DBObjectViewToolbar, { view: this }),
                jc(Textbox, { converter: new NumberConverter(), bind: this.state.value.bind.id, label: "Id" }),
                jc(Textbox, { bind: this.state.value.bind.email, label: "E-Mail" }),
                jc(Checkbox, { bind: this.state.value.bind.isAdmin, label: "IsAdmin" }),
                jc("br", {}),
                jc(Select, {
                    bind: this.state.value.bind.groups, width: 200,
                    multiple: true,
                    items: this.state.items, label: "Groups", display: "name"
                })
            ]
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
    var u = <User>(await User.findWithRelations())[0];
    var ret = new UserView({
        value: u
    });
    return ret;
}
