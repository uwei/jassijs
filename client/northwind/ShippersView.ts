import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Shippers } from "northwind/remote/Shippers";
import { DBObjectView, $DBObjectView, DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";



@$DBObjectView({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" })
@$Class("northwind.ShippersView")
export class ShippersView extends DBObjectView<Shippers> {
    get title() {
        return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
    }
    render() {
        return jc(Panel, {
            children: [
                jc(DBObjectViewToolbar, { view: this }),
                jc(Textbox, {
                    converter: new NumberConverter(),
                    bind: this.states.value.bind.id, //[me.databinder, "id"],
                    label: "Id",
                    width: 40,
                }),
                jc(Textbox, {
                    bind: this.states.value.bind.CompanyName,// [me.databinder, "CompanyName"],
                    label: "Company name",
                    width: 160
                }),
                jc("br"),
                jc(Textbox, {
                    width: 215,
                    bind: this.states.value.bind.Phone,//[me.databinder, "Phone"],
                    label: "Phone"
                })
            ]
        })
    }
}
export async function test() {
    var ret = new ShippersView();
    ret.value = <Shippers>await Shippers.findOne();
    return ret;
}
