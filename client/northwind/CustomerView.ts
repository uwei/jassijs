import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Customer } from "northwind/remote/Customer";
import { DBObjectView, $DBObjectView, DBObjectViewMe, DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";

@$DBObjectView({
    classname: "northwind.Customer",
    actionname: "Northwind/Customers",
    icon: "mdi mdi-nature-people"
})
@$Class("northwind.CustomerView")
export class CustomerView extends DBObjectView<Customer> {
  
    get title() {
        return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
    }
    render() {
        return jc(Panel, {
            children: [
                jc(DBObjectViewToolbar, { view: this }),
                jc(Textbox, {
                    bind: this.state.value.bind.id,
                    width: 65,
                    label: "id"
                }),
                jc(Textbox, {
                    label: "Contact Name",
                    bind: this.state.value.bind.ContactName,
                    width: 255
                }),
                jc("br"),
                jc(Textbox, {
                    label: "Contact Title",
                    bind: this.state.value.bind.ContactTitle,
                }),
                jc(Textbox, {
                    bind: this.state.value.bind.ContactName,
                    label: "Company Name",
                    width: 155
                }),
                jc("br"),
                jc(Textbox, {
                    bind: this.state.value.bind.Address,
                    label: "Address",
                    width: 325
                }),
                jc("br"),
                jc(Textbox, {
                    label: "Postal Code",
                    bind: this.state.value.bind.PostalCode,
                    width: 90
                }),
                jc(Textbox, {
                    label: "City",
                    width: 230,
                    bind: this.state.value.bind.City,
                }),
                jc("br"),
                jc(Textbox, {
                    bind: this.state.value.bind.Region,
                    label: "Region"
                }),
                jc(Textbox, {
                    label: "Country",
                    bind: this.state.value.bind.Country,
                    width: 155,
                }),
                jc("br"),
                jc(Textbox, {
                    label: "Phone",
                    bind: this.state.value.bind.Phone,
                }),
                jc(Textbox, {
                    label: "Fax",
                    bind: this.state.value.bind.Fax,
                    width: 155,
                })
            ]
        });
    }
   
}
export async function test() {
    var ret = new CustomerView;
    ret.value = <Customer>await Customer.findOne();
    return ret;
}
