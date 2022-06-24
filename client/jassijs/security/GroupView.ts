import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Group } from "jassijs/remote/security/Group";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{dbfullclassname}}"})
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
    }
}

export async function test(){
	var ret=new GroupView;
	
	ret["value"]=<Group>await Group.findOne();
	return ret;
}