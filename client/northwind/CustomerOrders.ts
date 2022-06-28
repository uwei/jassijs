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
type Me = {
    IDChooseCustomer?: ObjectChooser;
    databinderCustomer?: Databinder;
    htmlpanel?: HTMLPanel;
    boxpanel?: BoxPanel;
    boxpanel2?: BoxPanel;
    htmlpanel2?: HTMLPanel;
    IDOrders?: Table;
    databinderOrder?: Databinder;
    table?: Table;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/CustomerOrders")
export class CustomerOrders extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        var _this = this;
        me.IDChooseCustomer = new ObjectChooser();
        me.databinderCustomer = new Databinder();
        me.htmlpanel = new HTMLPanel();
        me.boxpanel = new BoxPanel();
        me.boxpanel2 = new BoxPanel();
        me.htmlpanel2 = new HTMLPanel();
        me.IDOrders = new Table();
        me.databinderOrder = new Databinder();
        me.table = new Table();
        this.config({ children: [
                me.databinderCustomer.config({}),
                me.boxpanel.config({ children: [
                        me.boxpanel2.config({
                            children: [
                                me.htmlpanel.config({
                                    width: 185,
                                    value: "Berglunds snabbköp",
                                    bind: [me.databinderCustomer, "CompanyName"],
                                    label: "Company Name",
                                    height: 20
                                }),
                                me.IDChooseCustomer.config({
                                    width: 25,
                                    bind: [me.databinderCustomer, "this"],
                                    items: "northwind.Customer",
                                    onchange: function (event) {
                                        _this.customerChanged();
                                    }
                                }),
                                me.htmlpanel2.config({
                                    width: 110,
                                    value: " ",
                                    bind: [me.databinderCustomer, "Country"],
                                    label: "Country"
                                })
                            ],
                            horizontal: true
                        }),
                        me.IDOrders.config({
                            width: "100%",
                            label: "Click an order...",
                            height: "180"
                        }),
                        me.table.config({
                            width: "100%",
                            bindItems: [me.databinderOrder, "Details"],
                            height: "140",
                            label: "...to see order details"
                        })
                    ] }),
                me.databinderOrder.config({})
            ] });
        me.IDOrders.selectComponent = me.databinderOrder;
        this.setData();
        this.width = "100%";
        this.height = "100%";
    }
    @$Action({name:"Northwind/Cutomer Orders",icon:"mdi-script-text-play-outline"})
    static showDialog(){
        windows.add(new CustomerOrders(),"Customer Orders");
    }
    async customerChanged() {
        var cust: Customer = this.me.databinderCustomer.value;
        var orders = await Orders.find({ where: "Customer.id=:param",
            whereParams: { param: cust.id } });
        this.me.IDOrders.items = orders;
        this.me.databinderOrder.value=orders[0];
    }
    async setData() {
        var all = await Customer.find();
        this.me.databinderCustomer.value = all[0];
        this.customerChanged();
        //        this.me.IDChooseCustomer.items = all;
        //      this.me.databinderCustomer.value = all[0];
    }
}
export async function test() {
    var ret = new CustomerOrders();
    return ret;
}
