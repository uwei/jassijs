import { Button } from "jassi/ui/Button";
import { HTMLPanel } from "jassi/ui/HTMLPanel";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { CSVImport } from "jassi/util/CSVImport";
import { $Action, $ActionProvider } from "jassi/base/Actions";
import { router } from "jassi/base/Router";
type Me = {
    htmlpanel1?: HTMLPanel;
    IDImport?: Button;
    htmlpanel2?: HTMLPanel;
    IDProtokoll?: HTMLPanel;
};
@$ActionProvider("jassi.base.ActionNode")
@$Class("northwind.ImportData")
export class ImportData extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    @$Action({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" })
	static async showDialog() {

		router.navigate("#do=northwind.ImportData");
	}
    async startImport() {
        var path="https://uwei.github.io/jassijs/client/northwind/import";
        this.me.IDProtokoll.value="";
        var s = await CSVImport.startImport(path+"/customers.csv", "northwind.Customer",{ "id": "CustomerID" });
        this.me.IDProtokoll.value+="<br>Customer "+s;
        s=await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/employees.csv", "northwind.Employees",{ "id": "EmployeeID" });
        this.me.IDProtokoll.value+="<br>Employees "+s;
        this.me.IDProtokoll.value+="<br>Fertig";
    }
    layout(me: Me) {
        var _this=this;
        me.htmlpanel1 = new HTMLPanel();
        me.IDImport = new Button();
        me.htmlpanel2 = new HTMLPanel();
        me.IDProtokoll = new HTMLPanel();
        this.add(me.htmlpanel1);
        this.add(me.IDImport);
        this.add(me.htmlpanel2);
        this.add(me.IDProtokoll);
        me.htmlpanel1.value = "Imports cvs-data from&nbsp;<a href='https://github.com/tmcnab/northwind-mongo' data-mce-selected='inline-boundary'>https://github.com/tmcnab/northwind-mongo</a><br>";
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
