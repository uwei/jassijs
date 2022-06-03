import { Button } from "jassijs/ui/Button";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { CSVImport } from "jassijs/util/CSVImport";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import { router } from "jassijs/base/Router";
import { OrderDetails } from "northwind/remote/OrderDetails";
import { Transaction } from "jassijs/remote/Transaction";
type Me = {
    htmlpanel1?: HTMLPanel;
    IDImport?: Button;
    htmlpanel2?: HTMLPanel;
    IDProtokoll?: HTMLPanel;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind.ImportData")
export class ImportData extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    @$Action({ name: "Northwind", icon: "mdi mdi-warehouse" })
    static async dummy() {


    }
    @$Action({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" })
    static async showDialog() {

        router.navigate("#do=northwind.ImportData");
    }
    async startImport() {
        var path = "https://uwei.github.io/jassijs/client/northwind/import";
        this.me.IDProtokoll.value = "";
        var s;
        s = await CSVImport.startImport(path + "/customers.csv", "northwind.Customer", { "id": "CustomerID" });
        this.me.IDProtokoll.value += "<br>Customer " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/employees.csv", "northwind.Employees", { "id": "EmployeeID" });
        this.me.IDProtokoll.value += "<br>Employees " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/shippers.csv", "northwind.Shippers", { "id": "shipperid" });
        this.me.IDProtokoll.value += "<br>Shippers " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/categories.csv", "northwind.Categories", { "id": "categoryid" });
        this.me.IDProtokoll.value += "<br>Categories " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/suppliers.csv", "northwind.Suppliers", { "id": "supplierid" });
        this.me.IDProtokoll.value += "<br>Suppliers " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/products.csv", "northwind.Products", { "id": "productid", "supplier": "supplierid", "category": "categoryid" });
        this.me.IDProtokoll.value += "<br>Products " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/orders.csv", "northwind.Orders", { "id": "orderid", "customer": "customerid", "employee": "employeeid" }, undefined, async function (data) {
            //before save remove old OrderDetails
            //   debugger;
            var ids = [];
            data.forEach((o) => { ids.push(o.id) });
            var all2 = await OrderDetails.find({ where: "Order.id in (:...ids)", whereParams: { ids: ids } });
            if (all2.length > 0) {
                var trans = new Transaction();
                for (var x = 0; x < all2.length; x++) {
                    trans.add(all2[x], all2[x].remove);
                }
                await trans.execute();
            }
        });
        this.me.IDProtokoll.value += "<br>Orders " + s;
        s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/order_details.csv", "northwind.OrderDetails", { "order": "orderid", "product": "productid" },undefined,(data)=>{
            debugger;
            data.forEach((o) => { delete o.id });//remove id is autoid
        });
        this.me.IDProtokoll.value += "<br>OrderDetails " + s;
        this.me.IDProtokoll.value += "<br>Fertig";
    }
    layout(me: Me) {
        var _this = this;
        me.htmlpanel1 = new HTMLPanel();
        me.IDImport = new Button();
        me.htmlpanel2 = new HTMLPanel();
        me.IDProtokoll = new HTMLPanel();
        this.add(me.htmlpanel1);
        this.add(me.IDImport);
        this.add(me.htmlpanel2);
        this.add(me.IDProtokoll);
        me.htmlpanel1.value = "Imports cvs-data from&nbsp;<a href='https://github.com/uwei/jassijs/tree/main/client/northwind/import' data-mce-selected='inline-boundary'>https://github.com/uwei/jassijs/tree/main/client/northwind/import</a><br/><br/>";
        me.htmlpanel1.newlineafter = true;
        me.IDImport.text = "Start Import";
        me.IDImport.onclick(function (event) {
            _this.startImport();
        });
        me.htmlpanel2.newlineafter = true;
    }
}
export async function test() {
    var ret = new ImportData();
    return ret;
}
