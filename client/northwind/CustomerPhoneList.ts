import { Table } from "jassijs/ui/Table";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
import { Customer } from "northwind/remote/Customer";
import { Button } from "jassijs/ui/Button";
import { Tabulator } from "tabulator-tables";
import { jc, Component, ComponentProperties } from "jassijs/ui/Component";
import { States } from "jassijs/ui/State";

type Me = {
    table?: Table;
};


@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/CustomerPhoneList")
export class CustomerPhoneList extends Component<ComponentProperties> {
    declare refs: Me;
    constructor(props = {}) {
        super(props);
        this.setData();
    }
    render() {
        return jc(Table, {
            ref:this.refs.table,
            width: "600px",
            height: "500px",
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

        });
    }

    async setData() {
        var all = await Customer.find();
        this.refs.table.items = all;
        //  new Customer().Fax
    }
    @$Action({ name: "Northwind/Customer Phone List", icon: "mdi-script-text-play-outline" })
    static showDialog() {
        windows.add(new CustomerPhoneList(), "Customer Phone List");
    }
}
export async function test() {
    var ret = new CustomerPhoneList();
    //    alert(ret.me.table.height);
    return ret;
}
