import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Kunde } from "de/remote/Kunde";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"de.Kunde"})
@$Class("de.myview2")
export class myview2 extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    declare value: Kunde;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "myview2" : "myview2 " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new myview2();
	
	ret["value"]=<Kunde>await Kunde.findOne();
	return ret;
}