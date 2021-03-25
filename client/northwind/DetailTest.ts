import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { OrderDetails } from "northwind/remote/OrderDetails";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
import { Textbox } from "jassi/ui/Textbox";
type Me = {
    textbox1?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.OrderDetails" })
@$Class("northwind.DetailTest")
export class DetailTest extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: OrderDetails;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "DetailTest" : "DetailTest " + this.value.id;
    }
    layout(me: Me) {
        me.textbox1 = new Textbox();
        me.main.add(me.textbox1);
        me.textbox1.bind(me.databinder,"Order.Customer.id");
    }
}
export async function test() {
    var ret = new DetailTest();
   // ret.value.Order.Customer
    ret["value"] = <OrderDetails>await OrderDetails.findOne({ relations: ["Order","Order.Customer"] });
    return ret;
}
