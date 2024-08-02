import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Group } from "jassijs/remote/security/Group";
import { DBObjectView,$DBObjectView,DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";
@$DBObjectView({ classname: "jassijs.security.Group",icon: "mdi mdi-account-group",actionname: "Administration/Security/Groups" })
@$Class("jassijs/security/GroupView")
export class GroupView extends DBObjectView<Group> {
    get title() {
        return this.value===undefined? "GroupView":"GroupView "+this.value.id;
    }
    render() {
        return jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(Textbox,{ converter: new NumberConverter(),bind: this.states.value.bind.id,label: "Id" }),
                jc(Textbox,{ bind: this.states.value.bind.name,label: "Name" })
            ]
        });
    }
  
}
export async function test() {
    var gr=<Group>await Group.findOne();
        var ret = new GroupView({value: gr });
        return ret;
}
