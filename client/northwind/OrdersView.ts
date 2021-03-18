import { Calendar } from "jassi/ui/Calendar";
import { ObjectChooser } from "jassi/ui/ObjectChooser";
import { HTMLPanel } from "jassi/ui/HTMLPanel";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Orders } from "northwind/remote/Orders";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
type Me = {
    id?: Textbox;
    customername?: HTMLPanel;
    employeename?: HTMLPanel;
    chooseEmployee?: ObjectChooser;
    choosecustomer?: ObjectChooser;
    orderDate?: Calendar;
    requiredDate?: Calendar;
    shippedDate?: Calendar;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text" })
@$Class("northwind.OrdersView")
export class OrdersView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Orders;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "OrdersView" : "OrdersView " + this.value.id;
    }
    layout(me: Me) {
        me.id = new Textbox();
        me.customername = new HTMLPanel();
        me.employeename = new HTMLPanel();
        me.chooseEmployee = new ObjectChooser();
        me.choosecustomer = new ObjectChooser();
        me.orderDate = new Calendar();
        me.requiredDate = new Calendar();
        me.shippedDate = new Calendar();
        me.main.isAbsolute = true;
        me.main.height = "500";
        me.main.width = "500";
        me.main.add(me.id);
        me.main.add(me.customername);
        me.main.add(me.shippedDate);
        me.main.add(me.requiredDate);
        me.main.add(me.orderDate);
        me.main.add(me.choosecustomer);
        me.main.add(me.chooseEmployee);
        me.main.add(me.employeename);
        me.id.x = 9;
        me.id.y = 11;
        me.id.converter = new NumberConverter();
        me.id.bind(me.databinder, "id");
        me.id.label = "Order ID";
        me.id.width = 70;
        me.customername.x = 10;
        me.customername.y = 65;
        me.customername.width = 375;
        me.customername.template = "{{id}} {{CompanyName}}";
        me.customername.bind(me.databinder, "Customer");
        me.customername.value = "VINET Vins et alcools Chevalier";
        me.customername.label = "Customer";
        me.employeename.x = 111;
        me.employeename.y = 11;
        me.employeename.bind(me.databinder, "Employee");
        me.employeename.label = "Employee";
        me.employeename.width = 275;
        me.employeename.value = "5 Steven Buchanan";
        me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
        me.chooseEmployee.x = 390;
        me.chooseEmployee.y = 25;
        me.chooseEmployee.bind(me.databinder, "Employee");
        me.chooseEmployee.items = "northwind.Employees";
        me.choosecustomer.x = 390;
        me.choosecustomer.y = 70;
        me.choosecustomer.items = "northwind.Customer";
        me.choosecustomer.bind(me.databinder, "Customer");
        me.orderDate.x = 10;
        me.orderDate.y = 115;
        me.orderDate.bind(me.databinder, "OrderDate");
        me.orderDate.label = "Order Date";
        me.orderDate.width = 75;
        me.requiredDate.x = 100;
        me.requiredDate.y = 115;
        me.requiredDate.bind(me.databinder, "RequiredDate");
        me.requiredDate.label = "Required Date";
        me.requiredDate.width = 75;
        me.shippedDate.x = 190;
        me.shippedDate.y = 115;
        me.shippedDate.bind(me.databinder, "ShippedDate");
        me.shippedDate.width = 75;
        me.shippedDate.label = "Shipped Date";
    }
}
export async function test() {
    var ret = new OrdersView;
    ret["value"] = <Orders>await Orders.findOne({ relations: ["*"] });
    return ret;
}
