import { Button } from "jassi/ui/Button";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "remote/jassi/base/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Customer } from "remote/northwind/Customer";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
type Me = {
    textbox1?: Textbox,
    textbox2?: Textbox,
    textbox3?: Textbox,
    textbox4?: Textbox,
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Customer" })
@$Class("northwind/CustomerView")
export class CustomerView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Customer;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
    }
    layout(me: Me) {
        me.textbox1 = new Textbox();
        me.textbox2 = new Textbox();
        me.textbox3 = new Textbox();
        me.textbox4 = new Textbox();
        me.main.isAbsolute = true;
        me.main.width = "400";
        me.main.height = "300";
        me.main.add(me.textbox1);
        me.main.add(me.textbox2);
        me.main.add(me.textbox3);
        me.main.add(me.textbox4);
        me.textbox1.x = 15;
        me.textbox1.y = 15;
        me.textbox1.bind(me.databinder, "id");
        me.textbox1.width = 65;
        me.textbox1.converter = new NumberConverter();
        me.textbox1.label = "id";
        me.textbox2.x = 95;
        me.textbox2.y = 15;
        me.textbox2.bind(me.databinder, "CompanyName");
        me.textbox2.label = "Company Name";
        me.textbox3.x = 15;
        me.textbox3.y = 60;
        me.textbox3.label = "Contact Title";
        me.textbox3.bind(me.databinder, "ContactTitle");
        me.textbox4.x = 190;
        me.textbox4.y = 60;
        me.textbox4.label = "Contact Name";
        me.textbox4.bind(me.databinder, "ContactName");
    }
}
export async function test() {
    var ret = new CustomerView;
    ret["value"] = <Customer>await Customer.findOne();
    return ret;
}
