import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";

type Me = {
}

@$Class("jassijs/ui/PropertyEditors/TableColumnImport")
export class TableColumnImport extends Panel {
    me: Me;
    propertyEditor:PropertyEditor;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        //default dataformat
        //default numberformat
        //selectable table fields to import
        //button import fields
        this.config({});
	}
}

export async function test(){
	var ret=new TableColumnImport();
	return ret;
}