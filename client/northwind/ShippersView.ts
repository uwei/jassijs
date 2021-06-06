import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Shippers } from "northwind/remote/Shippers";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    id?: Textbox;
    companyName?: Textbox;
    phone?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Shippers",actionname:"Northwind/Shippers",icon:"mdi mdi-truck-delivery" })
@$Class("northwind.ShippersView")
export class ShippersView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Shippers;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
    }
    layout(me: Me) {
        me.id = new Textbox();
        me.companyName = new Textbox();
        me.phone = new Textbox();
        me.main.add(me.id);
        me.main.isAbsolute = true;
        me.main.height = 110;
        me.main.add(me.phone);
        me.main.add(me.companyName);
        this.width = 626;
        this.height = 146;
        me.id.converter = new NumberConverter();
        me.id.bind(me.databinder, "id");
        me.id.label = "Id";
        me.id.width = 40;
        me.id.x = 5;
        me.id.y = 0;
        me.companyName.x = 60;
        me.companyName.y = 0;
        me.companyName.bind(me.databinder, "CompanyName");
        me.companyName.label = "Company name";
        me.companyName.width = 160;
        me.phone.x = 5;
        me.phone.y = 50;
        me.phone.width = 215;
        me.phone.bind(me.databinder, "Phone");
        me.phone.label = "Phone";
    }
}
export async function test() {
    var ret = new ShippersView;
    ret["value"] = <Shippers>await Shippers.findOne();
    return ret;
}
