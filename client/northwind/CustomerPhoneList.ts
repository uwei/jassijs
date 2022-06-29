import { Table } from "jassijs/ui/Table";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
import { Customer } from "northwind/remote/Customer";
import { Button } from "jassijs/ui/Button";
type Me = {
    table?: Table;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/CustomerPhoneList")
export class CustomerPhoneList extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        var _this = this;
        me.table = new Table();
        this.config({
            children: [
                me.table.config({
                    width: "100%",
                    height: "100%",
                    showSearchbox: true,
                    options: {
                        autoColumns: false,
                        columns: [
                            { title: "Company Name:", field: "CompanyName" },
                            { title: "Contact:", field: "ContactName" },
                            { title: "Phone:", field: "Phone" },
                            { title: "Fax:", field: "Fax" }
                        ]
                    }
                })
            ]
        });
        this.width = "100%";
        this.height = "100%";
        this.setData();
    }
    async setData() {
        var all = await Customer.find();
        this.me.table.items = all;
        //  new Customer().Fax
    }
    @$Action({ name: "Northwind/Customer Phone List", icon: "mdi-script-text-play-outline" })
    static showDialog() {
        windows.add(new CustomerPhoneList(), "Customer Phone List");
    }
}
export async function test() {
    var ret = new CustomerPhoneList();
    alert(ret.me.table.height);
    return ret;
}
