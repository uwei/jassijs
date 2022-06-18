import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { OrderDetails } from "northwind/remote/OrderDetails";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
import { Textbox } from "jassijs/ui/Textbox";
type Me = {
    textbox1?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.OrderDetails" })
@$Class("northwind.DetailTest")
export class DetailTest extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
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
        me.textbox1.bind=[me.databinder,"Order.Customer.id"];
    }
}
export async function test() {
    var ret = new DetailTest();
   // ret.value.Order.Customer
    ret["value"] = <OrderDetails>await OrderDetails.findOne();//{ relations: ["Order","Order.Customer"] });
    return ret;
}
