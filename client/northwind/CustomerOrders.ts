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
import { jc } from "jassijs/ui/Component";
import { DBObjectView, DBObjectViewProperties, DBObjectViewToolbar, ObjectViewToolbar } from "jassijs/ui/DBObjectView";

export interface CustomerOrdersProperties extends DBObjectViewProperties<Customer> {
    orders?: Orders[];
    order?: Orders;
}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/CustomerOrders")
export class CustomerOrders extends DBObjectView<Customer, CustomerOrdersProperties> {
    constructor(props: CustomerOrdersProperties = {}) {
        super(props);
        if(!props?.order)
            this.initData();
    }
    render() {
        var _this = this;
        return jc(Panel, {
            children: [
               jc(DBObjectViewToolbar,{ view: this }),
                 jc(HTMLPanel, {
                    width: 300,
                    value: "Blauer See Delikatessen",
                    bind: this.states.value.bind.CompanyName,
                    label: "Company Name",
                    height: 20
                }),
                jc(ObjectChooser, {
                    width: 25,
                    bind: this.states.value.bind,
                    items: "northwind.Customer",
                    onchange: function (event) {
                        _this.customerChanged();
                    }
                }),
                jc(HTMLPanel, {
                    width: 110,
                    value: " ",
                    bind: this.states.value.bind.Country,
                    label: "Country"
                }),
                jc(Table, {
                    bind: this.states.order.bind,
                    bindItems: this.states.orders.bind,
                    width: "100%",
                    label: "Click an order...",
                    height: "180"
                }),
                jc(Table, {
                    bindItems: this.states.order.bind.Details,
                    width: "100%",
                    height: "140",
                    label: "...to see order details"
                })

            ]
        });
    }
   
    @$Action({ name: "Northwind/Customer Orders", icon: "mdi-script-text-play-outline" })
    static showDialog() {
        windows.add(new CustomerOrders(), "Customer Orders");
    }
    async customerChanged() {
        var cust: Customer = this.states.value.current;
        this.states.orders.current = <Orders[]>await Orders.find({
            where: "Customer.id=:param",
            whereParams: { param: cust.id }
        });
        this.states.order.current=this.states.orders.current.length===0?undefined:this.states.orders.current[0];
        //    this.me.IDOrders.items = orders;
        //   this.me.databinderOrder.value = orders[0];
    }
    set value(value: Customer) {
        super.value = value;
        this.customerChanged();
    }
    async initData(){
        this.value = <Customer>await Customer.findOne();
    }

}
export async function test() {
    var ret = new CustomerOrders();
    
    return ret;
}
