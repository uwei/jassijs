import { Checkbox } from "jassijs/ui/Checkbox";
import { Textbox } from "jassijs/ui/Textbox";
import { Repeater } from "jassijs/ui/Repeater";
import { Table } from "jassijs/ui/Table";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Databinder } from "jassijs/ui/Databinder";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Customer } from "northwind/remote/Customer";
import { Orders } from "northwind/remote/Orders";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
import { Products } from "northwind/remote/Products";
type Me = {
    databinder?: Databinder;
    repeater?: Repeater;
    textbox?: Textbox;
    htmlpanel?: HTMLPanel;
    checkbox?: Checkbox;
    htmlpanel3?: HTMLPanel;
    boxpanel?: BoxPanel;
    panel?: Panel;
    boxpanel2?: BoxPanel;
    htmlpanel2?: HTMLPanel;
    textbox2?: Textbox;
    htmlpanel22?: HTMLPanel;
    textbox22?: Textbox;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/ProductList")
export class ProductList extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        var _this = this;
        me.databinder = new Databinder();
        me.repeater = new Repeater();
        this.config({
            children: [
                me.databinder.config({}),
                me.repeater.config({
                    isAbsolute: false,
                    bind: [me.databinder, "this"],
                    createRepeatingComponent: function (me: Me) {
                        me.textbox = new Textbox();
                        me.htmlpanel = new HTMLPanel();
                        me.checkbox = new Checkbox();
                        me.htmlpanel3 = new HTMLPanel();
                        me.boxpanel = new BoxPanel();
                        me.panel = new Panel();
                        me.boxpanel2 = new BoxPanel();
                        me.htmlpanel2 = new HTMLPanel();
                        me.textbox2 = new Textbox();
                        me.htmlpanel22 = new HTMLPanel();
                        me.textbox22 = new Textbox();
                        me.repeater.design.config({ children: [
                                me.htmlpanel3.config({ value: " " }),
                                me.boxpanel.config({
                                    children: [
                                        me.htmlpanel.config({ value: "Product Name:", width: "150" }),
                                        me.textbox.config({
                                            bind: [me.repeater.design.databinder, "ProductName"],
                                            readOnly: true, 
                                            width: 290
                                        }),
                                        me.checkbox.config({
                                            bind: [me.repeater.design.databinder, "Discontinued"],
                                            text: "Discontinued"
                                        }),
                                        me.panel.config({})
                                    ],
                                    horizontal: true
                                }),
                                me.boxpanel2.config({
                                    children: [
                                        me.htmlpanel2.config({ value: "Quantity Per Unit:", width: "150" }),
                                        me.textbox2.config({
                                            readOnly: true,
                                            width: 175,
                                            bind: [me.repeater.design.databinder, "QuantityPerUnit"]
                                        }),
                                        me.htmlpanel22.config({ value: "&nbsp; &nbsp; &nbsp;Unit Price:", width: 110 }),
                                        me.textbox22.config({
                                            readOnly: true,
                                            width: 100,
                                            bind: [me.repeater.design.databinder, "UnitPrice"],
                                            format: "$ #.##0,00"
                                        })
                                    ],
                                    horizontal: true
                                })
                            ] });
                    }
                })
            ]
        });
        this.setData();
    }
    @$Action({ name: "Northwind/Product List", icon: "mdi mdi-reproduction" })
    static showDialog() {
        windows.add(new ProductList(), "ProductList");
    }
    async setData() {
        var all:Products[] =<any> await Products.find({});
        all.sort((a,b)=>{return a.ProductName.localeCompare(b.ProductName)});
        this.me.databinder.value = all;
        
        //        this.me.IDChooseCustomer.items = all;
        //      this.me.databinderCustomer.value = all[0];
    }
}
export async function test() {
    var ret = new ProductList();
    return ret;
}
