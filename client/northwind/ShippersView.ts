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
    phone?: Textbox;
    companyName?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" })
@$Class("northwind.ShippersView")
export class ShippersView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Shippers;
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
        me.phone = new Textbox();
        me.companyName = new Textbox();
        this.me.main.config({
            isAbsolute:true,
            width: "626",
            height: "150",
            children: [
                me.id.config({
                    converter: new NumberConverter(),
                    bind: [me.databinder, "id"],
                    label: "Id",
                    width: 40,
                    x: 5,
                    y: 0
                }),
                me.phone.config({
                    x: 5,
                    y: 50,
                    width: 215,
                    bind: [me.databinder, "Phone"],
                    label: "Phone"
                }),
                me.companyName.config({
                    x: 60,
                    y: 0,
                    bind: [me.databinder, "CompanyName"],
                    label: "Company name",
                    width: 160
                })
            ]
        });
    }
}
export async function test() {
    var ret = new ShippersView;
    ret["value"] = <Shippers>await Shippers.findOne();
    return ret;
}
