import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Group } from "jassi/remote/security/Group";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{dbfullclassname}}"})
@$Class("jassi/security/GroupView")
export class GroupView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Group;
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